"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, ArrowLeft, Calendar, Clock, Download, Loader2, MapPin } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { getEvent, getEventRegistrations } from "@/lib/api"
import type { AttendeeRegistration, Event } from "@/lib/types"

export default function EventRegistrationsPage() {
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<AttendeeRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, registrationsData] = await Promise.all([getEvent(eventId), getEventRegistrations(eventId)])

        setEvent(eventData)
        setRegistrations(registrationsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load registration data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [eventId])

  const exportToCSV = () => {
    if (!registrations.length) return

    // Create CSV content
    const headers = ["Name", "Email", "Registration Date", "Notes"]
    const csvContent = [
      headers.join(","),
      ...registrations.map((reg) => {
        return [
          `"${reg.attendee.name}"`,
          `"${reg.attendee.email}"`,
          `"${format(new Date(reg.registeredAt), "yyyy-MM-dd HH:mm")}"`,
          `"${reg.notes || ""}"`,
        ].join(",")
      }),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `registrations-${eventId}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <DashboardLayout role="organizer">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="organizer">
      <div className="container mx-auto py-8">
        <Link
          href="/dashboard/organizer"
          className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>

        {event ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{event.title} - Registrations</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(event.date), "MMMM dd, yyyy")}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {format(new Date(event.date), "h:mm a")}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Registered Attendees</CardTitle>
                    <CardDescription>
                      {registrations.length} out of {event.capacity} spots filled
                    </CardDescription>
                  </div>
                  <Button onClick={exportToCSV} variant="outline" size="sm" disabled={registrations.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {registrations.length === 0 ? (
                  <div className="text-center py-10">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No registrations yet</h3>
                    <p className="text-gray-500 mt-2">There are no attendees registered for this event yet.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Registered On</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((registration) => (
                        <TableRow key={registration._id}>
                          <TableCell className="font-medium">{registration.attendee.name}</TableCell>
                          <TableCell>{registration.attendee.email}</TableCell>
                          <TableCell>{format(new Date(registration.registeredAt), "MMM dd, yyyy h:mm a")}</TableCell>
                          <TableCell>{registration.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">
              The event you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/dashboard/organizer">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
