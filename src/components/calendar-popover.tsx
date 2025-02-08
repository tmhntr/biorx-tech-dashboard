"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
// import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const CalendarPopover = ({className, value, onChange}: {className?: string, value: Date | undefined, onChange: (value: Date | undefined) => void}) => {


  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
                format(value, "LLL dd, y")
              
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={value || new Date(Date.now())}
            selected={value}
            onSelect={onChange}
            // numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}