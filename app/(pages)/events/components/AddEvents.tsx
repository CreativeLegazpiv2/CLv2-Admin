import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { DatePickerDemo } from "./DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AddEventsProps {
  onClose: () => void;
}

export const AddEvents: React.FC<AddEventsProps> = ({ onClose }) => {
  return (
    <div className="w-full min-h-[15dvh] bg-stone-200 flex justify-start items-start relative">
      <X onClick={onClose} className="absolute top-0 right-0 cursor-pointer hover:text-green-500 duration-300" size={30} />
      {/* duman maedit sa table duman ma fetch... outlet lang ini */}
      <div className="w-full h-full p-4">
        <form className="w-full grid grid-cols-4 gap-4">
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="picture" className="ml-2">
              Image
            </label>
            <Input className="bg-white" id="picture" type="file" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="picture" className="ml-2">
              Title
            </label>
            <Input
              className="bg-white"
              id="picture"
              type="text"
              placeholder="Event title"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="picture" className="ml-2">
              Location
            </label>
            <Input
              className="bg-white"
              id="picture"
              type="text"
              placeholder="Event title"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="picture" className="ml-2">
              Date
            </label>
            <DatePickerDemo />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label htmlFor="picture" className="ml-2">
              Start time
            </label>
            <Input
              className="bg-white"
              id="picture"
              type="text"
              placeholder="Event title"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="picture" className="ml-2">
              End time
            </label>
            <Input
              className="bg-white"
              id="picture"
              type="text"
              placeholder="Event title"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="picture" className="ml-2">
              Description
            </label>
            <Textarea
              className="bg-white resize-none"
              id="picture"
              placeholder="Event title"
            />
          </div>
          <div className="w-full flex flex-col gap-1 justify-end items-end">
            <Button className="mt-8 w-32  hover:text-green-500" type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
