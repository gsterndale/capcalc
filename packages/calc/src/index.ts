type Organization = {
  newShareClass: string;
  preMoneyValuation: number;
  newMoneyRaised: number;
  noteConversion: boolean;
  notesConvertToNewClass: boolean;
  expandOptionPool: boolean;
  postMoneyOptionPoolSize: number;
  notes: Note[];
  foundersNumberOfShares: number;
  commonNumberOfShares: number;
  warrantsNumberOfShares: number;
  grantedOptionsNumberOfShares: number;
  oldOptionsNumberOfShares: number;
};

type Note = {
  principalInvested?: number;
  interestStartDate?: Date;
  interestRate?: number;
  interestConverts?: boolean;
  conversionCap: number;
  conversionDiscount: number;
  conversionDate: Date;
  conversionAmount?: number;
};

interface CapTableInterface {
  readonly shareClasses: ShareClassInterface[];
  readonly totalPreMoneyShares: number;
  readonly totalPreMoneyOwnershipValue: number;
  readonly totalPostMoneyShares: number;
  readonly totalPostMoneyPercentOwnership: number;
  readonly totalPostMoneyOwnershipValue: number;
  readonly totalPostMoneyValueChange: number;
  readonly totalPostMoneyDilution: number;
}

class CapTable implements CapTableInterface {
  // TODO why do we have to redefine these properties if they're defined in the CapTable interface already?
  shareClasses!: ShareClassInterface[];
  totalPreMoneyShares!: number;
  totalPreMoneyOwnershipValue!: number;
  totalPostMoneyShares!: number;
  totalPostMoneyPercentOwnership!: number;
  totalPostMoneyOwnershipValue!: number;
  totalPostMoneyValueChange!: number;
  totalPostMoneyDilution!: number;

  organization: Organization;

  preMoneySharePrice!: number;
  postMoneySharePrice!: number;
  totalSharesBeforeFinancing!: number;

  constructor(org: Organization) {
    this.organization = org;
    this.calculate();
  }

  calculate() {
    // order matters
    // TODO consider whether calc functions will use this object's state (e.g. this.organization), or should be passed all values.
    this.shareClasses = [];

    this.totalPreMoneyShares = this.calcTotalPreMoneyShares();
    this.totalPreMoneyOwnershipValue = this.organization.preMoneyValuation;

    const newOptionsShareClassShares = this.calcNewOptionsShareClassShares();

    const notesShareClassDiscountPrice = this.calcNotesShareClassDiscountPrice(
      this.organization.preMoneyValuation,
      this.totalPreMoneyShares,
      newOptionsShareClassShares
    );

    const notesShareClassDiscountShares =
      this.calcNotesShareClassDiscountShares(notesShareClassDiscountPrice);

    const notesShareClassCapShares = this.calcNotesShareClassCapShares(
      this.totalPreMoneyShares
    );

    const notesShareClassPostMoneyShares = Math.max(
      notesShareClassDiscountShares,
      notesShareClassCapShares
    );

    this.preMoneySharePrice =
      this.organization.preMoneyValuation / this.totalPreMoneyShares;

    this.totalSharesBeforeFinancing =
      notesShareClassPostMoneyShares +
      this.totalPreMoneyShares +
      newOptionsShareClassShares;

    this.postMoneySharePrice =
      this.organization.preMoneyValuation / this.totalSharesBeforeFinancing;

    const foundersShareClass = this.buildShareClass(
      "Founders' Shares",
      this.organization.foundersNumberOfShares,
      this.organization.foundersNumberOfShares
    );

    const commonShareClass = this.buildShareClass(
      "Rest of Common",
      this.organization.commonNumberOfShares,
      this.organization.commonNumberOfShares
    );
    const warrantsShareClass = this.buildShareClass(
      "Warrants",
      this.organization.warrantsNumberOfShares,
      this.organization.warrantsNumberOfShares
    );
    const grantedOptionsShareClass = this.buildShareClass(
      "Granted Options",
      this.organization.grantedOptionsNumberOfShares,
      this.organization.grantedOptionsNumberOfShares
    );
    const oldOptionsShareClass = this.buildShareClass(
      "Options Available before",
      this.organization.oldOptionsNumberOfShares,
      this.organization.oldOptionsNumberOfShares
    );

    const newOptionsShareClass = this.buildShareClass(
      "New Options for Pool",
      0,
      newOptionsShareClassShares
    );

    const notesShareClass = this.buildShareClass(
      "Convertible Notes Into New Share Class",
      0,
      notesShareClassPostMoneyShares
    );

    const newMoneyShareClassPostMoneyShares = Math.round(
      this.organization.newMoneyRaised / this.postMoneySharePrice
    );

    const newMoneyShareClass = this.buildShareClass(
      "New Money Equity",
      0,
      newMoneyShareClassPostMoneyShares
    );

    const preMoneyShareClasses = [
      foundersShareClass,
      commonShareClass,
      warrantsShareClass,
      grantedOptionsShareClass,
      oldOptionsShareClass,
    ];

    this.shareClasses.push(
      ...preMoneyShareClasses,
      newOptionsShareClass,
      notesShareClass,
      newMoneyShareClass
    );

    this.totalPostMoneyShares = this.shareClasses.reduce(
      (sum, sc) => sum + sc.postMoneyShares,
      0
    );
    this.totalPostMoneyOwnershipValue = this.shareClasses.reduce(
      (sum, sc) => sum + sc.postMoneyOwnershipValue,
      0
    );
    const check =
      this.organization.preMoneyValuation + this.organization.newMoneyRaised;
    if (check !== this.totalPostMoneyOwnershipValue) {
      const message = `Expected ${this.totalPostMoneyOwnershipValue} to eq ${check}.`;
      console.warn(message);
    }
    this.totalPostMoneyPercentOwnership = this.shareClasses.reduce(
      (sum, sc) => sum + sc.postMoneyPercentOwnership,
      0
    );
    this.totalPostMoneyValueChange = this.shareClasses.reduce(
      (sum, sc) => sum + sc.postMoneyValueChange,
      0
    );
    this.totalPostMoneyDilution = this.shareClasses.reduce(
      (sum, sc) => sum + sc.postMoneyDilution,
      0
    );
  }

