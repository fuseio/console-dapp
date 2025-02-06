import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch } from "@/store/store";
import { createOperator, setOperatorContactDetail, withRefreshToken } from "@/store/operatorSlice";
import Button from "../ui/Button";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useWalletClient } from "wagmi";

type ErrorProps = {
  touched: boolean | undefined;
  error: string | undefined;
}

const Error = ({ touched, error }: ErrorProps) => {
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

const ContactDetails = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const walletClient = useWalletClient()

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      name: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      name: Yup.string().max(20, 'Must be 20 characters or less'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: values => {
      dispatch(setOperatorContactDetail(values));
      localStorage.setItem("Fuse-operatorContactDetail", JSON.stringify(values));

      const account = walletClient.data?.account;
      if (!account) {
        console.log("WalletClient Account not found")
        return;
      }

      dispatch(withRefreshToken(() =>
        dispatch(createOperator({
          operatorContactDetail: values,
          account
        }))
      ))
    },
  });

  return (
    <div className="bg-white min-h-[625px] md:min-h-[400px] w-[548px] max-w-[95%] pt-[47.5px] px-[62px] pb-[50px] md:px-5 md:py-8 rounded-[20px] flex flex-col">
      <p className="text-[34px]/[47.6px] font-bold">
        Contact details
      </p>
      <p className="text-sm text-text-heading-gray pt-2 max-w-[416px] mr-auto">
        Share your contact details so we can stay in touch with you.
        You&apos;ll be the first to know about new features and special offers.
      </p>
      <form
        className="flex flex-col gap-3.5 w-full max-w-[441px] pt-[44.5px]"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstName" className="text-text-heading-gray font-bold">
            First name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />
          <Error touched={formik.touched.firstName} error={formik.errors.firstName} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastName" className="text-text-heading-gray font-bold">
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />
          <Error touched={formik.touched.lastName} error={formik.errors.lastName} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-text-heading-gray font-bold">
            Company (Optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          <Error touched={formik.touched.name} error={formik.errors.name} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-text-heading-gray font-bold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <Error touched={formik.touched.email} error={formik.errors.email} />
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <Button
            text="Continue"
            className="transition ease-in-out bg-success font-bold leading-none w-full h-14 rounded-full hover:bg-black hover:text-white"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};
export default ContactDetails;
