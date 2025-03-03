import { AnimatePresence, motion } from "framer-motion";

type ErrorProps = {
  touched: boolean | undefined;
  error: string | undefined;
}

export const Error = ({ touched, error }: ErrorProps) => {
  return (
    <div className="h-3.5">
      <AnimatePresence>
        {touched && error ? (
          <motion.div
            initial={{
              y: -2,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            exit={{
              y: 2,
              opacity: 0
            }}
            className="text-sm text-[#FD0F0F]"
          >
            {error}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
