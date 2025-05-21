"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, Loader2, Mail, MapPin, User, Users } from "lucide-react"
import MainLayout from "@/components/main-layout"
import { getPublicEvent, registerForEvent } from "@/lib/api"
import type { PublicEvent } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"

const registrationSchema = z.object({
  notes: z
    .string()
    .max(500, {
      message: "Notes must not exceed 500 characters",
    })
    .optional(),
})

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth()

  const [event, setEvent] = useState<PublicEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const eventId = params.id as string

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      notes: "",
    },
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getPublicEvent(eventId)
        setEvent(eventData)

        // Check if user is already registered
        if (eventData.isRegistered) {
          setIsRegistered(true)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        })
        router.push("/events")
      } finally {
        setIsLoading(false)
      }
    }

    if (!isAuthLoading) {
      fetchEvent()
    }
  }, [eventId, router, isAuthLoading])

  const onSubmit = async (values: z.infer<typeof registrationSchema>) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for events",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (user?.role !== "attendee") {
      toast({
        title: "Registration failed",
        description: "Only attendees can register for events",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)
    try {
      await registerForEvent(eventId, values)
      setIsRegistered(true)
      toast({
        title: "Registration successful!",
        description: "You have successfully registered for this event.",
      })
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const isPastEvent = (date: string) => {
    return new Date(date) < new Date()
  }

  const isFullyBooked = (event: PublicEvent) => {
    return event.registrationsCount >= event.capacity
  }

  if (isLoading || isAuthLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        </div>
      </MainLayout>
    )
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-8 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Link href="/events" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {event.imageUrl ? (
                <div className="aspect-video w-full">
                  <img
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-purple-500" />
                </div>
              )}

              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

                <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    {format(new Date(event.date), "h:mm a")}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    {event.registrationsCount} / {event.capacity} registered
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold mb-4">About this event</h2>
                  <div className="whitespace-pre-line">{event.description}</div>
                </div>

                {event.organizer && (
                  <div className="mt-8 pt-8 border-t">
                    <h2 className="text-xl font-semibold mb-4">Organizer</h2>
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 rounded-full p-3">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{event.organizer.name}</div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="mr-1 h-4 w-4" />
                          {event.organizer.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{isRegistered ? "Registration Confirmed" : "Register for this Event"}</CardTitle>
                <CardDescription>
                  {isRegistered
                    ? "You are registered for this event"
                    : isPastEvent(event.date)
                      ? "This event has already taken place"
                      : isFullyBooked(event)
                        ? "This event is fully booked"
                        : "Secure your spot for this event"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isRegistered ? (
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Your registration is confirmed!</h3>
                    <p className="text-sm">
                      You will receive updates about this event. You can see all your registered events in your
                      dashboard.
                    </p>
                  </div>
                ) : isPastEvent(event.date) ? (
                  <div className="bg-gray-50 text-gray-800 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">This event has ended</h3>
                    <p className="text-sm">
                      Registration is no longer available as this event has already taken place.
                    </p>
                  </div>
                ) : isFullyBooked(event) ? (
                  <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Event is fully booked</h3>
                    <p className="text-sm">
                      This event has reached its maximum capacity of {event.capacity} attendees.
                    </p>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Login required</h3>
                    <p className="text-sm mb-4">You need to be logged in as an attendee to register for events.</p>
                    <div className="flex gap-2">
                      <Link href="/login">
                        <Button variant="outline" size="sm">
                          Log In
                        </Button>
                      </Link>
                      <Link href="/register?role=attendee">
                        <Button size="sm">Sign Up</Button>
                      </Link>
                    </div>
                  </div>
                ) : user?.role !== "attendee" ? (
                  <div className="bg-gray-50 text-gray-800 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Organizer account detected</h3>
                    <p className="text-sm">
                      Only attendee accounts can register for events. You are currently logged in as an organizer.
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any special requirements or notes for the organizer..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Share any special requirements or questions with the organizer.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isRegistering}>
                        {isRegistering ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          "Register Now"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="text-sm text-gray-600">
                  <div className="font-semibold mb-1">Event Details:</div>
                  <ul className="space-y-1">
                    <li>• {format(new Date(event.date), "EEEE, MMMM d, yyyy")}</li>
                    <li>• {format(new Date(event.date), "h:mm a")}</li>
                    <li>• {event.location}</li>
                  </ul>
                </div>
              </CardFooter>
            </Card>

            {isRegistered && (
              <Link href="/dashboard/attendee" className="block mt-4">
                <Button variant="outline" className="w-full">
                  View My Registrations
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
