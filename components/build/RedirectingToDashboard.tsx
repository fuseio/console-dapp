import { PuffLoader } from "react-spinners";

const RedirectingToDashboard = () => {
  return (
    <div className="w-[525px] max-w-[95%] rounded-2xl p-5 items-center flex flex-col text-center gap-[51.3px]">
      <div className="flex flex-col gap-2.5">
        <p className="text-3xl/[29.01px] font-bold">
          Redirecting to dashboard
        </p>
        <div className="flex flex-col">
          <p className="text-text-heading-gray">
            If it takes more than 5 seconds, please refresh the page.
          </p>
        </div>
      </div>
      <PuffLoader color="#20B92E" />
    </div>
  );
};

export default RedirectingToDashboard;
