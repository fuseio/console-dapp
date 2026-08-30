import {
  useDynamicWaas,
  useEmbeddedWallet,
  useIsLoggedIn,
  useUpgradeToDynamicWaasFlow,
} from "@dynamic-labs/sdk-react-core";

import OperatorNotice from "./OperatorNotice";

/**
 * Operators who signed up with email or a social account before the Dynamic
 * environment moved to V3 wallets are still on a legacy V1/V2 Turnkey wallet.
 * Those wallets are the previous generation of Dynamic's embedded wallets and
 * are only supported through the upgrade flow, so prompt for the upgrade while
 * they can still sign in.
 *
 * The upgrade re-imports the same key into a V3 (TSS-MPC) wallet, so the
 * operator keeps their address — and with it their operator account, its funds
 * and its projects.
 */
const UpgradeWalletNotice = () => {
  const isLoggedIn = useIsLoggedIn();
  const {userHasEmbeddedWallet} = useEmbeddedWallet();
  const {dynamicWaasIsEnabled, getWaasWalletsByCredentials} = useDynamicWaas();
  const {promptUpgradeToDynamicWaasFlow} = useUpgradeToDynamicWaasFlow();

  // userHasEmbeddedWallet covers every embedded wallet generation, so the
  // absence of a WaaS credential is what marks the wallet as still being a
  // legacy one. Operators on an external wallet have neither. There is nowhere
  // to upgrade to unless the environment has V3 wallets enabled.
  const hasLegacyEmbeddedWallet =
    isLoggedIn &&
    dynamicWaasIsEnabled &&
    userHasEmbeddedWallet() &&
    getWaasWalletsByCredentials().length === 0;

  if (!hasLegacyEmbeddedWallet) {
    return null;
  }

  return (
    <OperatorNotice
      title="Upgrade your wallet to keep access to your Operator account"
      onClick={promptUpgradeToDynamicWaasFlow}
    />
  );
};

export default UpgradeWalletNotice;
