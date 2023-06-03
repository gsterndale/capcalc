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
  postMoneySharePrice: number;
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

    const notesShareClassPostMoneyShares =
      this.calcNotesShareClassPostMoneyShares(
        this.totalPreMoneyOwnershipValue,
        this.totalPreMoneyShares,
        newOptionsShareClassShares
      );

    this.preMoneySharePrice =
      this.totalPreMoneyOwnershipValue / this.totalPreMoneyShares;

    this.totalSharesBeforeFinancing =
      notesShareClassPostMoneyShares +
      this.totalPreMoneyShares +
      newOptionsShareClassShares;

    this.postMoneySharePrice =
      this.totalPreMoneyOwnershipValue / this.totalSharesBeforeFinancing;

    const newMoneyShareClassPostMoneyShares = Math.round(
      this.organization.newMoneyRaised / this.postMoneySharePrice
    );

    this.totalPostMoneyShares = [
      this.calcTotalPreMoneyShares(),
      newOptionsShareClassShares,
      notesShareClassPostMoneyShares,
      newMoneyShareClassPostMoneyShares,
    ].reduce((memo, a) => memo + a, 0);

    const aggregates = {
      preMoneySharePrice: this.preMoneySharePrice,
      postMoneySharePrice: this.postMoneySharePrice,
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
    const check =
      this.totalPreMoneyOwnershipValue + this.organization.newMoneyRaised;
    if (check !== this.totalPostMoneyOwnershipValue) {
      // const message = `Expected ${this.totalPostMoneyOwnershipValue} to eq ${check}.`;
      // console.warn(message);
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

  buildShareClass({
    name,
    preMoneyShares,
    postMoneyShares,
    preMoneySharePrice,
    postMoneySharePrice,
    totalPreMoneyShares,
    totalPostMoneyShares,
  }: BuildShareClassParameters): ShareClassInterface {
    if (isNaN(totalPostMoneyShares) || totalPostMoneyShares <= 0)
      throw new Error(`totalPostMoneyShares is ${totalPostMoneyShares}`);
    const preMoneyPercentOwnership = preMoneyShares / totalPreMoneyShares;
    const preMoneyOwnershipValue = preMoneySharePrice * preMoneyShares;
    const postMoneyPercentOwnership = postMoneyShares / totalPostMoneyShares;
    const postMoneyOwnershipValue = postMoneySharePrice * postMoneyShares;
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
    return Math.round(shares);
  }

  calcInterestAccrued(principal: number, rate: number, period: number): number {
    // IF(rate>0,rate/365*principal*(IF(conversionDate>0,conversionDate,TODAY())-startDate)
    return rate * principal * period;
  }

  roundTo(num: number, decimals: number): number {
    const pow = 10 ^ decimals;
    return Math.round((num + Number.EPSILON) * pow) / pow;
  }

  iteratate(cb: Function, lastGuess = 0.0, max = 1000, decimals = 3) {
    let newGuess;
    for (let i = 0; i < max; i++) {
      newGuess = this.roundTo(cb(lastGuess), decimals);
      console.log({ newGuess: newGuess, lastGuess: lastGuess, i: i });
      if (newGuess === lastGuess) return newGuess;
      lastGuess = newGuess;
    }
    throw new Error(`Unable to find solution in ${max} iterations.`);
  }

  calcNotesShareClassPostMoneyShares(
    preMoneyValuation: number,
    preMoneyShares: number,
    newPool: number
  ): number {
    console.log(this.organization.notes);

    return this.iteratate((guess: number) => {
      return this.organization.notes.reduce((memo: number, note: Note) => {
        const principal = note.principalInvested || 0;
        let interestAccrued = 0;
        if (
          note.interestRate &&
          note.interestStartDate &&
          principal &&
          note.conversionDate &&
          note.interestConverts
        ) {
          const msPerYear = 1000 * 60 * 60 * 24 * 365;
          const period =
            (note.conversionDate.getTime() - note.interestStartDate.getTime()) /
            msPerYear;
          interestAccrued = this.calcInterestAccrued(
            principal,
            note.interestRate,
            period
          );
        }

        const conversionAmount =
          note.conversionAmount || principal + interestAccrued;

        const capPrice = note.conversionCap / preMoneyShares;
        const capShares = conversionAmount / capPrice;

        // THESE ARE ALL GUESSES
        const totalSharesBeforeFinancing = guess + preMoneyShares + newPool;
        const sharePriceForFinancing =
          preMoneyValuation / totalSharesBeforeFinancing;
        // let sharePriceForFinancing = preMoneyValuation / this.totalSharesBeforeFinancing
        // This is Greg's algebra
        // const discountPrice =
        //   (preMoneyValuation * (1 - note.conversionDiscount) - conversionAmount) /
        //   (preMoneyShares + newPool);
        const discountPrice =
          sharePriceForFinancing * (1 - note.conversionDiscount);

        const discountShares = Math.round(conversionAmount / discountPrice); // TODO round or floor?

        const noteShares = Math.max(discountShares, capShares);

        // TODO left off here. why are we only iterating twice?
        // Guess should converge on 1,523,114
        // Share price for financing should be $2.14
        // Is it because the Cap always "wins" i.e. it's the max
        // Maybe try solving for SPFF?
        console.log({
          guess: guess,
          totalSharesBeforeFinancing: totalSharesBeforeFinancing,
          sharePriceForFinancing: sharePriceForFinancing,
          discountPrice: discountPrice,
          discountShares: discountShares,
          noteShares: noteShares,
          memo: memo,
          capPrice: capPrice, // all correct
          capShares: capShares, // first two correct
        });

        return memo + noteShares;
      }, 0);
    });
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
