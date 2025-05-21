import axios from "axios"
import type {
  LoginCredentials,
  RegisterData,
  EventLog,
  EventStats,
  OrganizerEvent,
  PublicEvent,
  Registration,
  AttendeeRegistration,
  User,
} from "./types"

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Authentication endpoints
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await api.post("/auth/login", credentials)

    // Store token in localStorage
    localStorage.setItem("token", response.data.token)

    return response.data.user
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid credentials")
  }
}

export const register = async (userData: RegisterData): Promise<User> => {
  try {
    const response = await api.post("/auth/register", userData)

    // Store token in localStorage
    localStorage.setItem("token", response.data.token)

    return response.data.user
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed")
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get("/auth/me")
    return response.data.data
  } catch (error) {
    return null
  }
}

export const logout = async (): Promise<void> => {
  try {
    await api.get("/auth/logout")
    localStorage.removeItem("token")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

// Event endpoints
export const getPublicEvents = async (): Promise<PublicEvent[]> => {
  try {
    const response = await api.get("/events")
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch events")
  }
}

export const getPublicEvent = async (eventId: string): Promise<PublicEvent> => {
  try {
    const response = await api.get(`/events/${eventId}`)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Event not found")
  }
}

export const getOrganizerEvents = async (): Promise<OrganizerEvent[]> => {
  try {
    const response = await api.get("/events/organizer")
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch organizer events")
  }
}

export const getEvent = async (eventId: string): Promise<OrganizerEvent> => {
  try {
    const response = await api.get(`/events/${eventId}`)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Event not found")
  }
}

export const createEvent = async (eventData: any): Promise<OrganizerEvent> => {
  try {
    const response = await api.post("/events", eventData)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create event")
  }
}

export const updateEvent = async (eventId: string, eventData: any): Promise<OrganizerEvent> => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update event")
  }
}

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await api.delete(`/events/${eventId}`)
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete event")
  }
}

// Registration endpoints
export const getAttendeeRegistrations = async (): Promise<Registration[]> => {
  try {
    const response = await api.get("/registrations/me")
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch registrations")
  }
}

export const getEventRegistrations = async (eventId: string): Promise<AttendeeRegistration[]> => {
  try {
    const response = await api.get(`/events/${eventId}/registrations`)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch event registrations")
  }
}

export const registerForEvent = async (eventId: string, registrationData: any): Promise<Registration> => {
  try {
    const response = await api.post(`/events/${eventId}/register`, registrationData)
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to register for event")
  }
}

export const cancelRegistration = async (registrationId: string): Promise<void> => {
  try {
    await api.delete(`/registrations/${registrationId}`)
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to cancel registration")
  }
}

// Stats and Logs endpoints
export const getOrganizerStats = async (): Promise<EventStats> => {
  try {
    const response = await api.get("/events/stats")
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch organizer stats")
  }
}

export const getEventLogs = async (): Promise<EventLog[]> => {
  try {
    const response = await api.get("/logs/all")
    return response.data.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch event logs")
  }
}
