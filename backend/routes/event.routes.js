const express = require("express")
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getOrganizerStats,
} = require("../controllers/event.controller")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

// Include other resource routers
const registrationRouter = require("./registration.routes")
const logRouter = require("./log.routes")

// Re-route into other resource routers
router.use("/:eventId/register", registrationRouter)
router.use("/:eventId/registrations", registrationRouter)
router.use("/:eventId/logs", logRouter)

router.route("/").get(getEvents).post(protect, authorize("organizer"), createEvent)

router.route("/organizer").get(protect, authorize("organizer"), getOrganizerEvents)

router.route("/stats").get(protect, authorize("organizer"), getOrganizerStats)

router
  .route("/:id")
  .get(getEvent)
  .put(protect, authorize("organizer"), updateEvent)
  .delete(protect, authorize("organizer"), deleteEvent)

module.exports = router
