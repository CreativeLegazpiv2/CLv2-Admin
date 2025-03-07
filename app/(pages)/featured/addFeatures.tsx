"use client";

import React, { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// You may want to move this type to a shared file
export interface AdminEvent {
  id: number;
  title?: string | null;
  created_at: string;
  image_url?: string;
}

interface AddEventPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: (newEvent: AdminEvent) => void;
}

const AddEventPanel: FC<AddEventPanelProps> = ({ isOpen, onClose, onEventAdded }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!image) {
      setUploadStatus("Please provide an image.");
      return;
    }
  
    const formData = new FormData();
    if (title) formData.append("title", title);
    formData.append("image", image);
  
    try {
      const response = await fetch("/api/featured", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        setUploadStatus("Image uploaded and record created successfully!");
        const newEvent: AdminEvent = {
          id: result.id,
          title: title || null, // Allow title to be null
          created_at: new Date().toISOString(),
        };
        onEventAdded(newEvent);
        setTitle("");
        setImage(null);
      } else {
        setUploadStatus(result.error || "An error occurred.");
      }
    } catch (error: any) {
      setUploadStatus("An unexpected error occurred.");
    }
  };
  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 h-full max-h-[700px] z-50 w-full max-w-[1500px]"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full bg-stone-200 flex flex-col justify-start relative shadow-md p-4">
            <X
              onClick={onClose}
              className="absolute top-2 right-2 cursor-pointer hover:text-red-500 duration-300"
              size={25}
            />
            <div className="w-full h-full p-4">
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <label>
                  Title:
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2"
                    placeholder="Enter title"
                  />
                </label>
                <label>
                  Image:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-2"
                  />
                </label>
                <button type="submit" className="bg-blue-500 text-white p-2">
                  Upload
                </button>
              </form>
              {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddEventPanel;
