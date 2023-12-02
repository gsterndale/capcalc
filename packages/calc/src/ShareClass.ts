type ShareClassFields = {
  name: string;
  preMoneyShares: number;
  postMoneyShares: number;
};

class ShareClass implements ShareClassFields {
  readonly name: string;
  readonly preMoneyShares: number;
  readonly postMoneyShares: number;

  constructor(attrs: ShareClassFields) {
    this.name = attrs.name;
    this.preMoneyShares = attrs.preMoneyShares;
    this.postMoneyShares = attrs.postMoneyShares;
  }

  preMoneyPercentOwnership(totalPreMoneyShares: number) {
    return this.preMoneyShares / totalPreMoneyShares;
  }
  preMoneyOwnershipValue(preMoneySharePrice: number) {
    return preMoneySharePrice * this.preMoneyShares;
  }
  postMoneyPercentOwnership(totalPostMoneyShares: number) {
    return this.postMoneyShares / totalPostMoneyShares;
  }
  postMoneyOwnershipValue(sharePriceForFinancing: number) {
    return sharePriceForFinancing * this.postMoneyShares;
  }
  postMoneyPercentChange(
    totalPostMoneyShares: number,
    totalPreMoneyShares: number
  ) {
    return (
      this.postMoneyPercentOwnership(totalPostMoneyShares) -
      this.preMoneyPercentOwnership(totalPreMoneyShares)
    );
  }
  postMoneyValueChange(
    sharePriceForFinancing: number,
    preMoneySharePrice: number
  ) {
    return (
      this.postMoneyOwnershipValue(sharePriceForFinancing) -
      this.preMoneyOwnershipValue(preMoneySharePrice)
    );
  }
  postMoneyDilution(totalPostMoneyShares: number, totalPreMoneyShares: number) {
    const postMoneyPercentChange = this.postMoneyPercentChange(
      totalPostMoneyShares,
      totalPreMoneyShares
    );
    const preMoneyPercentOwnership =
      this.preMoneyPercentOwnership(totalPreMoneyShares);

    if (postMoneyPercentChange == 0) {
      return 0;
    } else {
      return postMoneyPercentChange / preMoneyPercentOwnership;
    }
  }
}
export default ShareClass;
