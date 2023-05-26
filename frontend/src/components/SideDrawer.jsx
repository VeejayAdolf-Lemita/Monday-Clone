import { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, Box, TextField } from '@mui/material';
import { AppBar, Tabs, Tab } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTasksContext } from '../hooks/useTasksContext';
import { debounce } from 'lodash';
import NoMsg from '../assets/pulse-page-empty-state.svg';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';

const CustomTab = ({ icon, label, ...rest }) => (
  <Tab
    {...rest}
    label={
      <div style={{ display: 'flex', alignItems: 'center', color: '#000', background: '#fff' }}>
        {icon}
        {label}
      </div>
    }
  />
);

const SideDrawer = ({ subtask, task }) => {
  const { user } = useAuthContext();
  const { dispatch } = useTasksContext();
  const [isDrawOpen, setIsDrawOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [messageContent, setMessageContent] = useState();
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  console.log(subtask._id);
  const addMessageToSubtask = async () => {
    try {
      if (!messageContent) {
        // Validate if message content is provided
        console.error('Message content is required');
        return;
      }

      const res = await axios.post(
        `/api/tasks/${task._id}/subtasks/${subtask._id}/messages`,
        {
          sender: user.email,
          content: messageContent,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      dispatch({
        type: 'ADD_MESSAGE_TO_SUBTASK',
        payload: { data: res.data, taskId: task._id },
      });
      // Handle the response or perform additional actions as needed

      // Clear the message content
      fetchMessages();
      setMessageContent('');
    } catch (error) {
      console.error('Error adding message:', error);
      // Handle the error appropriately
    }
  };

  const addReplyToMessage = async (messageId) => {
    try {
      if (!replyContent) {
        // Validate if reply content is provided
        console.error('Reply content is required');
        return;
      }

      const res = await axios.post(
        `/api/tasks/${task._id}/subtasks/${subtask._id}/messages/${messageId}/replies`,
        {
          sender: user.email,
          content: replyContent,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      dispatch({
        type: 'ADD_REPLY_TO_MESSAGE',
        payload: { data: res.data, taskId: task._id, subtaskId: subtask._id, messageId },
      });

      // Clear the reply content
      setReplyContent('');
      setSelectedMessageId(null);
    } catch (error) {
      console.error('Error adding reply:', error);
      // Handle the error appropriately
    }
  };
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/tasks/${task._id}/subtasks/${subtask._id}/messages`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Check if there are new messages
      const existingMessages = subtask.messages || [];
      if (existingMessages.length !== res.data.length) {
        // Fetch replies for each message
        const messagesWithReplies = await Promise.all(
          res.data.map(async (message) => {
            const replyRes = await axios.get(
              `/api/tasks/${task._id}/subtasks/${subtask._id}/messages/${message._id}/replies`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            );
            return {
              ...message,
              replies: replyRes.data,
            };
          }),
        );

        dispatch({
          type: 'SET_MESSAGES',
          payload: {
            taskId: task._id,
            subtaskId: subtask._id,
            data: messagesWithReplies,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle the error appropriately
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addMessageToSubtask();
    }
  };
  const handleInputChange = debounce((value) => {
    setMessageContent(value);
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleReplyKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addMessageToSubtask();
      addReplyToMessage(selectedMessageId);
    }
  };

  return (
    <>
      <Box sx={{}} onClick={() => setIsDrawOpen(true)}>
        <ChatBubbleOutlineIcon />
      </Box>
      <Drawer anchor='right' open={isDrawOpen} onClose={() => setIsDrawOpen(false)}>
        <Box height={80} />
        <Box sx={{ minWidth: '45vw', padding: 2 }}>
          <CloseIcon
            sx={{ color: '#00000075', cursor: 'pointer' }}
            onClick={() => setIsDrawOpen(false)}
          />
          <h2 style={{ marginTop: 0, marginBottom: 7 }}>{subtask.name}</h2>
          <AppBar position='static' sx={{ marginBottom: 2, padding: 0 }}>
            <Tabs value={value} onChange={handleChange} aria-label='Tabs' sx={{ bgcolor: '#fff' }}>
              <CustomTab
                icon={
                  <HomeOutlinedIcon sx={{ color: '#000', marginRight: '4px', fontSize: '16px' }} />
                }
                label='Updates'
                id='tab-0'
              />
            </Tabs>
          </AppBar>

          <form>
            <TextField
              label='Write an update...'
              variant='outlined'
              fullWidth
              size='small'
              value={messageContent}
              sx={{ marginBottom: '5vh' }}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </form>
          <div style={{ height: '60vh', overflow: 'auto' }}>
            {subtask && subtask.messages && subtask.messages.length > 0 ? (
              subtask.messages.map((message) => (
                <div style={{ margin: '0 auto 16px auto', maxWidth: '40vw' }}>
                  <Box sx={{ border: '1px solid lightgrey', borderRadius: '4px', padding: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <AccountCircleIcon sx={{ fontSize: 50, color: '#3e753e' }} />
                      <span>{message.sender}</span>
                    </div>
                    <p style={{ marginBottom: 80 }}>{message.content}</p>
                    <Box
                      sx={{
                        border: '1px solid lightgrey',
                        borderRadius: '4px',
                        padding: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease', // Add a transition for smooth effect
                        '&:hover': {
                          backgroundColor: 'lightgrey', // Change the background color on hover
                        },
                      }}
                      onClick={() => setSelectedMessageId(message._id)}
                    >
                      <ReplyOutlinedIcon /> Reply
                    </Box>
                    {/* Display replies */}
                    {message.replies && message.replies.length > 0 && (
                      <div>
                        {message.replies.map((reply) => (
                          <Box
                            sx={{
                              border: '1px solid lightgrey',
                              borderRadius: '4px',
                              padding: '8px',
                              marginTop: 2,
                              marginBottom: 2,
                            }}
                            key={reply._id}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 2,
                              }}
                            >
                              <AccountCircleIcon sx={{ fontSize: 50, color: '#3e753e' }} />
                              <p>{reply.sender}</p>
                            </div>
                            <p>{reply.content}</p>
                          </Box>
                        ))}
                      </div>
                    )}
                    {selectedMessageId === message._id && (
                      <div>
                        <TextField
                          label='Reply to message...'
                          variant='outlined'
                          fullWidth
                          size='small'
                          value={replyContent}
                          sx={{ marginBottom: '2vh', marginTop: '2vh' }}
                          onChange={(e) => setReplyContent(e.target.value)}
                          onKeyDown={handleReplyKeyDown}
                        />
                      </div>
                    )}
                  </Box>
                </div>
              ))
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src={NoMsg} alt='no msg' width={400} />
                <p style={{ fontWeight: 'bold', fontSize: '24px', margin: 0 }}>
                  No updates yet for this item
                </p>
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '16px',
                    maxWidth: 400,
                    fontWeight: 'light',
                    margin: 0,
                  }}
                >
                  Be the first one to update about progress or mention someone to share with your
                  team members
                </p>
              </div>
            )}
          </div>
        </Box>
      </Drawer>
    </>
  );
};

export default SideDrawer;
