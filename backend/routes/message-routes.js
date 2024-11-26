const express = require('express')
const router = express.Router();
const { getMessages, getUsersForSidebar, sendMessage, getUnread, updateReadStatus } = require("../app/controllers/messageCtrl");


router.get("/users", getUsersForSidebar);
router.get("/unread", getUnread);
router.get("/:id", getMessages);

router.post("/send/:id", sendMessage);
router.put('/:id', updateReadStatus)

module.exports = router