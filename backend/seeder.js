// const fs = require("fs")
// const mongoose = require("mongoose")
// const dotenv = require("dotenv")
// const bcrypt = require("bcryptjs")
// mongoose.set('strictQuery', true);//---------------
// // Load env vars
// dotenv.config()

// // Load models
// const User = require("./models/User")
// const Event = require("./models/Event")
// const Registration = require("./models/Registration")
// const Log = require("./models/Log")

// // Connect to DB
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/event-management")

// // Sample data
// const users = [
//   {
//     _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"),
//     name: "John Organizer",
//     email: "organizer@example.com",
//     role: "organizer",
//     password: "password",
//   },
//   {
//     _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be043"),
//     name: "Jane Attendee",
//     email: "attendee@example.com",
//     role: "attendee",
//     password: "password",
//   },
//   {
//     _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be044"),
//     name: "Sarah Developer",
//     email: "sarah@example.com",
//     role: "organizer",
//     password: "password",
//   },
//   {
//     _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be045"),
//     name: "David User",
//     email: "david@example.com",
//     role: "attendee",
//     password: "password",
//   },
// ]

// // Create future dates
// const today = new Date()
// const pastDate = new Date(today)
// pastDate.setDate(today.getDate() - 10)

// const futureDate1 = new Date(today)
// futureDate1.setDate(today.getDate() + 5)

// const futureDate2 = new Date(today)
// futureDate2.setDate(today.getDate() + 15)

// const events = [
//   {
//     _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"),
//     title: "Tech Conference 2023",
//     description:
//       "Join us for a day of inspiring talks, workshops, and networking opportunities with industry leaders in technology. This event is perfect for developers, designers, and tech enthusiasts looking to expand their knowledge and connect with peers.\n\nTopics will include:\n- Artificial Intelligence and Machine Learning\n- Web and Mobile Development\n- UX Design and User Research\n- DevOps and Cloud Computing",
//     date: futureDate1,
//     location: "City Convention Center",
//     capacity: 200,
//     imageUrl:
//       "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80",
//     organizer: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
//   },
//   {
//     _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be047"),
//     title: "Web Development Workshop",
//     description:
//       "A hands-on workshop where you will learn the latest web development techniques and frameworks. Perfect for beginners and intermediate developers looking to level up their skills.\n\nWhat you will learn:\n- HTML, CSS, and JavaScript fundamentals\n- React and Next.js development\n- Responsive design principles\n- API integration",
//     date: futureDate2,
//     location: "Downtown Co-working Space",
//     capacity: 50,
//     organizer: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be044"), // Sarah Developer
//   },
//   {
//     _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be048"),
//     title: "Product Management Symposium",
//     description:
//       "A symposium dedicated to product management methodologies, strategies, and best practices. Learn from experienced product managers about how to build and scale successful products.\n\nSessions will cover:\n- User research and validation\n- Agile product development\n- Roadmap planning\n- Metrics and analytics",
//     date: pastDate,
//     location: "Grand Hotel Conference Room",
//     capacity: 100,
//     imageUrl:
//       "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80",
//     organizer: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
//   },
// ]

// const registrations = [
//   {
//     event: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
//     attendee: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be043"), // Jane Attendee
//     registeredAt: new Date(today.setDate(today.getDate() - 2)),
//     notes: "Looking forward to the AI sessions!",
//   },
//   {
//     event: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be048"), // Product Management
//     attendee: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be043"), // Jane Attendee
//     registeredAt: new Date(today.setDate(today.getDate() - 15)),
//   },
//   {
//     event: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
//     attendee: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be045"), // David User
//     registeredAt: new Date(today.setDate(today.getDate() - 5)),
//   },
// ]

