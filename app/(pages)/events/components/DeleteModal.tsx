import { motion } from "framer-motion";
import { TriangleAlert, X } from "lucide-react";

interface DeleteModalProps {
  onClose: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ onClose }) => {
  // pass here the id of the event to be deleted
  // onClick={handleDelete(id)} on the button delete
  return (
    <motion.div
      initial={{ scale: 0.9, y: 50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 50, opacity: 0 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 500,
      }}
      className="w-full h-full flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full min-h-[20dvh] max-w-lg bg-white flex flex-col relative"
      >
        <X
          onClick={onClose}
          className="absolute top-2 right-2 text-white cursor-pointer duration-300 transition-colors hover:text-blue-500"
        />
        <header className="w-full h-[10dvh] bg-red-500 p-4 flex justify-start items-center">
          <h1 className="text-white text-xl">Delete Confirmation</h1>
        </header>
        <div className="h-full p-4 flex justify-center items-center">
          <div className="bg-[#fcf8e3] p-4 w-full flex gap-2 justify-center items-center text-slate-900">
            <TriangleAlert />
            <h1>Do you really want to delete this event?</h1>
          </div>
        </div>
        <footer className="w-full h-[10dvh] ">
          <div className="flex justify-end items-center gap-2 w-full h-full px-4">
            <button className="w-24 py-2 rounded-md hover:bg-[#fcf8e3] duration-300 transition-colors hover:text-red-500">
              Delete
            </button>
            <button
              onClick={onClose}
              className="w-24 py-2 rounded-md hover:bg-[#fcf8e3] duration-300 transition-colors hover:text-blue-500"
            >
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};
