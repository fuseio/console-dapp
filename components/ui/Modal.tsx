import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

import close from "@/assets/close.svg";

type ModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
  containerClassName?: string;
  className?: string;
  children: React.ReactNode;
}

const Modal = ({
  isOpen,
  toggleModal,
  containerClassName,
  className,
  children
}: ModalProps) => {
  const modalRef = useOutsideClick(() => {
    if (isOpen) {
      toggleModal();
    }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex ${containerClassName}`}
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            ref={modalRef}
            className={`z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${className}`}
          >
            <Image
              src={close}
              alt="close"
              className="cursor-pointer w-6 absolute top-[15px] right-5"
              onClick={() => {
                toggleModal();
              }}
            />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
};

export default Modal;
