import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { chargeBridge, fetchBridgeSupportedTokens, selectOperatorSlice, setIsTopupAccountModalOpen, withRefreshToken } from "@/store/operatorSlice";
import copy from "@/assets/copy-black.svg";
import qr from "@/assets/qr.svg";
import leftArrow from "@/assets/left-arrow.svg";
import Image from "next/image";
import { cn, eclipseAddress, hex } from "@/lib/helpers";
import QRCode from "react-qr-code";
import Copy from "../ui/Copy";
import close from "@/assets/close.svg";
import { FormikProps, useFormik } from "formik";
import * as Yup from 'yup';
import Spinner from "../ui/Spinner";
import { ChargeBridgeSupportedTokens, Status } from "@/lib/types";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Address } from "viem";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

enum Tab {
  FUSE = "fuse",
  OTHER = "other"
}

type TabsProps = {
  selectedTab: Tab;
  setSelectedTab: (tab: Tab) => void;
}

type TopupFormValues = {
  chainId: string;
  amount: string;
}

type CopyAddressProps = {
  setQrCode: (qrCode: Address) => void;
  address: Address;
  alt: string;
}

type BridgeEndTime = {
  left: string;
  reached: boolean;
}

type BridgeTimeProps = {
  bridgeEndTime: BridgeEndTime;
  setBridgeEndTime: (bridgeEndTime: BridgeEndTime) => void;
}

type OtherNetworkProps = {
  setQrCode: (qrCode: Address) => void;
}

function filterTokens(data: ChargeBridgeSupportedTokens, tokenSymbol = "FUSE") {
  const filteredData: ChargeBridgeSupportedTokens = {};
  
  Object.keys(data).forEach(chainId => {
      const filteredTokens = data[chainId].filter(token => token.symbol === tokenSymbol);
      
      if (filteredTokens.length > 0) {
          filteredData[chainId] = filteredTokens;
      }
  });
  
  return filteredData;
}

const Tabs = ({ selectedTab, setSelectedTab }: TabsProps) => {
  return (
    <div className="relative flex justify-between items-center border border-lightest-gray p-1 rounded-2xl">
      <button
        className="relative p-3 w-1/2"
        onClick={() => setSelectedTab(Tab.FUSE)}
      >
        <span className={`relative z-10 leading-none font-semibold ${selectedTab === Tab.FUSE ? "text-success-dark" : ""}`}>
          Fuse
        </span>
      </button>
      <button
        className="relative p-3 w-1/2"
        onClick={() => setSelectedTab(Tab.OTHER)}
      >
        <span className={`relative z-10 leading-none font-semibold ${selectedTab === Tab.OTHER ? "text-success-dark" : ""}`}>
          Other network
        </span>
      </button>
      <motion.div
        className="absolute inset-1 w-1/2 bg-success-light rounded-xl z-0"
        animate={{
          x: selectedTab === Tab.OTHER ? "95%" : "0%",
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.25,
        }}
      />
    </div>
  );
};

