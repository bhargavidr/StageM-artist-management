import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, TextField, Button, Badge } from "@mui/material";
import { startGetUsers, startGetMessages, startSendMessage, startGetUnreadMessages,startUpdateRead } from "../services/redux-store/actions/messageAction";
import { setLoader } from "../services/redux-store/actions/userAction";
import { useTheme } from "@emotion/react";

const Messages = () => {
  const { isLoading, users, messages, unreadMessages } = useSelector((state) => state.messages);
  const { account } = useSelector((state) => state.user);
  const [msg, setMsg] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const dispatch = useDispatch();
  const theme = useTheme()

  useEffect(() => {
    dispatch(startGetUsers()); 
    dispatch(startGetUnreadMessages())
  }, [dispatch]);

  const displayNameWithBadge = (user) => {
    if(!unreadMessages){
        return <ListItemText primary={user.username} />
    }
    const count = unreadMessages.reduce((acc, message) => {
        return message.senderId === user.userId ? acc + 1 : acc;
    }, 0);

    if (count > 0){
        return <Badge badgeContent={count} color="secondary">
                    <ListItemText primary={user.username} />
                </Badge> 
    } else {
        return <ListItemText primary={user.username} />
    }
  }

  const openChat = (userId) => {
    dispatch(startGetMessages(userId)); 
    dispatch(startUpdateRead(userId))
    setSelectedUser(userId)
  };

  const sendMessage = () => {
    dispatch(startSendMessage(selectedUser, msg))
    setMsg('')
  }


  return (
    <Grid container spacing={2} style={{ height: "60vh", mx: 2 }}>
      {/* Users List */}
      <Grid item md={3} xs={12} style={{ overflowY: "auto", borderRight: "1px solid #ddd" }}>
        {isLoading ? (
          <Typography variant="h6" align="center">
            Loading users...
          </Typography>
        ) : (
          <List>
            {users.map((user) => (
              <ListItem key={user._id} button onClick={() => openChat(user.userId)}>
                <ListItemAvatar>
                  <Avatar src={user.pfp} alt={user.username} />
                </ListItemAvatar>
                {displayNameWithBadge(user)}                
              </ListItem>
            ))}
          </List>
        )}
      </Grid>

      {/* Messages */}
      <Grid item md={8} xs={12} style={{ padding: "1rem" }}>
        {messages ? messages.length === 0 ? (
            <Box style={{ display: "flex",overflowY: "auto", height:'70vh', flexDirection:'column', justifyContent: "flex-end" }}>
                <TextField fullWidth size="small" placeholder="Start your conversation...."
                        value = {msg} onChange={(e) => setMsg(e.target.value)}
                        InputProps={{ endAdornment: <Button onClick={sendMessage}>Send</Button>}}
                />
            </Box>          
        ) : (
          <Box style={{ display: "flex",overflowY: "auto", height:'70vh', flexDirection:'column', justifyContent: "flex-end"  }}>
            {messages.map((msg) => (
              <Box
                key={msg._id}
                style={{
                  display: "flex",
                  justifyContent: msg.senderId === account._id ? "flex-end" : "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <Box
                  style={{
                    maxWidth: "70%",
                    padding: "0.8rem",
                    borderRadius: "10px",
                    backgroundColor: msg.senderId === account._id ? theme.palette.secondary.main : "#f0f0f0",
                    color: msg.senderId === account._id ? "#fff" : "#000",
                  }}
                >
                  <Typography variant="body1">{msg.message}</Typography>
                  <Typography variant="caption" style={{ display: "block", textAlign: "right" }}>
                    {msg.timestamp}
                  </Typography>
                </Box>
              </Box>
            ))}
            <TextField fullWidth size="small" 
                        value = {msg} onChange={(e) => setMsg(e.target.value)}
                        InputProps={{ endAdornment: <Button onClick={sendMessage}>Send</Button>}}
            />
          </Box>
        ) : <Typography variant="h6" align="center">
        Select a user to start a conversation
      </Typography>}
      </Grid>
    </Grid>
  );
};

export default Messages;
