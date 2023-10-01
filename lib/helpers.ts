import { TransactionType } from "@/store/transactionsSlice";

export const eclipseAddress = (address: string): string => {
  return (
    address.substring(0, 6) +
    "..." +
    address.substring(address.length - 4, address.length)
  );
};

export const fetchTransactionsFromLocalStorage = (
  address: string
): TransactionType[] => {
  let transactions = localStorage.getItem("transactions");
  let transactionsParsed: TransactionType[] = JSON.parse(
    transactions as string
  );
  if (transactionsParsed) {
    transactionsParsed = transactionsParsed.filter(
      (transaction: TransactionType) => transaction.address === address
    );
  } else {
    transactionsParsed = [];
  }
  return transactionsParsed;
};

export const fetchAllTransactionsFromLocalStorage = () => {
  let transactions = localStorage.getItem("transactions");
  let transactionsParsed: TransactionType[] = JSON.parse(
    transactions as string
  );
  return transactionsParsed || [];
};

export const insertTransactionToLocalStorage = (
  transaction: TransactionType
) => {
  let transactions = fetchAllTransactionsFromLocalStorage();
  transactions = [transaction, ...transactions];
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

export const hex = "0x";
