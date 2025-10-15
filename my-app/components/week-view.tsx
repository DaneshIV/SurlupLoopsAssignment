"use client"

import { useMemo } from "react"
import type { CalendarEvent } from "./calendar"
import { cn } from "@/lib/utils"

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateChange: (date: Date) => void
}

export function WeekView({ currentDate, events }: WeekViewProps) {
  const { weekDays, hours } = useMemo(() => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

    const weekDays: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(day.getDate() + i)
      weekDays.push(day)
    }

    const hours = Array.from({ length: 24 }, (_, i) => i)

    return { weekDays, hours }
  }, [currentDate])

  const getEventsForDayAndHour = (date: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getHours() === hour
      )
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour} ${period}`
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border bg-muted/30">
        <div className="border-r border-border" />
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "border-r border-border px-4 py-3 text-center last:border-r-0",
              isToday(day) && "bg-primary/10",
            )}
          >
            <div className="text-xs font-medium text-muted-foreground">
              {day.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div className={cn("mt-1 text-2xl font-semibold", isToday(day) ? "text-primary" : "text-foreground")}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {hours.map((hour) => (
            <>
              <div
                key={`hour-${hour}`}
                className="border-b border-r border-border bg-muted/20 px-3 py-2 text-right text-xs text-muted-foreground"
              >
                {formatHour(hour)}
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDayAndHour(day, hour)
                return (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className={cn(
                      "relative min-h-[60px] border-b border-r border-border p-1 last:border-r-0",
                      isToday(day) && "bg-primary/5",
                    )}
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn("mb-1 rounded p-2 text-xs font-medium text-white", event.color)}
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="mt-1 text-xs opacity-90">
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
                        {event.location && <div className="mt-1 text-xs opacity-80">📍 {event.location}</div>}
                      </div>
                    ))}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
