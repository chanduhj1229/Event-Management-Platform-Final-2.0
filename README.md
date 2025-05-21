# EventHub - Event Management System

A complete event management system built with the MERN stack (MongoDB, Express, React, Node.js). The application allows organizers to create and manage events, while attendees can browse and register for events.

## Features

- **User Authentication**: Role-based authentication for organizers and attendees
- **Event Management**: Create, read, update, and delete events
- **Registration System**: Register for events with capacity limits
- **Activity Logging**: Track all event-related activities
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- Next.js (React framework)
- Tailwind CSS for styling
- shadcn/ui for UI components
- Lucide React for icons
- React Hook Form for form handling
- Zod for form validation

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Mongoose for MongoDB object modeling

## Sample Credentials

You can use these credentials to test the application:

### Organizer Account
- Email: organizer@example.com
- Password: password

### Attendee Account
- Email: attendee@example.com
- Password: password

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/event-management-system.git
   cd event-management-system
   \`\`\`

2. **Set up the backend**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Configure environment variables**
   Create a `.env` file in the backend directory with the following variables:
   \`\`\`
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/event 
   \`\`\`
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/event-management
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   FRONTEND_URL=http://localhost:3000
   \`\`\`

4. **Seed the database with sample data**
   \`\`\`bash
   npm run seed
   \`\`\`

5. **Start the backend server**
   \`\`\`bash
   npm run dev
   \`\`\`
   The backend server will run on http://localhost:5000

6. **Set up the frontend**
   Open a new terminal window
   \`\`\`bash
   cd ../
   npm install
   \`\`\`

7. **Configure frontend environment variables**
   Create a `.env.local` file in the root directory with:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`

8. **Start the frontend development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   The frontend will be available at http://localhost:3000

## Project Structure

### Backend
- `server.js` - Entry point for the Express server
- `/models` - MongoDB schemas
- `/controllers` - Request handlers
- `/routes` - API routes
- `/middleware` - Custom middleware (auth, error handling)
- `/utils` - Utility functions
- `/seeder.js` - Database seeding script

### Frontend
- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/lib` - Utility functions and API client
- `/public` - Static assets

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event (organizers only)
- `PUT /api/events/:id` - Update event (organizer only)
- `DELETE /api/events/:id` - Delete event (organizer only)
- `GET /api/events/organizer` - Get events created by logged in organizer
- `GET /api/events/stats` - Get organizer stats

### Registrations
- `POST /api/events/:eventId/register` - Register for an event (attendees only)
- `GET /api/events/:eventId/registrations` - Get registrations for an event (organizer only)
- `GET /api/registrations/me` - Get registrations for logged in attendee
- `DELETE /api/registrations/:id` - Cancel registration

### Logs
- `GET /api/logs` - Get logs for organizer's events
- `GET /api/events/:eventId/logs` - Get logs for a specific event

## License
MIT

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/)

Happy event planning!
