import NavMenu from "@/components/NavMenu";
import Button from "@/components/ui/Button";
import { buildSubMenuItems } from "@/lib/helpers";
import { setIsBillingModalOpen, setIsPayModalOpen } from "@/store/operatorSlice";
import { useAppDispatch } from "@/store/store";

const planDetails = [
  {
    title: "Current plan",
    value: "Starter"
  },
  {
    title: "API calls",
    value: "10K"
  },
  {
    title: "Transactions",
    value: "1000"
  },
  {
    title: "Webhook calls",
    value: "10K"
  }
]

const paymentDetails = [
  {
    title: "Next invoice issue date",
    value: "-"
  },
  {
    title: "Prepaid months remaining",
    value: "-"
  }
]

const invoices = [
  {
    date: "Aug 24, 2024",
    months: 1,
    total: "$100",
    status: "Paid"
  },
  {
    date: "Sep 24, 2024",
    months: 3,
    total: "$300",
    status: "Paid"
  }
];

const Home = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <div className="w-8/9 flex flex-col mt-[30.84px] mb-[104.95px] md:mt-12 md:w-9/10 max-w-7xl">
        <NavMenu menuItems={buildSubMenuItems} isOpen={true} selected="billing & plan" className="md:flex md:justify-center" />

        <section className="mt-20 flex flex-col gap-10 max-w-[915px]">
          <div className="flex justify-between items-center gap-4 md:flex-col md:items-start">
            <h1 className="text-5xl md:text-[32px] text-fuse-black font-semibold leading-none md:leading-tight md:text-center">
              Billing & Plan
            </h1>
            <Button
              text="Enter Billing Info"
              className="transition ease-in-out bg-success text-lg leading-none text-black font-semibold rounded-full hover:bg-black hover:text-white"
              padding="py-3 px-9"
              onClick={() => dispatch(setIsBillingModalOpen(true))}
            />
          </div>
          <div className="flex justify-between items-center gap-4 max-w-[824px] md:flex-col md:items-start">
            {planDetails.map((detail, index) => (
              <div key={index} className="flex flex-col gap-2">
                <p className="text-text-dark-gray">
                  {detail.title}
                </p>
                <p className="text-2xl text-fuse-black font-semibold leading-none">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-40 flex flex-col gap-10 max-w-[688px] md:mt-20">
          <h2 className="text-2xl text-fuse-black font-bold underline underline-offset-4">
            Payment
          </h2>
          <div className="flex justify-between items-center gap-4 md:flex-col md:items-start">
            <Button
              text="Upgrade"
              className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black hover:text-black hover:bg-white rounded-full"
              padding="py-3 px-11"
              onClick={() => dispatch(setIsPayModalOpen(true))}
            />
            {paymentDetails.map((detail, index) => (
              <div key={index} className="flex flex-col gap-2">
                <p className="text-text-dark-gray">
                  {detail.title}
                </p>
                <p className="text-2xl text-fuse-black font-semibold leading-none">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-40 flex flex-col gap-10 max-w-[930px] md:mt-20">
          <h2 className="text-2xl text-fuse-black font-bold underline underline-offset-4">
            Invoices
          </h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Months</th>
                <th className="text-left">
                  <p className="block md:hidden">Invoice Total</p>
                  <p className="hidden md:block">Total</p>
                </th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-text-dark-gray">
              {invoices.map((invoice, index) => (
                <tr key={index}>
                  <td className="py-4">{invoice.date}</td>
                  <td className="py-4">{invoice.months}</td>
                  <td className="py-4">{invoice.total}</td>
                  <td className="pt-10 pb-4">
                    <p>{invoice.status}</p>
                    <p className="text-fuse-black font-medium underline underline-offset-4">
                      View Invoice
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Home;
