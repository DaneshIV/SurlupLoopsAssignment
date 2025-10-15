"use client"

import { useState } from "react"
import { CalendarHeader } from "./calendar-header"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { DayView } from "./day-view"

export type ViewType = "month" | "week" | "day"

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color: string
  location?: string
  attendees?: string[]
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>("month")

  // Sample events
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Team Standup",
      start: new Date(2025, 0, 15, 9, 0),
      end: new Date(2025, 0, 15, 9, 30),
      color: "bg-chart-1",
      location: "Teams Meeting",
    },
    {
      id: "2",
      title: "Product Review",
      start: new Date(2025, 0, 15, 14, 0),
      end: new Date(2025, 0, 15, 15, 30),
      color: "bg-chart-2",
      location: "Conference Room A",
      attendees: ["John Doe", "Jane Smith"],
    },
    {
      id: "3",
      title: "Client Presentation",
      start: new Date(2025, 0, 16, 10, 0),
      end: new Date(2025, 0, 16, 11, 0),
      color: "bg-chart-3",
      location: "Teams Meeting",
    },
    {
      id: "4",
      title: "Design Workshop",
      start: new Date(2025, 0, 17, 13, 0),
      end: new Date(2025, 0, 17, 16, 0),
      color: "bg-chart-4",
      location: "Design Studio",
    },
    {
      id: "5",
      title: "Sprint Planning",
      start: new Date(2025, 0, 20, 9, 0),
      end: new Date(2025, 0, 20, 11, 0),
      color: "bg-chart-5",
      location: "Teams Meeting",
    },
  ]

  return (
    <div className="flex h-screen flex-col">
      <CalendarHeader currentDate={currentDate} view={view} onViewChange={setView} onDateChange={setCurrentDate} />
      <div className="flex-1 overflow-auto">
        {view === "month" && <MonthView currentDate={currentDate} events={events} onDateChange={setCurrentDate} />}
        {view === "week" && <WeekView currentDate={currentDate} events={events} onDateChange={setCurrentDate} />}
        {view === "day" && <DayView currentDate={currentDate} events={events} onDateChange={setCurrentDate} />}
      </div>
    </div>
  )
}
