import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { DatePickerDemo } from "./Picker/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import TimePicker from "./Picker/TimePicker";
import { useToast } from "@/hooks/use-toast";

interface AddEventsProps {
  onClose: () => void;
}

export const AddEvents: React.FC<AddEventsProps> = ({ onClose }) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    image: null as File | null,
    title: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [minEndTime, setMinEndTime] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [resetKey, setResetKey] = useState(0); // Step 1: add resetKey state

  const onReset = () => {
    setFormData({
      image: null,
      title: "",
      location: "",
      date: "",
      startTime: "",  // Reset start time
      endTime: "",    // Reset end time
      description: "",
    });
    setSelectedDate(undefined);
    setMinEndTime(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    onClose();
  };
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setFormData({ ...formData, date: formattedDate });
    }
  };

  const isValidTimeFormat = (time: string): boolean => {
    // Regex to match HH:mm format (24-hour format)
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  };

  const handleStartTimeChange = (time: string) => {
    if (!isValidTimeFormat(time)) {
      toast({
        title: "Error",
        description: "Invalid start time format. Use HH:mm format.",
        variant: "destructive",
      });
      return;
    }

    setFormData({ ...formData, startTime: time });

    // Check if endTime is valid and after startTime
    if (
      formData.endTime &&
      new Date(`1970-01-01T${time}`) >=
        new Date(`1970-01-01T${formData.endTime}`)
    ) {
      setFormData({ ...formData, endTime: "" });
      toast({
        title: "Warning",
        description: "Start time should be before end time.",
        variant: "destructive",
      });
    }
  };

  const handleEndTimeChange = (time: string) => {
    if (!isValidTimeFormat(time)) {
      toast({
        title: "Error",
        description: "Invalid end time format. Use HH:mm format.",
        variant: "destructive",
      });
      return;
    }

    const startTime = new Date(`1970-01-01T${formData.startTime}`);
    const endTime = new Date(`1970-01-01T${time}`);

    // Check if endTime is after startTime
    if (startTime < endTime) {
      setFormData({ ...formData, endTime: time });
    } else {
      toast({
        title: "Warning",
        description: "End time should be after start time.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.location ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.description
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("location", formData.location);
    data.append("date", formData.date);
    data.append("startTime", formData.startTime);
    data.append("endTime", formData.endTime);
    data.append("desc", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
      onReset();
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to create event",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Event created successfully!",
        variant: "success",
      });

      onReset(); // Reset the form on success
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="w-full min-h-[15dvh] bg-stone-200 flex justify-start items-start relative">
      <X
        onClick={onClose}
        className="absolute top-2 right-2 cursor-pointer hover:text-red-500 duration-300"
        size={25}
      />
      <div className="w-full h-full p-4">
        <form onSubmit={handleSubmit} className="w-full grid grid-cols-4 gap-4">
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="image" className="ml-2">
              Image
            </label>
            <Input
              className="bg-white"
              id="image"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="title" className="ml-2">
              Title
            </label>
            <Input
              className="bg-white"
              id="title"
              type="text"
              placeholder="Event title"
              onChange={handleChange}
              value={formData.title}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="location" className="ml-2">
              Location
            </label>
            <Input
              className="bg-white"
              id="location"
              type="text"
              placeholder="Event location"
              onChange={handleChange}
              value={formData.location}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="date" className="ml-2">
              Date
            </label>
            <DatePickerDemo
              onChange={handleDateChange}
              selectedDate={selectedDate}
            />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label htmlFor="startTime" className="ml-2">
              Start time
            </label>
            <TimePicker onChange={handleStartTimeChange} value={formData.startTime} />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="endTime" className="ml-2">
              End time
            </label>
            <TimePicker onChange={handleEndTimeChange} value={formData.endTime} />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="description" className="ml-2">
              Description
            </label>
            <Textarea
              className="bg-white resize-none"
              id="description"
              placeholder="Event description"
              onChange={handleChange}
              value={formData.description}
            />
          </div>
          <div className="w-full flex flex-row gap-1 justify-end items-end">
            <Button
              onClick={onReset}
              type="button"
              className="w-32 hover:text-red-500"
            >
              Cancel
            </Button>
            <Button className="mt-8 w-32 hover:text-green-500" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
