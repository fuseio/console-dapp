import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectOperatorSlice, setIsBillingModalOpen } from "@/store/operatorSlice";
import Button from "../ui/Button";
import Image from "next/image";
import close from "@/assets/close.svg";
import chevronDown from "@/assets/chevron-gray-down.svg";
import searchIcon from "@/assets/search-big.svg";
import { useFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import CountryList from 'country-list-with-dial-code-and-flag'

type ErrorProps = {
  touched: boolean | undefined;
  error: string | undefined;
}

interface FormValues {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
}

type InputProps = {
  formik: FormikProps<FormValues>;
  name: string;
  placeholder: string;
  label: keyof FormValues;
  type?: string;
  className?: string;
  required?: boolean;
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

const Input = ({ formik, name, placeholder, label, type = "text", className = "", required = false }: InputProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={label} className={`text-sm text-fuse-black font-medium ${required ? "after:content-['*'] after:text-bean-red" : ""}`}>
        {name}
      </label>
      <input
        type={type}
        id={label}
        name={label}
        placeholder={placeholder}
        className="bg-white px-4 py-2 rounded h-10 text-sm placeholder:text-darker-gray placeholder:italic"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[label]}
      />
      <Error touched={formik.touched[label]} error={formik.errors[label]} />
    </div>
  )
}

const TextareaInput = ({ formik, name, placeholder, label, className = "", required = false }: InputProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={label} className={`text-sm text-fuse-black font-medium ${required ? "after:content-['*'] after:text-bean-red" : ""}`}>
        {name}
      </label>
      <textarea
        id={label}
        name={label}
        placeholder={placeholder}
        className="bg-white px-4 py-2 rounded h-24 text-sm resize-none placeholder:text-darker-gray placeholder:italic"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[label]}
      />
      <Error touched={formik.touched[label]} error={formik.errors[label]} />
    </div>
  )
}

const SelectInput = ({ formik, name, placeholder, label, required }: InputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const countries = CountryList.getAll({ withSecondary: false });

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 relative">
      <label htmlFor={label} className={`text-sm text-fuse-black font-medium ${required ? "after:content-['*'] after:text-bean-red" : ""}`}>
        {name}
      </label>

      <div className="relative">
        <motion.div
          className="absolute top-0 left-0 z-10 w-full bg-white rounded"
          initial={{ height: "40px" }}
          animate={{ height: isOpen ? "auto" : "40px" }}
          exit={{ height: "40px" }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex justify-between items-center w-full px-5 py-3 text-sm ${formik.values[label] ? "" : "text-darker-gray italic"}`}
          >
            {formik.values[label] ? countries.find(c => c.name === formik.values[label])?.name : placeholder}
            <Image src={chevronDown} alt="chevron down" width={11} height={6} />
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 py-2"
              >
                <div className="flex items-center gap-2 px-3 py-2 bg-spring-wood rounded">
                  <Image src={searchIcon} alt="search" width={20} height={20} />
                  <input
                    type="text"
                    id={label}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={formik.handleBlur}
                    className="w-full focus:outline-none text-sm bg-light-gray"
                    placeholder="Search"
                    autoFocus
                  />
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {filteredCountries.map((country) => (
                      <motion.div
                        layout
                        key={country.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="my-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm rounded hover:bg-success flex items-center gap-2"
                        onClick={() => {
                          formik.setFieldValue(label, country.name);
                          setIsOpen(false);
                          setSearch("");
                        }}
                      >
                        <div>
                          {country.flag}
                        </div>
                        {country.name}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-10">
        <Error touched={formik.touched[label]} error={formik.errors[label]} />
      </div>
    </div>
  );
};

const BillingModal = (): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "billing-modal-bg") {
        dispatch(setIsBillingModalOpen(false));
      }
    });
  }, [dispatch]);

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      country: '',
      city: '',
      state: '',
      postalCode: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
      lastName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
      address1: Yup.string().max(500, 'Must be 500 characters or less').required('Required'),
      address2: Yup.string().max(500, 'Must be 500 characters or less'),
      country: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
      city: Yup.string().max(300, 'Must be 300 characters or less').required('Required'),
      state: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
      postalCode: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: () => { },
  });

  return (
    <AnimatePresence>
      {operatorSlice.isBillingModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="billing-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-light-gray h-[1174px] w-[746px] max-h-[95vh] max-w-[95%] overflow-y-auto z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 py-20 px-20 md:px-5 md:py-8 rounded-[20px] flex flex-col"
          >
            <Image
              src={close}
              alt="close"
              className="cursor-pointer absolute top-7 right-7"
              width={26}
              height={26}
              onClick={() => {
                dispatch(setIsBillingModalOpen(false));
              }}
            />
            <p className="text-4xl text-fuse-black font-semibold max-w-md">
              Please fill-in your billing information
            </p>
            <p className="text-xl text-fuse-black mt-2 max-w-72">
              You will receive an invoice once your payment is processed
            </p>
            <form
              className="grid grid-cols-2 gap-4 mt-12"
              onSubmit={formik.handleSubmit}
            >
              <Input formik={formik} name="First Name" placeholder="First name" label="firstName" required />
              <Input formik={formik} name="Last Name" placeholder="Last name" label="lastName" required />
              <TextareaInput formik={formik} name="Address 1" placeholder="Address 1" label="address1" className="col-span-2" required />
              <TextareaInput formik={formik} name="Address 2 (Optional)" placeholder="Address 2" label="address2" className="col-span-2" />
              <SelectInput formik={formik} name="Country" placeholder="Select Country" label="country" required />
              <Input formik={formik} name="City" placeholder="City" label="city" required />
              <Input formik={formik} name="State" placeholder="State" label="state" required />
              <Input formik={formik} name="Postal Code" placeholder="Postal code" label="postalCode" required />
              <Input formik={formik} name="Email" placeholder="Email" label="email" type="email" className="col-span-2" required />
              <Button
                text="Save Now"
                className="transition ease-in-out col-span-2 bg-success font-bold leading-none w-full h-14 max-w-96 mx-auto rounded-full hover:bg-black hover:text-white"
                type="submit"
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default BillingModal;
