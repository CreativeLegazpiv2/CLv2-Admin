import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { DatePickerDemo } from "./Picker/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import TimePicker from "./Picker/TimePicker";

interface AddEventsProps {
  onClose: () => void;
}

export const AddEvents: React.FC<AddEventsProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setFormData({ ...formData, date: formattedDate });
    }
  };

  const handleStartTimeChange = (time: string) => {
    setFormData({ ...formData, startTime: time });
  };
  const handleEndTimeChange = (time: string) => {
    setFormData({ ...formData, endTime: time });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
  };

  const onCancel = () => {
    setFormData({
      image: "",
      title: "",
      location: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    setSelectedDate(undefined); // Reset selected date
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    onClose(); // Close the modal or component
  };

  return (
    <div className="w-full min-h-[15dvh] bg-stone-200 flex justify-start items-start relative">
      <X
        onClick={onClose}
        className="absolute top-0 right-0 cursor-pointer hover:text-green-500 duration-300"
        size={30}
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
              onChange={handleChange}
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
            <DatePickerDemo onChange={handleDateChange} selectedDate={selectedDate} />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label htmlFor="startTime" className="ml-2">
              Start time
            </label>
            <TimePicker onChange={handleStartTimeChange} />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="endTime" className="ml-2">
              End time
            </label>
            <TimePicker onChange={handleEndTimeChange} />
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
            <Button onClick={onCancel} type="button" className="w-32 hover:text-red-500">
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
