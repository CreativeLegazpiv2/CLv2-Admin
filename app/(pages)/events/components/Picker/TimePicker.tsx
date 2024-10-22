'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TimePicker({ onChange }: { onChange: (time: string) => void }) {
  const [time, setTime] = useState('12:00')

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    onChange(newTime)
  }

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  return (
    <div className="w-full max-w-sm">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            id="time-input"
          >
            <Clock className="mr-2 h-4 w-4" />
            {time}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="hours">Hours</Label>
                <Select
                  onValueChange={(value) => handleTimeChange(`${value}:${time.split(':')[1]}`)}
                  value={time.split(':')[0]}
                >
                  <SelectTrigger id="hours">
                    <SelectValue placeholder="Hours" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minutes">Minutes</Label>
                <Select
                  onValueChange={(value) => handleTimeChange(`${time.split(':')[0]}:${value}`)}
                  value={time.split(':')[1]}
                >
                  <SelectTrigger id="minutes">
                    <SelectValue placeholder="Minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="native-time">Or enter time directly:</Label>
              <Input
                id="native-time"
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}