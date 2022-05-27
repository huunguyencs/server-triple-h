const express = require('express');
const router = express.Router();
const MessageController = require('../Controllers/message.controller');
const auth = require('../Middlewares/auth');

router.post('/access_conversation', auth, MessageController.accessConversation);
router.post('/create_message', auth, MessageController.createMessage);
router.get('/get_conversations', auth, MessageController.getConversations);
router.get('/get_messages/:id', auth, MessageController.getMessages);
router.delete('/delete_conversation/:id', auth, MessageController.deleteConversation);
router.patch('/seen_message', auth, MessageController.seenMessage);
router.post('/create_group', auth, MessageController.createConversationGroup);
router.patch('/rename', auth, MessageController.renameConversation);
router.patch('/group_add', auth, MessageController.conversationGroupAdd);
router.patch('/group_move', auth, MessageController.conversationGroupRemove)
router.get('/:id', auth, MessageController.getConversation);
module.exports = router;