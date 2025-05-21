"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Info, Loader2, MapPin, Search } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { getAttendeeRegistrations } from "@/lib/api"
import type { Registration } from "@/lib/types"
import { Input } from "@/components/ui/input"

export default function AttendeeDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAttendeeRegistrations()
        setRegistrations(data)
        setFilteredRegistrations(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your registrations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRegistrations(registrations)
    } else {
      const filtered = registrations.filter((reg) => reg.event.title.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredRegistrations(filtered)
    }
  }, [searchTerm, registrations])

  const isPastEvent = (date: string) => {
    return new Date(date) < new Date()
  }

  return (
    <DashboardLayout role="attendee">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Events</h1>
          <Link href="/events">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Browse Events
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Your Registrations</CardTitle>
                <CardDescription>Events you've registered for</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search events..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-gray-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-gray-500 mt-2 mb-6">
                  {searchTerm ? "No events match your search" : "You haven't registered for any events yet"}
                </p>
                <Link href="/events">
                  <Button>Browse Available Events</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration._id}>
                      <TableCell className="font-medium">{registration.event.title}</TableCell>
                      <TableCell>{format(new Date(registration.event.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                          {registration.event.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isPastEvent(registration.event.date)
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {isPastEvent(registration.event.date) ? "Past" : "Upcoming"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/events/${registration.event._id}`}>
                          <Button variant="outline" size="sm">
                            <Info className="mr-1 h-4 w-4" />
                            Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
