"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Clock, Loader2, MapPin, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { getPublicEvents } from "@/lib/api"
import type { PublicEvent } from "@/lib/types"
import MainLayout from "@/components/main-layout"

export default function EventsPage() {
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<PublicEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getPublicEvents()
        setEvents(eventsData)
        setFilteredEvents(eventsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEvents(events)
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredEvents(filtered)
    }
  }, [searchTerm, events])

  const isPastEvent = (date: string) => {
    return new Date(date) < new Date()
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
            <p className="text-gray-600">Browse and register for events</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search events by title or location..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No events found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "We couldn't find any events matching your search criteria."
                : "There are no events available at the moment."}
            </p>
            {searchTerm && <Button onClick={() => setSearchTerm("")}>Clear Search</Button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event._id}
                className={`overflow-hidden flex flex-col ${isPastEvent(event.date) ? "opacity-70" : ""}`}
              >
                <div className="aspect-video bg-gray-100 relative">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-100">
                      <Calendar className="h-12 w-12 text-purple-500" />
                    </div>
                  )}
                  {isPastEvent(event.date) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">Past Event</span>
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 pt-6">
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start">
                      <Calendar className="mr-2 h-4 w-4 mt-0.5" />
                      <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-start">
                      <Clock className="mr-2 h-4 w-4 mt-0.5" />
                      <span>{format(new Date(event.date), "h:mm a")}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 mt-0.5" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-start">
                      <Users className="mr-2 h-4 w-4 mt-0.5" />
                      <span>
                        {event.registrationsCount} / {event.capacity} registered
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link href={`/events/${event._id}`} className="w-full">
                    <Button
                      className="w-full"
                      variant={isPastEvent(event.date) ? "outline" : "default"}
                      disabled={isPastEvent(event.date)}
                    >
                      {isPastEvent(event.date) ? "View Details" : "View & Register"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
