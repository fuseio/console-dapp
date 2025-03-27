import Image from "next/image"

import chargeLogin from "@/assets/charge-login.png"
import chargeRegistration from "@/assets/charge-registration.png"
import chargeWallet from "@/assets/charge-wallet.png"
import chargeDashboard from "@/assets/charge-dashboard.png"
import chargePaymentLinks from "@/assets/charge-payment-links.png"
import chargeCheckout from "@/assets/charge-checkout.png"

const AcceptCryptoPayment = () => {
  return (
    <section className="flex flex-col gap-4">
      <p>Charge simplifies the process of accepting crypto payments, making it easy for businesses to get started and enjoy the benefits of fast, low-cost, global transactions.</p>

      <p><strong>1. Go to the Charge Website</strong> at <a href="https://www.chargeweb3.com/" target="_blank" className="underline underline-offset-4">https://www.chargeweb3.com/</a> {'and click "Get early access"'}</p>

      <p><strong>2. Enter an email address</strong> or click <strong>Sign Up with Google</strong> to get started quickly.</p>

      <Image src={chargeLogin} alt="Charge login page" width={584} height={560} />

      <p>Complete verification and log in.</p>

      <p><strong>3. {"Enter your organization's or personal details"}</strong>, including your name and the approximate monthly volume of payments you expect to receive.</p>

      <Image src={chargeRegistration} alt="Charge organization details form" width={624} height={597} />

      <p><strong>4. Create a Charge wallet</strong>. {'This is hosted by Charge. You need a Charge wallet to receive payments, but you can withdraw funds to a crypto address you control whenever you want. Simply click "Create Wallet".'}</p>

      <Image src={chargeWallet} alt="Create Charge wallet page" width={624} height={432} />

      <p>{'This process typically takes just a few seconds. When your wallet has been created, click "Go to Dashboard".'}</p>

      <p><strong>5. Create a new payment link</strong>. {"Your Dashboard will display options for making and receiving payments, creating invoices, and integrating payments using Charge's API."}</p>

      <Image src={chargeDashboard} alt="Charge dashboard" width={624} height={287} />

      <p>{'Click "Create" to generate a new payment link.'}</p>

      <p><strong>6. Fill in payment details</strong>. {"You'll be prompted to provide more information about the item or service for which you want to receive payment:"}</p>

      <ul className="list-disc list-inside">
        <li><strong>Product details</strong>. Brief information about what you are selling, including an image, if you want.</li>
        <li><strong>Payment options</strong>, including price, accepted crypto tokens, blockchain network(s), and whether a maximum number can be purchased per order.</li>
        <li><strong>Design options</strong> for your payment link.</li>
      </ul>

      <p>{'When you are done, click "Create payment link".'}</p>

      <p><strong>7. Copy and use your payment link anywhere!</strong> Charge will provide you with a unique payment link for this item.</p>

      <Image src={chargePaymentLinks} alt="Charge payment link page" width={624} height={208} />

      <p>You can find a list of payment links in the Charge menu. You can use these links on your website, on social media, or send them via email or instant messenger. Clicking the link will take the user to a Charge page, where they can enter their details and make payment, using MetaMask or another Web3 wallet.</p>

      <Image src={chargeCheckout} alt="Charge payment page" width={624} height={405} />

      <p>{'You can find a list of completed payments under the "Payments" option in the Charge Dashboard menu. To check your balance and withdraw funds, select "Wallet" from the menu.'}</p>
    </section>
  );
};

export default AcceptCryptoPayment;