const Select = ({ formik }: { formik: FormikProps<TopupFormValues> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useOutsideClick((e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  });
  const bridgeFuseTokens = filterTokens(operatorSlice.bridgeSupportedTokens)

  return (
    <div className="relative">
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-12 px-4 rounded-full bg-light-gray border cursor-pointer flex items-center justify-between",
          (formik.errors.chainId && formik.touched.chainId) ? "border-[#FD0F0F]" : "border-light-gray"
        )}
        ref={selectRef}
      >
        <span className="text-sm">
          {formik.values.chainId || "Chain"}
        </span>
        {isOpen ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 flex flex-col w-full h-40 overflow-y-auto bg-white rounded-xl shadow-lg z-50"
            ref={optionsRef}
          >
            {operatorSlice.bridgeSupportedTokensStatus === Status.PENDING && (
              <div className="p-3 animate-pulse bg-fuse-black/10">Loading...</div>
            )}
            {operatorSlice.bridgeSupportedTokensStatus === Status.SUCCESS &&
              Object.keys(bridgeFuseTokens).map((chainId, index) => (
                <button
                  key={chainId}
                  className={cn("p-3 hover:bg-light-gray transition-colors",
                    index === 0 && "rounded-t-xl",
                    index === Object.keys(bridgeFuseTokens).length - 1 && "rounded-b-xl"
                  )}
                  onClick={() => {
                    formik.setFieldValue("chainId", chainId);
                    setIsOpen(false);
                  }}
                >
                  {chainId}
                </button>
              ))}
            {operatorSlice.bridgeSupportedTokensStatus === Status.ERROR && (
              <div className="p-3 bg-[#FD0F0F] text-white">Error</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CopyAddress = ({ setQrCode, address, alt }: CopyAddressProps) => {
  return (
    <div className="flex justify-between items-center px-7 py[16.5px] border-[0.5px] border-gray-alpha-40 h-[55px] rounded-full">
      <p className="text-2xl leading-none text-text-dark-gray font-medium">
        {eclipseAddress(address)}
      </p>
      <div className="flex justify-between w-full max-w-[55px]">
        <Copy
          src={copy}
          text={address}
          alt={alt}
          width={18.97}
          height={18.81}
        />
        <Image
          src={qr}
          alt={alt}
          width={16.22}
          height={16.65}
          className="cursor-pointer"
          onClick={() => setQrCode(address)}
        />
      </div>
    </div>
  );
}

const BridgeTime = ({ bridgeEndTime, setBridgeEndTime }: BridgeTimeProps) => {
  const operatorSlice = useAppSelector(selectOperatorSlice);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (operatorSlice.chargeBridge.endTime) {
      interval = setInterval(() => {
        const now = Date.now() / 1000;
        const timeLeft = Math.floor((operatorSlice.chargeBridge.endTime / 1000) - now);

        if (timeLeft <= 0) {
          setBridgeEndTime({ left: '00:00', reached: true });
          clearInterval(interval);
        } else {
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          setBridgeEndTime({
            left: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            reached: false
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [operatorSlice.chargeBridge.endTime, setBridgeEndTime]);

  return (
    <div className="flex justify-end items-center gap-1">
      <Clock size={14} />
      <div className="flex items-center gap-1 text-sm leading-none">
        Bridge will close in <div className="w-8">{bridgeEndTime.left}</div>
      </div>
    </div>
  )
}

const OtherNetwork = ({ setQrCode }: OtherNetworkProps) => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const [bridgeEndTime, setBridgeEndTime] = useState<BridgeEndTime>({ left: '', reached: false });

  const formik = useFormik<TopupFormValues>({
    initialValues: {
      chainId: "",
      amount: "",
    },
    validationSchema: Yup.object({
      chainId: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      amount: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      dispatch(withRefreshToken(() =>
        dispatch(chargeBridge(values))
      ))
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-[0.3fr_1fr] gap-4">
          <Select formik={formik} />
          <input
            type="text"
            name="amount"
            id="amount"
            className={cn("w-full h-12 p-4 rounded-full bg-light-gray border border-light-gray",
              (formik.errors.amount && formik.touched.amount) && "border-[#FD0F0F]"
            )}
            placeholder="Amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <button
          type="submit"
          className={cn("transition ease-in-out flex justify-center items-center gap-2 p-3 leading-none font-semibold border rounded-full hover:bg-[transparent]",
            (operatorSlice.chargeBridgeStatus === Status.ERROR) ? 'bg-[#FD0F0F] border-[#FD0F0F] text-white hover:text-[#FD0F0F]' : 'bg-black border-black text-white hover:text-black'
          )}
        >
          Show bridge address
          {operatorSlice.chargeBridgeStatus === Status.PENDING && <Spinner />}
        </button>
      </form>
      {(
        operatorSlice.chargeBridge.walletAddress &&
        operatorSlice.chargeBridge.walletAddress !== hex &&
        !bridgeEndTime.reached
      ) && (
          <div className="flex flex-col gap-2">
            <p>
              Transfer FUSE tokens to the following bridge address on your selected network
            </p>
            <CopyAddress
              setQrCode={setQrCode}
              address={operatorSlice.chargeBridge.walletAddress}
              alt="copy bridge address"
            />
            <BridgeTime bridgeEndTime={bridgeEndTime} setBridgeEndTime={setBridgeEndTime} />
          </div>
        )}
    </div>
  );
}

const TopupAccountModal = (): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const [qrCode, setQrCode] = useState<Address>(hex);
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.FUSE);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "topup-account-modal-bg") {
        dispatch(setIsTopupAccountModalOpen(false));
        setQrCode(hex);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBridgeSupportedTokens());
  }, [dispatch]);

  return (
    <AnimatePresence>
      {operatorSlice.isTopupAccountModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="topup-account-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className={`bg-white min-h-[203px] ${qrCode !== hex ? "w-[300px]" : "w-[525px]"} max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl`}
          >
            {qrCode !== hex ?
              <div className="p-5 flex flex-col gap-4">
                <button
                  className="flex items-center gap-3 w-fit"
                  onClick={() => setQrCode(hex)}
                >
                  <Image
                    src={leftArrow}
                    alt="back arrow icon"
                    width={11.39}
                    height={5.7}
                  />
                  Back
                </button>
                <div className="flex justify-center">
                  <QRCode
                    size={220}
                    value={qrCode}
                  />
                </div>
              </div> :
              <div className="relative py-10 px-8 flex flex-col gap-4">
                <Image
                  src={close}
                  alt="close"
                  className="cursor-pointer w-6 absolute top-[15px] right-5"
                  onClick={() => {
                    dispatch(setIsTopupAccountModalOpen(false));
                  }}
                />
                <div className="flex flex-col gap-2 items-center text-center">
                  <p className="text-3xl leading-none font-bold">
                    Top up account balance
                  </p>
                  <p className="text-text-heading-gray max-w-md">
                    Deposit FUSE tokens to your account balance from Fuse network directly or from any other network using the Charge bridge. You can always withdraw the funds.
                  </p>
                </div>
                <p className="text-lg font-bold">
                  Deposit from:
                </p>
                <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                {selectedTab === Tab.FUSE && (
                  <CopyAddress
                    setQrCode={setQrCode}
                    address={operatorSlice.operator.user.smartWalletAddress}
                    alt="copy smart contract account address"
                  />
                )}
                {selectedTab === Tab.OTHER && (
                  <OtherNetwork
                    setQrCode={setQrCode}
                  />
                )}
              </div>
            }
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default TopupAccountModal;