// const logs = [
//   {
//     eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
//     eventTitle: "Tech Conference 2023",
//     userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
//     userName: "John Organizer",
//     action: "create",
//     timestamp: new Date(today.setDate(today.getDate() - 30)),
//   },
//   {
//     eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
//     eventTitle: "Tech Conference 2023",
//     userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
//     userName: "John Organizer",
//     action: "update",
//     timestamp: new Date(today.setDate(today.getDate() - 20)),
//   },
//   {
//     eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
//     eventTitle: "Tech Conference 2023",
//     userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be043"), // Jane Attendee
//     userName: "Jane Attendee",
//     action: "register",
//     timestamp: new Date(today.setDate(today.getDate() - 15)),
//   },
//   {
//     eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be047"), // Web Development
//     eventTitle: "Web Development Workshop",
//     userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be044"), // Sarah Developer
//     userName: "Sarah Developer",
//     action: "create",
//     timestamp: new Date(today.setDate(today.getDate() - 10)),
//   },
//   {
//     eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be047"), // Web Development
//     eventTitle: "Web Development Workshop",
//     userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be045"), // David User
//     userName: "David User",
//     action: "view",
//     timestamp: new Date(today.setDate(today.getDate() - 5)),
//   },
//   {
//     eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be048"), // Product Management
//     eventTitle: "Product Management Symposium",
//     userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
//     userName: "John Organizer",
//     action: "update",
//     timestamp: new Date(today.setDate(today.getDate() - 2)),
//   },
// ]

// // Import into DB
// const importData = async () => {
//   try {
//     await User.deleteMany()
//     await Event.deleteMany()
//     await Registration.deleteMany()
//     await Log.deleteMany()

//     // Hash passwords
//     const hashedUsers = await Promise.all(
//       users.map(async (user) => {
//         const salt = await bcrypt.genSalt(10)
//         user.password = await bcrypt.hash(user.password, salt)
//         return user
//       }),
//     )

//     await User.create(hashedUsers)
//     await Event.create(events)
//     await Registration.create(registrations)
//     await Log.create(logs)

//     console.log("Data Imported...")
//     process.exit()
//   } catch (err) {
//     console.error(err)
//     process.exit(1)
//   }
// }

// // Delete data
// const deleteData = async () => {
//   try {
//     await User.deleteMany()
//     await Event.deleteMany()
//     await Registration.deleteMany()
//     await Log.deleteMany()

//     console.log("Data Destroyed...")
//     process.exit()
//   } catch (err) {
//     console.error(err)
//     process.exit(1)
//   }
// }

// if (process.argv[2] === "-i") {
//   importData()
// } else if (process.argv[2] === "-d") {
//   deleteData()
// } else {
//   console.log("Please add an option: -i (import) or -d (delete)")
//   process.exit()
// }


///----------------------adding new code 
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Load env vars
dotenv.config();

// Load models
const User = require("./models/User");
const Event = require("./models/Event");
const Registration = require("./models/Registration");
const Log = require("./models/Log");

// Set Mongoose options
mongoose.set('strictQuery', true);
mongoose.set('debug', true); // Enable query logging for debugging

// Connect to DB
const connectDB = async () => {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // 20 seconds timeout
      socketTimeoutMS: 45000, // Socket timeout
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"),
    name: "John Organizer",
    email: "organizer@example.com",
    role: "organizer",
    password: "password",
  },
  {
    _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be043"),
    name: "Jane Attendee",
    email: "attendee@example.com",
    role: "attendee",
    password: "password",
  },
  {
    _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be044"),
    name: "Sarah Developer",
    email: "sarah@example.com",
    role: "organizer",
    password: "password",
  },
  {
    _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be045"),
    name: "David User",
    email: "david@example.com",
    role: "attendee",
    password: "password",
  },
];

// Create future dates
const today = new Date();
const pastDate = new Date(today);
pastDate.setDate(today.getDate() - 10);

const futureDate1 = new Date(today);
futureDate1.setDate(today.getDate() + 5);

const futureDate2 = new Date(today);
futureDate2.setDate(today.getDate() + 15);

