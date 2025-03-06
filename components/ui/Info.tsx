import { cn } from "@/lib/helpers";

interface InfoProps {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}

const Info = ({
  children,
  containerClassName,
  className
}: InfoProps) => {
  return (
    <div className={cn("group relative cursor-help w-5 h-5 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white font-bold", containerClassName)}>
      ?
      <div className={cn("tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg group-hover:block text-black text-sm font-medium", className)}>
        {children}
      </div>
    </div>
  )
}

export default Info;
