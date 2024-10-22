import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerDemoProps {
  onChange: (date: Date | undefined) => void;
  selectedDate?: Date; // Add selectedDate prop
}

export function DatePickerDemo({ onChange, selectedDate }: DatePickerDemoProps) {
    const [date, setDate] = React.useState<Date>();

    const handleDateChange = (selectedDate: Date | undefined) => {
      if (selectedDate) {
        // ini ang format kang date padi para magsakto sa clicked na date
        const localDate = format(selectedDate, "yyyy-MM-dd"); // Format as YYYY-MM-DD
        setDate(selectedDate); // Keep the original Date object
        onChange(selectedDate); // Pass the original Date object to parent
      }
    };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate} // Use selectedDate prop here
          onSelect={handleDateChange} // Call the handler when a date is selected
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
