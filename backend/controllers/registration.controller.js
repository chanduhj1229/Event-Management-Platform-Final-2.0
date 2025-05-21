const Registration = require("../models/Registration")
const Event = require("../models/Event")
const Log = require("../models/Log")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Register for an event
// @route   POST /api/events/:eventId/register
// @access  Private (Attendees only)
exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const eventId = req.params.eventId

  // Check if user is an attendee
  if (req.user.role !== "attendee") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to register for events`, 403))
  }

  // Check if event exists
  const event = await Event.findById(eventId).populate("registrationsCount")

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${eventId}`, 404))
  }

  // Check if event is in the past
  if (new Date(event.date) < new Date()) {
    return next(new ErrorResponse(`Cannot register for past events`, 400))
  }

  // Check if event is at capacity
  if (event.registrationsCount >= event.capacity) {
    return next(new ErrorResponse(`Event has reached maximum capacity`, 400))
  }

  // Check if user is already registered
  const existingRegistration = await Registration.findOne({
    event: eventId,
    attendee: req.user.id,
  })

  if (existingRegistration) {
    return next(new ErrorResponse(`You are already registered for this event`, 400))
  }

  // Create registration
  const registration = await Registration.create({
    event: eventId,
    attendee: req.user.id,
    notes: req.body.notes,
  })

  // Create log entry
  await Log.create({
    eventId: event._id,
    eventTitle: event.title,
    userId: req.user.id,
    userName: req.user.name,
    action: "register",
    details: req.body.notes,
  })

  res.status(201).json({
    success: true,
    data: registration,
  })
})

// @desc    Get registrations for an event
// @route   GET /api/events/:eventId/registrations
// @access  Private (Event organizer only)
exports.getEventRegistrations = asyncHandler(async (req, res, next) => {
  const eventId = req.params.eventId

  // Check if event exists
  const event = await Event.findById(eventId)

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${eventId}`, 404))
  }

  // Check if user is the event organizer
  if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view registrations for this event`, 403))
  }

  const registrations = await Registration.find({ event: eventId }).populate({
    path: "attendee",
    select: "name email",
  })

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations,
  })
})

// @desc    Get registrations for logged in attendee
// @route   GET /api/registrations/me
// @access  Private (Attendees only)
exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
  // Check if user is an attendee
  if (req.user.role !== "attendee") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this route`, 403))
  }

  const registrations = await Registration.find({ attendee: req.user.id }).populate({
    path: "event",
    populate: {
      path: "organizer",
      select: "name email",
    },
  })

  res.status(200).json({
    success: true,
    count: registrations.length,
    data: registrations,
  })
})

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private (Registration owner only)
exports.cancelRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id)

  if (!registration) {
    return next(new ErrorResponse(`Registration not found with id of ${req.params.id}`, 404))
  }

  // Check if user is the registration owner
  if (registration.attendee.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to cancel this registration`, 403))
  }

  await registration.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
