const express = require("express")
const {
  registerForEvent,
  getEventRegistrations,
  getMyRegistrations,
  cancelRegistration,
} = require("../controllers/registration.controller")

const router = express.Router({ mergeParams: true })

const { protect, authorize } = require("../middleware/auth")

router
  .route("/")
  .post(protect, authorize("attendee"), registerForEvent)
  .get(protect, authorize("organizer"), getEventRegistrations)

router.route("/me").get(protect, authorize("attendee"), getMyRegistrations)

router.route("/:id").delete(protect, cancelRegistration)

module.exports = router
