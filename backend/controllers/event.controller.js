const Event = require("../models/Event")
const Registration = require("../models/Registration")
const Log = require("../models/Log")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Get all events (public)
// @route   GET /api/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find()
    .populate({
      path: "organizer",
      select: "name email",
    })
    .populate("registrationsCount")

  // Format events for public view
  const formattedEvents = await Promise.all(
    events.map(async (event) => {
      const isRegistered = req.user ? await Registration.exists({ event: event._id, attendee: req.user.id }) : false

      return {
        _id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        imageUrl: event.imageUrl,
        registrationsCount: event.registrationsCount,
        organizer: {
          _id: event.organizer._id,
          name: event.organizer.name,
          email: event.organizer.email,
        },
        isRegistered,
      }
    }),
  )

  res.status(200).json({
    success: true,
    count: formattedEvents.length,
    data: formattedEvents,
  })
})

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate({
      path: "organizer",
      select: "name email",
    })
    .populate("registrationsCount")

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404))
  }

  // Log view action if user is logged in
  if (req.user) {
    await Log.create({
      eventId: event._id,
      eventTitle: event.title,
      userId: req.user.id,
      userName: req.user.name,
      action: "view",
    })

    // Check if user is registered
    const isRegistered = await Registration.exists({
      event: event._id,
      attendee: req.user.id,
    })

    event.isRegistered = isRegistered
  }

  res.status(200).json({
    success: true,
    data: event,
  })
})

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizers only)
exports.createEvent = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.organizer = req.user.id

  // Check if user is an organizer
  if (req.user.role !== "organizer") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to create events`, 403))
  }

  const event = await Event.create(req.body)

  // Create log entry
  await Log.create({
    eventId: event._id,
    eventTitle: event.title,
    userId: req.user.id,
    userName: req.user.name,
    action: "create",
  })

  res.status(201).json({
    success: true,
    data: event,
  })
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizers only)
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id)

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is the event organizer
  if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this event`, 403))
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  // Create log entry
  await Log.create({
    eventId: event._id,
    eventTitle: event.title,
    userId: req.user.id,
    userName: req.user.name,
    action: "update",
  })

  res.status(200).json({
    success: true,
    data: event,
  })
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizers only)
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is the event organizer
  if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this event`, 403))
  }

  // Save event title before deletion for log
  const eventTitle = event.title

  await event.remove()

  // Create log entry
  await Log.create({
    eventId: req.params.id,
    eventTitle: eventTitle,
    userId: req.user.id,
    userName: req.user.name,
    action: "delete",
  })

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Get events created by logged in organizer
// @route   GET /api/events/organizer
// @access  Private (Organizers only)
exports.getOrganizerEvents = asyncHandler(async (req, res, next) => {
  // Check if user is an organizer
  if (req.user.role !== "organizer") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this route`, 403))
  }

  const events = await Event.find({ organizer: req.user.id }).populate("registrationsCount")

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  })
})

// @desc    Get organizer stats
// @route   GET /api/events/stats
// @access  Private (Organizers only)
exports.getOrganizerStats = asyncHandler(async (req, res, next) => {
  // Check if user is an organizer
  if (req.user.role !== "organizer") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this route`, 403))
  }

  const totalEvents = await Event.countDocuments({ organizer: req.user.id })

  const upcomingEvents = await Event.countDocuments({
    organizer: req.user.id,
    date: { $gt: new Date() },
  })

  // Get total registrations for all events by this organizer
  const events = await Event.find({ organizer: req.user.id })
  const eventIds = events.map((event) => event._id)

  const totalRegistrations = await Registration.countDocuments({
    event: { $in: eventIds },
  })

  res.status(200).json({
    success: true,
    data: {
      totalEvents,
      totalRegistrations,
      upcomingEvents,
    },
  })
})
