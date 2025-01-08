// components/Modal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: React.ReactNode; // Optional header
  footer?: React.ReactNode; // Optional footer
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, header, footer }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              maxWidth: "90%", // Responsive max-width
              width: "100%", // Full width on small screens
              maxHeight: "90vh", // Limit height to 90% of the viewport
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box", // Ensure padding is included in width/height
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header with Close Button */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "white",
                position: "sticky",
                top: 0,
                zIndex: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>{header}</div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                &times;
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
              }}
            >
              {children}
            </div>

            {/* Fixed Footer */}
            {footer && (
              <div
                style={{
                  padding: "16px",
                  borderTop: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  position: "sticky",
                  bottom: 0,
                  zIndex: 10,
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;