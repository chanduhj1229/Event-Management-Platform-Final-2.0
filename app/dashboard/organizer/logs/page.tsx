"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Calendar, Eye, Loader2, User, UserPlus } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { getEventLogs } from "@/lib/api"
import type { EventLog } from "@/lib/types"

export default function EventLogsPage() {
  const [logs, setLogs] = useState<EventLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await getEventLogs()
        setLogs(logsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load activity logs",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const filteredLogs = filter === "all" ? logs : logs.filter((log) => log.action === filter)

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "update":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Calendar className="h-4 w-4 text-red-500" />
      case "register":
        return <UserPlus className="h-4 w-4 text-purple-500" />
      case "view":
        return <Eye className="h-4 w-4 text-gray-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getActionText = (log: EventLog): string => {
    switch (log.action) {
      case "create":
        return `Created event "${log.eventTitle}"`
      case "update":
        return `Updated event "${log.eventTitle}"`
      case "delete":
        return `Deleted event "${log.eventTitle}"`
      case "register":
        return `${log.userName} registered for "${log.eventTitle}"`
      case "view":
        return `${log.userName} viewed "${log.eventTitle}"`
      default:
        return `Unknown action for "${log.eventTitle}"`
    }
  }

  return (
    <DashboardLayout role="organizer">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Activity Logs</h1>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Event Activity</CardTitle>
                <CardDescription>Track all activity related to your events</CardDescription>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="create">Event Creation</SelectItem>
                  <SelectItem value="update">Event Updates</SelectItem>
                  <SelectItem value="delete">Event Deletion</SelectItem>
                  <SelectItem value="register">Registrations</SelectItem>
                  <SelectItem value="view">Event Views</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-10">
                <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No logs found</h3>
                <p className="text-gray-500 mt-2">There are no activity logs matching your current filter.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="capitalize">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getActionText(log)}</TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>{format(new Date(log.timestamp), "MMM dd, yyyy h:mm a")}</TableCell>
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
