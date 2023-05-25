type Organization = {
  newShareClass: string;
  preMoneyValuation: number;
  newMoneyRaised: number;
  noteConversion: boolean;
  notesConvertToNewClass: boolean;
  expandOptionPool: boolean;
  postMoneyOptionPoolSize: number;
  notes: Note[];
  preMoneyShareClasses: { name: string; numberOfShares: number }[];
};

type Note = {
  principalInvested?: number;
  interestStartDate?: Date;
  interestRate?: number;
  interestConverts?: boolean;
  conversionCap: number;
  conversionDiscount: number;
  conversionDate: Date;
};

interface CapTableInterface {
  readonly shareClasses: ShareClass[];
  readonly totalPreMoneyShares: number;
  readonly totalPreMoneyPercentOwnership: number;
  readonly totalPreMoneyOwnershipValue: number;
  readonly totalPostMoneyShares: number;
  readonly totalPostMoneyNewOwnership: number;
  readonly totalPostMoneyPercentChange: number;
  readonly totalPostMoneyOwnershipValue: number;
  readonly totalPostMoneyValueChange: number;
  readonly totalPostMoneyDilution: number;
}

type ShareClass = {
  name: string; // found in Organization for most ShareClasses, other are "Convertible Notes into New Share Class" & "New Money Equity"
  preMoneyShares: number; // found in Organization for most ShareClasses, calculated for "Convertible Notes into New Share Class" & "New Money Equity"
  preMoneyPercentOwnership: number;
  preMoneyOwnershipValue: number;
  postMoneyShares: number;
  postMoneyNewOwnership: number;
  postMoneyPercentChange: number;
  postMoneyOwnershipValue: number;
  postMoneyValueChange: number;
  postMoneyDilution: number;
};

class CapTable implements CapTableInterface {
  // TODO why do we have to redefine these properties if they're defined in the CapTable interface already?
  shareClasses!: ShareClass[];
  totalPreMoneyShares!: number;
  totalPreMoneyPercentOwnership!: number;
  totalPreMoneyOwnershipValue!: number;
  totalPostMoneyShares!: number;
  totalPostMoneyNewOwnership!: number;
  totalPostMoneyPercentChange!: number;
  totalPostMoneyOwnershipValue!: number;
  totalPostMoneyValueChange!: number;
  totalPostMoneyDilution!: number;

  organization: Organization;

  constructor(org: Organization) {
    this.organization = org;
    this.calculate();
  }

  calculate() {
    // order matters
    this.shareClasses = this.calcShareClasses();
    this.totalPreMoneyShares = this.calcTotalPreMoneyShares();
    this.totalPreMoneyPercentOwnership = 0;
    this.totalPreMoneyOwnershipValue = 0;
    this.totalPostMoneyShares = 0;
    this.totalPostMoneyNewOwnership = 0;
    this.totalPostMoneyPercentChange = 0;
    this.totalPostMoneyOwnershipValue = 0;
    this.totalPostMoneyValueChange = 0;
    this.totalPostMoneyDilution = 0;
  }

  calcShareClasses() {
    let shareClasses = this.organization.preMoneyShareClasses.map(
      (input: { name: string; numberOfShares: number }) => {
        return this.buildPreMoneyShareClass(input.name, input.numberOfShares);
      }
    );
    shareClasses.push(
      this.buildPostMoneyShareClass(
        "Convertible Notes Into New Share Class",
        0
      ),
      this.buildPostMoneyShareClass("New Money Equity", 0),
      this.buildPostMoneyShareClass("New Options for Pool", 0)
    );
    return shareClasses;
  }

  calcTotalPreMoneyShares() {
    return this.shareClasses.reduce((sum: number, shareClass: ShareClass) => {
      return sum + shareClass.preMoneyShares;
    }, 0);
  }

  buildPreMoneyShareClass(name: string, numberOfShares: number): ShareClass {
    return {
      name: name,
      preMoneyShares: numberOfShares,
      preMoneyPercentOwnership: 0,
      preMoneyOwnershipValue: 0,
      postMoneyShares: numberOfShares,
      postMoneyNewOwnership: 0,
      postMoneyPercentChange: 0,
      postMoneyOwnershipValue: 0,
      postMoneyValueChange: 0,
      postMoneyDilution: 0,
    };
  }

  buildPostMoneyShareClass(name: string, numberOfShares: number): ShareClass {
    return {
      name: name,
      preMoneyShares: 0,
      preMoneyPercentOwnership: 0,
      preMoneyOwnershipValue: 0,
      postMoneyShares: numberOfShares,
      postMoneyNewOwnership: 0,
      postMoneyPercentChange: 0,
      postMoneyOwnershipValue: 0,
      postMoneyValueChange: 0,
      postMoneyDilution: 0,
    };
  }
}

export { CapTable, ShareClass };
