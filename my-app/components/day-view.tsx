"use client"

import { useMemo } from "react"
import type { CalendarEvent } from "./calendar"
import { cn } from "@/lib/utils"

interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateChange: (date: Date) => void
}

export function DayView({ currentDate, events }: DayViewProps) {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getHours() === hour
      )
    })
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:00 ${period}`
  }

  const isToday = () => {
    const today = new Date()
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="text-sm font-medium text-muted-foreground">
          {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className={cn("text-4xl font-semibold", isToday() ? "text-primary" : "text-foreground")}>
            {currentDate.getDate()}
          </div>
          <div className="text-lg text-muted-foreground">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[120px_1fr]">
          {hours.map((hour) => {
            const hourEvents = getEventsForHour(hour)
            return (
              <>
                <div
                  key={`hour-${hour}`}
                  className="border-b border-r border-border bg-muted/20 px-4 py-3 text-right text-sm text-muted-foreground"
                >
                  {formatHour(hour)}
                </div>
                <div key={`content-${hour}`} className="relative min-h-[80px] border-b border-border p-3">
                  {hourEvents.map((event) => (
                    <div key={event.id} className={cn("mb-2 rounded-lg p-4 text-white shadow-sm", event.color)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-base font-semibold">{event.title}</div>
                          <div className="mt-2 text-sm opacity-90">
                            {event.start.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}{" "}
                            -{" "}
                            {event.end.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                          {event.location && (
                            <div className="mt-2 flex items-center gap-1 text-sm opacity-80">
                              <span>📍</span>
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="mt-2 flex items-center gap-1 text-sm opacity-80">
                              <span>👥</span>
                              <span>{event.attendees.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}
