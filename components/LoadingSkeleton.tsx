import Footer from "@/components/Footer";

function LoadingSkeleton() {
  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex flex-col justify-between bg-light-gray h-screen">
        <nav className="w-full h-20 sticky top-0 bg-light-gray/60 backdrop-blur-xl flex justify-between items-center py-7 md:h-[32px] md:mt-2 border-b-[0.5px] border-pastel-gray"></nav>
        <Footer />
      </div>
    </div>
  )
}
export default LoadingSkeleton;
