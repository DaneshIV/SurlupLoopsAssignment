"use client"

import { useMemo } from "react"
import type { CalendarEvent } from "./calendar"
import { cn } from "@/lib/utils"

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateChange: (date: Date) => void
}

export function MonthView({ currentDate, events, onDateChange }: MonthViewProps) {
  const { days, startDate } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    const days: Date[] = []
    const current = new Date(startDate)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return { days, startDate }
  }, [currentDate])

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
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

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {weekDays.map((day) => (
          <div
            key={day}
            className="border-r border-border px-4 py-3 text-center text-sm font-medium text-muted-foreground last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7 grid-rows-6">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          return (
            <div
              key={index}
              className={cn(
                "border-b border-r border-border p-2 last:border-r-0",
                !isCurrentMonth(day) && "bg-muted/20",
                "hover:bg-accent/50 cursor-pointer transition-colors",
              )}
              onClick={() => onDateChange(day)}
            >
              <div
                className={cn(
                  "mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm",
                  isToday(day) && "bg-primary text-primary-foreground font-semibold",
                  !isToday(day) && isCurrentMonth(day) && "text-foreground",
                  !isToday(day) && !isCurrentMonth(day) && "text-muted-foreground",
                )}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn("rounded px-2 py-1 text-xs font-medium text-white truncate", event.color)}
                  >
                    {event.start.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
