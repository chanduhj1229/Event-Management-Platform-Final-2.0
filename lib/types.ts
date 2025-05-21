// User Types
export interface User {
  _id: string
  name: string
  email: string
  role: "organizer" | "attendee"
}

// Event Types
export interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  capacity: number
  imageUrl?: string
  organizer: {
    _id: string
    name: string
    email: string
  }
}

export interface PublicEvent extends Event {
  registrationsCount: number
  isRegistered?: boolean
}

export interface OrganizerEvent extends Event {
  registrationsCount: number
}

// Registration Types
export interface Registration {
  _id: string
  event: Event
  registeredAt: string
  notes?: string
}

export interface AttendeeRegistration {
  _id: string
  attendee: {
    _id: string
    name: string
    email: string
  }
  registeredAt: string
  notes?: string
}

// Log Types
export interface EventLog {
  _id: string
  eventId: string
  eventTitle: string
  userId: string
  userName: string
  action: "create" | "update" | "delete" | "register" | "view"
  timestamp: string
  details?: string
}

// Stats Types
export interface EventStats {
  totalEvents: number
  totalRegistrations: number
  upcomingEvents: number
}

// Authentication Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: "organizer" | "attendee"
}
