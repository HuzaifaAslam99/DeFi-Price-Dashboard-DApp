import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PriceTrackerModule", (m) => {

  const priceTracker = m.contract("PriceTracker");

  return { priceTracker };
});