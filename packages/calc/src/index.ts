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

interface BuildShareClassParameters {
  name: string;
  preMoneyShares: number;
  postMoneyShares: number;
  preMoneySharePrice: number;
  sharePriceForFinancing: number;
  totalPreMoneyShares: number;
  totalPostMoneyShares: number;
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
  sharePriceForFinancing!: number;
  totalSharesBeforeFinancing!: number;

  constructor(org: Organization) {
    this.organization = org;
    this.calculate();
  }

  calculate() {
    // order matters
    // TODO consider whether calc functions will use this object's state (e.g. this.organization), or should be passed _all_ values.
    this.shareClasses = [];

    this.totalPreMoneyShares = this.calcTotalPreMoneyShares();
    this.totalPreMoneyOwnershipValue = this.organization.preMoneyValuation;

    this.preMoneySharePrice = this.roundTo(
      this.totalPreMoneyOwnershipValue / this.totalPreMoneyShares,
      5
    );

    this.totalPostMoneyOwnershipValue =
      this.organization.preMoneyValuation + this.organization.newMoneyRaised;

    this.sharePriceForFinancing = this.calcSharePriceForFinancing(
      this.totalPreMoneyShares,
      this.totalPostMoneyOwnershipValue,
      this.preMoneySharePrice
    );

    const newOptionsShareClassShares = this.calcNewOptionsShareClassShares(
      this.totalPostMoneyOwnershipValue,
      this.sharePriceForFinancing
    );

    const notesShareClassPostMoneyShares =
      this.calcNotesShareClassPostMoneyShares(
        this.totalPreMoneyShares,
        this.sharePriceForFinancing
      );

    this.totalSharesBeforeFinancing =
      notesShareClassPostMoneyShares +
      this.totalPreMoneyShares +
      newOptionsShareClassShares;

    const newMoneyShareClassPostMoneyShares = this.roundTo(
      this.organization.newMoneyRaised / this.sharePriceForFinancing,
      0
    );

    this.totalPostMoneyShares = [
      this.totalPreMoneyShares,
      newOptionsShareClassShares,
      notesShareClassPostMoneyShares,
      newMoneyShareClassPostMoneyShares,
    ].reduce((memo, a) => memo + a, 0);

    const aggregates = {
      preMoneySharePrice: this.preMoneySharePrice,
      sharePriceForFinancing: this.sharePriceForFinancing,
      totalPreMoneyShares: this.totalPreMoneyShares,
      totalPostMoneyShares: this.totalPostMoneyShares,
    };

    const foundersShareClass = this.buildShareClass({
      name: "Founders' Shares",
      preMoneyShares: this.organization.foundersNumberOfShares,
      postMoneyShares: this.organization.foundersNumberOfShares,
      ...aggregates,
    });

    const commonShareClass = this.buildShareClass({
      name: "Rest of Common",
      preMoneyShares: this.organization.commonNumberOfShares,
      postMoneyShares: this.organization.commonNumberOfShares,
      ...aggregates,
    });
    const warrantsShareClass = this.buildShareClass({
      name: "Warrants",
      preMoneyShares: this.organization.warrantsNumberOfShares,
      postMoneyShares: this.organization.warrantsNumberOfShares,
      ...aggregates,
    });
    const grantedOptionsShareClass = this.buildShareClass({
      name: "Granted Options",
      preMoneyShares: this.organization.grantedOptionsNumberOfShares,
      postMoneyShares: this.organization.grantedOptionsNumberOfShares,
      ...aggregates,
    });
    const oldOptionsShareClass = this.buildShareClass({
      name: "Options Available before",
      preMoneyShares: this.organization.oldOptionsNumberOfShares,
      postMoneyShares: this.organization.oldOptionsNumberOfShares,
      ...aggregates,
    });

    const newOptionsShareClass = this.buildShareClass({
      name: "New Options for Pool",
      preMoneyShares: 0,
      postMoneyShares: newOptionsShareClassShares,
      ...aggregates,
    });

    const notesShareClass = this.buildShareClass({
      name: "Convertible Notes Into New Share Class",
      preMoneyShares: 0,
      postMoneyShares: notesShareClassPostMoneyShares,
      ...aggregates,
    });

    const newMoneyShareClass = this.buildShareClass({
      name: "New Money Equity",
      preMoneyShares: 0,
      postMoneyShares: newMoneyShareClassPostMoneyShares,
      ...aggregates,
    });

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

    this.totalPostMoneyOwnershipValue = this.shareClasses.reduce(
      (sum, sc) => sum + sc.postMoneyOwnershipValue,
      0
    );
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

  iteratate(cb: Function, lastGuess = 0.0, max = 1000, decimals = 3) {
    let newGuess;
    for (let i = 0; i < max; i++) {
      newGuess = this.roundTo(cb(lastGuess), decimals);
      if (newGuess === lastGuess) return newGuess;
      lastGuess = newGuess;
    }
    throw new Error(`Unable to find solution in ${max} iterations.`);
  }

  buildShareClass({
    name,
    preMoneyShares,
    postMoneyShares,
    preMoneySharePrice,
    sharePriceForFinancing,
    totalPreMoneyShares,
    totalPostMoneyShares,
  }: BuildShareClassParameters): ShareClassInterface {
    if (isNaN(totalPostMoneyShares) || totalPostMoneyShares <= 0)
      throw new Error(`totalPostMoneyShares is ${totalPostMoneyShares}`);
    const preMoneyPercentOwnership = preMoneyShares / totalPreMoneyShares;
    const preMoneyOwnershipValue = preMoneySharePrice * preMoneyShares;
    const postMoneyPercentOwnership = postMoneyShares / totalPostMoneyShares;
    const postMoneyOwnershipValue = sharePriceForFinancing * postMoneyShares;
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

  calcNewOptionsShareClassShares(
    totalPostMoneyOwnershipValue: number,
    sharePriceForFinancing: number
  ): number {
    return this.roundTo(
      (this.organization.postMoneyOptionPoolSize *
        totalPostMoneyOwnershipValue) /
        sharePriceForFinancing,
      0
    );
  }

  OLDcalcNewOptionsShareClassShares() {
    // Reference for spreadsheet formula
    // const gExistingSharesBeforeFinancing = this.totalPreMoneyShares;
    // const gNewMoneyIn = this.organization.newMoneyRaised;
    // const gPreMoneyValuation = this.organization.preMoneyValuation;
    // const gOldPool = this.organization.oldOptionsNumberOfShares;
    // const gPostMoneyOptionPool = this.organization.postMoneyOptionPoolSize;
    const shares =
      (this.totalPreMoneyShares /
        (1 / this.organization.postMoneyOptionPoolSize - 1)) *
        (1 +
          this.organization.newMoneyRaised /
            this.organization.preMoneyValuation) -
      this.organization.oldOptionsNumberOfShares / 1 -
      this.organization.postMoneyOptionPoolSize /
        (1 -
          (this.organization.newMoneyRaised /
            this.organization.preMoneyValuation) *
            (1 / this.organization.postMoneyOptionPoolSize - 1));
    return this.roundTo(shares, 0);
  }

  // Greg's algebra
  OLDcalcSharePriceForFinancing(
    preMoneyValuation: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ): number {
    const totalAdjustedConversionAmount = this.organization.notes.reduce(
      (memo: number, note: Note) => {
        const conversionAmount = this.calcNoteConversionAmount(note);
        const adjustedConversionAmount =
          conversionAmount / (1 - note.conversionDiscount);
        return memo + adjustedConversionAmount;
      },
      0
    );
    const sharePriceForFinancing =
      (preMoneyValuation - totalAdjustedConversionAmount) /
      (preMoneyShares + newOptionsShareClassShares);
    return this.roundTo(sharePriceForFinancing, 2);
  }

  calcNotesShareClassValue(
    sharePriceForFinancing: number,
    preMoneyShares: number
  ): number {
    return this.organization.notes.reduce((memo: number, note: Note) => {
      const conversionAmount = this.calcNoteConversionAmount(note);
      const capValue =
        (conversionAmount * sharePriceForFinancing) /
        (note.conversionCap / preMoneyShares);
      const discountValue = conversionAmount / (1 - note.conversionDiscount);
      const maxValue = Math.max(capValue, discountValue);
      /*
      console.log({
        note: note,
        sharePriceForFinancing: sharePriceForFinancing,
        preMoneyShares: preMoneyShares,
        conversionAmount: conversionAmount,
        discountValue: discountValue,
        capValue: capValue,
      });
      */
      return this.roundTo(memo + maxValue, 2);
    }, 0);
  }

  calcSharePriceForFinancing(
    totalPreMoneyShares: number,
    totalPostMoneyOwnershipValue: number,
    preMoneySharePrice: number
  ): number {
    let spff: number = this.iteratate(
      (guess: number): number => {
        const notesShareClassValue = this.calcNotesShareClassValue(
          guess,
          totalPreMoneyShares
        );
        return (
          (totalPostMoneyOwnershipValue *
            (1 - this.organization.postMoneyOptionPoolSize) -
            this.organization.newMoneyRaised -
            notesShareClassValue) /
          totalPreMoneyShares
        );
      },
      preMoneySharePrice, // starting guess
      1000, // iterations
      5 // decimals
    );
    return this.roundTo(spff, 5);
  }

  calcNoteConversionAmount(note: Note): number {
    if (note.conversionAmount !== undefined) return note.conversionAmount;
    const principal = note.principalInvested || 0;
    let interestAccrued = 0;
    if (
      note.interestRate &&
      note.interestStartDate &&
      principal &&
      note.conversionDate &&
      note.interestConverts
    ) {
      const periodInMS =
        note.conversionDate.getTime() - note.interestStartDate.getTime();
      const msPerDay = 1000 * 60 * 60 * 24;
      const periodInDays = Math.round(periodInMS / msPerDay);
      const daysPerYear = 365;
      const period = this.roundTo(periodInDays / daysPerYear, 2); // calculating to the nearest hundreth
      interestAccrued = this.calcInterestAccrued(
        principal,
        note.interestRate,
        period
      );
    }

    return principal + interestAccrued;
  }

  calcInterestAccrued(principal: number, rate: number, period: number): number {
    return this.roundTo(rate * principal * period, 2);
  }

  roundTo(num: number, decimals: number): number {
    if (decimals === 0) return Math.round(num);
    const pow = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * pow) / pow;
  }

  calcNotesShareClassPostMoneyShares(
    preMoneyShares: number,
    sharePriceForFinancing: number
  ): number {
    return this.organization.notes.reduce((memo: number, note: Note) => {
      const conversionAmount = this.calcNoteConversionAmount(note);
      const capPrice = this.roundTo(note.conversionCap / preMoneyShares, 2);
      const capShares = this.roundTo(conversionAmount / capPrice, 0);

      const discountPrice = this.roundTo(
        sharePriceForFinancing * (1 - note.conversionDiscount),
        2
      );

      const discountShares = this.roundTo(conversionAmount / discountPrice, 0);

      const noteShares = Math.max(discountShares, capShares);

      /*
      console.log({
        note: note,
        conversionAmount: conversionAmount, // slightly off due to time math?
        sharePriceForFinancing: sharePriceForFinancing, // correct based on Greg's algebra
        preMoneyShares: preMoneyShares,
        discountPrice: discountPrice, // all correct
        discountShares: discountShares, // all correct
        noteShares: noteShares, // all correct
        capPrice: capPrice, // all correct
        capShares: capShares, // all correct
      });
      */

      return this.roundTo(memo + noteShares, 0);
    }, 0);
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

export { Organization, CapTable, ShareClassInterface };
