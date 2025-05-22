const mongoose = require("mongoose")
mongoose.set('strictQuery', true);//-------------
const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    capacity: {
      type: Number,
      required: [true, "Please add a capacity"],
      min: [1, "Capacity must be at least 1"],
    },
    imageUrl: {
      type: String,
    },
    organizer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual field for registrations count
EventSchema.virtual("registrationsCount", {
  ref: "Registration",
  localField: "_id",
  foreignField: "event",
  count: true,
})

// Cascade delete registrations when an event is deleted
EventSchema.pre("remove", async function (next) {
  await this.model("Registration").deleteMany({ event: this._id })
  await this.model("Log").deleteMany({ eventId: this._id })
  next()
})

module.exports = mongoose.model("Event", EventSchema)
