"use client"

import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ViewType } from "./calendar"

interface CalendarHeaderProps {
  currentDate: Date
  view: ViewType
  onViewChange: (view: ViewType) => void
  onDateChange: (date: Date) => void
}

export function CalendarHeader({ currentDate, view, onViewChange, onDateChange }: CalendarHeaderProps) {
  const formatHeaderDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    }
    if (view === "day") {
      options.day = "numeric"
    }
    return currentDate.toLocaleDateString("en-US", options)
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    }
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate("prev")} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateDate("next")} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday} className="h-8 px-3 text-sm bg-transparent">
            Today
          </Button>
          <span className="ml-2 text-lg font-medium text-foreground">{formatHeaderDate()}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={view}
            onChange={(e) => onViewChange(e.target.value as ViewType)}
            className="h-9 w-32 appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>
    </header>
  )
}
