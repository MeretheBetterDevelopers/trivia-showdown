"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

function parseISODate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

export default function LeaderboardDatePicker({
  date,
  cameFromResults,
}: Readonly<{ date: string; cameFromResults: boolean }>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const selectedDate = parseISODate(date);
  const today = new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" size="sm" />}>
        <CalendarDays className="size-3.5" aria-hidden />
        {format(selectedDate, "PP")}
      </PopoverTrigger>
      <PopoverContent align="center">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          disabled={{ after: today }}
          onSelect={(picked) => {
            if (!picked) return;
            setOpen(false);
            const fromSuffix = cameFromResults ? "&from=results" : "";
            router.push(
              `/trivia/leaderboard?view=daily&date=${format(picked, "yyyy-MM-dd")}${fromSuffix}`,
            );
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
