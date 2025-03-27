import { setIsTransfiModalOpen } from "@/store/navbarSlice";
import { useAppDispatch } from "@/store/store";

const BuyFuseToken = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      className="transition ease-in-out px-4 py-3 bg-black border border-black text-lg leading-none text-white font-semibold rounded-full hover:bg-[transparent] hover:text-black"
      onClick={() => dispatch(setIsTransfiModalOpen(true))}
    >
      Buy FUSE
    </button>
  );
};

export default BuyFuseToken;
