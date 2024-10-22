import { useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { DatePickerDemo } from "./DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface AddEventsProps {
  onClose: () => void;
}

export const AddEvents: React.FC<AddEventsProps> = ({ onClose }) => {
  // State variables to store form data
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value }); // Update the respective field
  };

  // Handle date selection
  //AROG KAINI PADI ANG PAGCHANGE KI DATE PARA SAKTO KUNG ANO PININDOT KANG USER...
  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Format the date as 'YYYY-MM-DD' before saving it in the form data
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      setFormData({ ...formData, date: formattedDate }); // Save the formatted date string
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted data:", formData); // Log the form data
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
            {/* Pass the date selection handler to DatePickerDemo */}
            <DatePickerDemo onChange={handleDateChange} />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label htmlFor="startTime" className="ml-2">
              Start time
            </label>
            <Input
              className="bg-white"
              id="startTime"
              type="text"
              placeholder="Start time"
              onChange={handleChange}
              value={formData.startTime}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="endTime" className="ml-2">
              End time
            </label>
            <Input
              className="bg-white"
              id="endTime"
              type="text"
              placeholder="End time"
              onChange={handleChange}
              value={formData.endTime}
            />
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
            <Button className="w-32 hover:text-red-500" onClick={onClose}>
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
