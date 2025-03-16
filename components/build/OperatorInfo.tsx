import Info from "../ui/Info"

export const AccountBalanceInfo = () => {
  return (
    <Info>
      <p className="mb-1">
        The operator account balance is needed to pay for subscriptions.
      </p>
      <p>
        You can freely deposit and withdraw any tokens available on the Fuse Network.
      </p>
    </Info>
  )
}

export const SponsoredTransactionInfo = () => {
  return (
    <Info>
      <p className="mb-1">
        Sponsored transactions are a feature that allows you to pay for your customers gas fees.
      </p>
      <p>
        Since the gas cost in the Fuse Network is very low, your customers will not have to solve
        the gas issue on their own, you can easily take on these very small costs yourself.
      </p>
    </Info>
  )
}