const events = [
  {
    _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"),
    title: "Tech Conference 2023",
    description:
      "Join us for a day of inspiring talks, workshops, and networking opportunities with industry leaders in technology. This event is perfect for developers, designers, and tech enthusiasts looking to expand their knowledge and connect with peers.\n\nTopics will include:\n- Artificial Intelligence and Machine Learning\n- Web and Mobile Development\n- UX Design and User Research\n- DevOps and Cloud Computing",
    date: futureDate1,
    location: "City Convention Center",
    capacity: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80",
    organizer: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
  },
  {
    _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be047"),
    title: "Web Development Workshop",
    description:
      "A hands-on workshop where you will learn the latest web development techniques and frameworks. Perfect for beginners and intermediate developers looking to level up their skills.\n\nWhat you will learn:\n- HTML, CSS, and JavaScript fundamentals\n- React and Next.js development\n- Responsive design principles\n- API integration",
    date: futureDate2,
    location: "Downtown Co-working Space",
    capacity: 50,
    organizer: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be044"), // Sarah Developer
  },
  {
    _id: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be048"),
    title: "Product Management Symposium",
    description:
      "A symposium dedicated to product management methodologies, strategies, and best practices. Learn from experienced product managers about how to build and scale successful products.\n\nSessions will cover:\n- User research and validation\n- Agile product development\n- Roadmap planning\n- Metrics and analytics",
    date: pastDate,
    location: "Grand Hotel Conference Room",
    capacity: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80",
    organizer: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
  },
];

const registrations = [
  {
    event: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
    attendee: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be043"), // Jane Attendee
    registeredAt: new Date(today.setDate(today.getDate() - 2)),
    notes: "Looking forward to the AI sessions!",
  },
  {
    event: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be048"), // Product Management
    attendee: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be043"), // Jane Attendee
    registeredAt: new Date(today.setDate(today.getDate() - 15)),
  },
  {
    event: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
    attendee: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be045"), // David User
    registeredAt: new Date(today.setDate(today.getDate() - 5)),
  },
];

const logs = [
  {
    eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
    eventTitle: "Tech Conference 2023",
    userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
    userName: "John Organizer",
    action: "create",
    timestamp: new Date(today.setDate(today.getDate() - 30)),
  },
  {
    eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
    eventTitle: "Tech Conference 2023",
    userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
    userName: "John Organizer",
    action: "update",
    timestamp: new Date(today.setDate(today.getDate() - 20)),
  },
  {
    eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be046"), // Tech Conference
    eventTitle: "Tech Conference 2023",
    userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be043"), // Jane Attendee
    userName: "Jane Attendee",
    action: "register",
    timestamp: new Date(today.setDate(today.getDate() - 15)),
  },
  {
    eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be047"), // Web Development
    eventTitle: "Web Development Workshop",
    userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be044"), // Sarah Developer
    userName: "Sarah Developer",
    action: "create",
    timestamp: new Date(today.setDate(today.getDate() - 10)),
  },
  {
    eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be047"), // Web Development
    eventTitle: "Web Development Workshop",
    userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be045"), // David User
    userName: "David User",
    action: "view",
    timestamp: new Date(today.setDate(today.getDate() - 5)),
  },
  {
    eventId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be048"), // Product Management
    eventTitle: "Product Management Symposium",
    userId: mongoose.Types.ObjectId("5d7a514b5d2c12c7449be042"), // John Organizer
    userName: "John Organizer",
    action: "update",
    timestamp: new Date(today.setDate(today.getDate() - 2)),
  },
];

// Import into DB
const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    await Log.deleteMany();

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user;
      }),
    );

    await User.create(hashedUsers);
    await Event.create(events);
    await Registration.create(registrations);
    await Log.create(logs);

    console.log("Data Imported...");
  } catch (err) {
    console.error("Import error:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    await Log.deleteMany();

    console.log("Data Destroyed...");
  } catch (err) {
    console.error("Delete error:", err);
  } finally {
    mongoose.connection.close();
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("Please add an option: -i (import) or -d (delete)");
  process.exit();
}