const mongoose = require("mongoose")

const RegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
    required: true,
  },
  attendee: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
})

// Prevent duplicate registrations
RegistrationSchema.index({ event: 1, attendee: 1 }, { unique: true })

module.exports = mongoose.model("Registration", RegistrationSchema)
