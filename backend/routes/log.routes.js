const express = require("express")
const { getLogs, getEventLogs } = require("../controllers/log.controller")

const router = express.Router({ mergeParams: true })

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(protect, authorize("organizer"), getEventLogs)

router.route("/all").get(protect, authorize("organizer"), getLogs)

module.exports = router
