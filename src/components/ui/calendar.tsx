"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/src/lib/utils"
import { Button, buttonVariants } from "@/src/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-popover p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex items-center justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-8 items-center justify-center text-sm font-medium",
          defaultClassNames.month_caption
        ),
        month_grid: cn("mt-2 w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "w-8 flex-1 text-[0.8rem] font-normal text-muted-foreground",
          defaultClassNames.weekday
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        day: cn(
          "relative aspect-square h-8 w-8 flex-1 p-0 text-center text-sm",
          defaultClassNames.day
        ),
        today: cn(
          "[&>button]:font-semibold [&>button]:text-primary",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...rest }) => {
          const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon
          return <Icon className={cn("size-4", chevronClassName)} {...rest} />
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      data-selected={modifiers.selected}
      data-today={modifiers.today}
      className={cn(
        "size-8 rounded-full font-normal",
        "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary/80",
        "data-[today=true]:not-data-[selected=true]:font-semibold data-[today=true]:not-data-[selected=true]:text-primary",
        className
      )}
      {...props}
    >
      {day.date.getDate()}
    </Button>
  )
}

export { Calendar, CalendarDayButton }
