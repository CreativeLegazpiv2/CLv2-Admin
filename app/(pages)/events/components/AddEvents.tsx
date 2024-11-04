import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { DatePickerDemo } from "./Picker/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import TimePicker from "./Picker/TimePicker";
import { useToast } from "@/hooks/use-toast";
import { EventData } from "../page";

interface AddEventsProps {
  onClose: () => void;
  editingEvent?: EventData | null;
}

export const AddEvents: React.FC<AddEventsProps> = ({ onClose, editingEvent }) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: "",
    image_path: null as File | null,
    title: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        id: editingEvent.id != null ? String(editingEvent.id) : "",
        image_path: null, // We can't set the File object directly
        title: editingEvent.title || "",
        location: editingEvent.location || "",
        date: editingEvent.date || "",
        startTime: editingEvent.start_time || "",
        endTime: editingEvent.end_time || "",
        description: editingEvent.desc || "",
      });
      setSelectedDate(editingEvent.date ? new Date(editingEvent.date) : undefined);
    }
  }, [editingEvent]);

  const onReset = () => {
    setFormData({
      id: "",
      image_path: null,
      title: "",
      location: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    setSelectedDate(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      setFormData({ ...formData, image_path: e.target.files[0] });
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
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  };

  const handleStartTimeChange = (time: string) => {
    console.log("Start Time:", time); // Debugging log
    if (!isValidTimeFormat(time)) {
      toast({
        title: "Error",
        description: "Invalid start time format. Use HH:mm format.",
        variant: "destructive",
      });
      return;
    }
    setFormData(prevData => {
      const updatedData = { ...prevData, startTime: time };
      console.log("Updated FormData:", updatedData); // Debugging log
      return updatedData;
    });
  
    if (
      formData.endTime &&
      new Date(`1970-01-01T${time}`) >=
        new Date(`1970-01-01T${formData.endTime}`)
    ) {
      setFormData(prevData => ({ ...prevData, endTime: "" }));
      toast({
        title: "Warning",
        description: "Start time should be before end time.",
        variant: "destructive",
      });
    }
  };
  
  const handleEndTimeChange = (time: string) => {
    console.log("End Time:", time); // Debugging log
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
  
    if (startTime < endTime) {
      setFormData(prevData => ({ ...prevData, endTime: time }));
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
    console.log("Form Data Before Submit:", formData); 
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
    data.append("id", formData.id);
    data.append("title", formData.title);
    data.append("location", formData.location);
    data.append("date", formData.date);
    data.append("start_time", formData.startTime); // Changed from startTime to start_time
    data.append("end_time", formData.endTime); // Changed from endTime to end_time
    data.append("desc", formData.description);
    if (formData.image_path) {
      data.append("image", formData.image_path);
    }
  
    const url = editingEvent ? `/api/events/updateEvent` : "/api/events";
    const method = editingEvent ? "PUT" : "POST";
  
    try {
      const response = await fetch(url, {
        method: method,
        body: data,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingEvent ? "update" : "create"} event`);
      }
  
      const result = await response.json();
  
      toast({
        title: "Success",
        description: `Event ${editingEvent ? "updated" : "created"} successfully!`,
        variant: "success",
      });
  
      onReset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      });
      console.error(`Error ${editingEvent ? "updating" : "creating"} event:`, error);
    }
  };

  return (
    <div className="w-full min-h-[15dvh] bg-stone-200 flex justify-start items-start relative">
      <X
        onClick={onReset}
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
              {editingEvent ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};