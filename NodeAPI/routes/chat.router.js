const express = require("express")
const router = express.Router()

const chatController = require("../controller/chat.controller")

router.get("/:uid", chatController.getChat)
router.get("/message/:user_id/:partner_id", chatController.get_message)

module.exports = router