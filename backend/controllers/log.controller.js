const Log = require("../models/Log")
const Event = require("../models/Event")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Get logs for organizer's events
// @route   GET /api/logs
// @access  Private (Organizers only)
exports.getLogs = asyncHandler(async (req, res, next) => {
  // Check if user is an organizer
  if (req.user.role !== "organizer") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access logs`, 403))
  }

  // Get all events created by this organizer
  const events = await Event.find({ organizer: req.user.id })
  const eventIds = events.map((event) => event._id)

  // Get logs for these events
  const logs = await Log.find({ eventId: { $in: eventIds } }).sort({ timestamp: -1 })

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs,
  })
})

// @desc    Get logs for a specific event
// @route   GET /api/events/:eventId/logs
// @access  Private (Event organizer only)
exports.getEventLogs = asyncHandler(async (req, res, next) => {
  const eventId = req.params.eventId

  // Check if event exists
  const event = await Event.findById(eventId)

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${eventId}`, 404))
  }

  // Check if user is the event organizer
  if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view logs for this event`, 403))
  }

  const logs = await Log.find({ eventId }).sort({ timestamp: -1 })

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs,
  })
})