  buildShareClass(
    name: string,
    preMoneyShares: number,
    postMoneyShares: number
  ): ShareClassInterface {
    const preMoneyPercentOwnership = preMoneyShares / this.totalPreMoneyShares;
    const preMoneyOwnershipValue = this.preMoneySharePrice * preMoneyShares;
    const postMoneyPercentOwnership =
      postMoneyShares / this.totalPostMoneyShares;
    const postMoneyOwnershipValue = this.postMoneySharePrice * postMoneyShares;
    const postMoneyPercentChange =
      postMoneyPercentOwnership - preMoneyPercentOwnership;
    const postMoneyValueChange =
      postMoneyOwnershipValue - preMoneyOwnershipValue;
    const postMoneyDilution = postMoneyPercentChange / preMoneyPercentOwnership;
    return {
      name,
      preMoneyShares,
      preMoneyPercentOwnership,
      preMoneyOwnershipValue,
      postMoneyShares,
      postMoneyPercentOwnership,
      postMoneyOwnershipValue,
      postMoneyPercentChange,
      postMoneyValueChange,
      postMoneyDilution,
    };
  }

  calcNewOptionsShareClassShares() {
    const gExistingSharesBeforeFinancing = this.totalPreMoneyShares;
    const gNewMoneyIn = this.organization.newMoneyRaised;
    const gPreMoneyValuation = this.organization.preMoneyValuation;
    const gOldPool = this.organization.oldOptionsNumberOfShares;
    const gPostMoneyOptionPool = this.organization.postMoneyOptionPoolSize;
    const shares =
      (gExistingSharesBeforeFinancing / (1 / gPostMoneyOptionPool - 1)) *
        (1 + gNewMoneyIn / gPreMoneyValuation) -
      gOldPool / 1 -
      gPostMoneyOptionPool /
        (1 -
          (gNewMoneyIn / gPreMoneyValuation) * (1 / gPostMoneyOptionPool - 1));
    return Math.round(shares);
  }

  calcNotesShareClassDiscountPrice(
    preMoneyValuation: number,
    existingSharesBeforeFinancing: number,
    newPool: number
  ): number {
    const overrideNote = this.organization.notes[0]; // TODO find by class
    if (overrideNote.conversionAmount === undefined) return 0;
    return (
      (preMoneyValuation * (1 - overrideNote.conversionDiscount) -
        overrideNote.conversionAmount) /
      (existingSharesBeforeFinancing + newPool)
    );
  }

  calcNotesShareClassDiscountShares(discountPrice: number) {
    const overrideNote = this.organization.notes[0]; // TODO find by class
    if (overrideNote.conversionAmount === undefined) return 0;
    return Math.round(overrideNote.conversionAmount / discountPrice); // TODO round or floor?
  }

  calcNotesShareClassCapShares(totalPreMoneyShares: number) {
    const overrideNote = this.organization.notes[0]; // TODO find by class
    if (overrideNote.conversionAmount === undefined) return 0;
    const conversionCapPrice = overrideNote.conversionCap / totalPreMoneyShares;
    return overrideNote.conversionAmount / conversionCapPrice;
  }

  calcTotalPreMoneyShares() {
    return [
      this.organization.foundersNumberOfShares,
      this.organization.commonNumberOfShares,
      this.organization.warrantsNumberOfShares,
      this.organization.grantedOptionsNumberOfShares,
      this.organization.oldOptionsNumberOfShares,
    ].reduce((memo, a) => memo + a, 0);
  }
}

interface ShareClassInterface {
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

export { CapTable, ShareClassInterface };
