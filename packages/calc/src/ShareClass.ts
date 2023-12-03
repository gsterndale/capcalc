interface ShareClassFields {
  name: string;
  preMoneyShares: number;
  postMoneyShares: number;
}

class ShareClass implements ShareClassFields {
  readonly name: string;
  readonly preMoneyShares: number;
  readonly postMoneyShares: number;

  constructor(attrs: ShareClassFields) {
    this.name = attrs.name;
    this.preMoneyShares = attrs.preMoneyShares;
    this.postMoneyShares = attrs.postMoneyShares;
  }

  preMoneyPercentOwnership(totalPreMoneyShares: number): number {
    return this.preMoneyShares / totalPreMoneyShares;
  }

  preMoneyOwnershipValue(preMoneySharePrice: number): number {
    return preMoneySharePrice * this.preMoneyShares;
  }

  postMoneyPercentOwnership(totalPostMoneyShares: number): number {
    return this.postMoneyShares / totalPostMoneyShares;
  }

  postMoneyOwnershipValue(sharePriceForFinancing: number): number {
    return sharePriceForFinancing * this.postMoneyShares;
  }

  postMoneyPercentChange(
    totalPostMoneyShares: number,
    totalPreMoneyShares: number
  ): number {
    return (
      this.postMoneyPercentOwnership(totalPostMoneyShares) -
      this.preMoneyPercentOwnership(totalPreMoneyShares)
    );
  }

  postMoneyValueChange(
    sharePriceForFinancing: number,
    preMoneySharePrice: number
  ): number {
    return (
      this.postMoneyOwnershipValue(sharePriceForFinancing) -
      this.preMoneyOwnershipValue(preMoneySharePrice)
    );
  }

  postMoneyDilution(
    totalPostMoneyShares: number,
    totalPreMoneyShares: number
  ): number {
    const postMoneyPercentChange = this.postMoneyPercentChange(
      totalPostMoneyShares,
      totalPreMoneyShares
    );
    const preMoneyPercentOwnership =
      this.preMoneyPercentOwnership(totalPreMoneyShares);

    return postMoneyPercentChange === 0
      ? 0
      : postMoneyPercentChange / preMoneyPercentOwnership;
  }
}

export default ShareClass;
