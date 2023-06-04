interface ShareClass {
  name: string; // found in Organization for most ShareClasses, other are "Convertible Notes into New Share Class" & "New Money Equity"
  preMoneyShares: number; // found in Organization for most ShareClasses, calculated for "Convertible Notes into New Share Class" & "New Money Equity"
  preMoneyPercentOwnership: number;
  preMoneyOwnershipValue: number;
  postMoneyShares: number;
  postMoneyPercentOwnership: number;
  postMoneyPercentChange: number;
  postMoneyOwnershipValue: number;
  postMoneyValueChange: number;
  postMoneyDilution: number;
}

export default ShareClass;
