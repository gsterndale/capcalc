import { iterate, asUSD, asShares, roundTo } from "@capcalc/utils";
import Organization from "./Organization";
import { Note } from "./Note";
import ShareClass from "./ShareClass";

class CapTable {
  shareClasses!: ShareClass[];
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
    this.shareClasses = [];

    this.totalPreMoneyShares = this.calcTotalPreMoneyShares();
    this.totalPreMoneyOwnershipValue = this.organization.preMoneyValuation;

    this.preMoneySharePrice = roundTo(
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
        this.sharePriceForFinancing,
        this.totalPreMoneyShares
      );

    this.totalSharesBeforeFinancing =
      notesShareClassPostMoneyShares +
      this.totalPreMoneyShares +
      newOptionsShareClassShares;

    const newMoneyShareClassPostMoneyShares = asShares(
      this.organization.newMoneyRaised / this.sharePriceForFinancing
    );

    this.totalPostMoneyShares = [
      this.totalPreMoneyShares,
      newOptionsShareClassShares,
      notesShareClassPostMoneyShares,
      newMoneyShareClassPostMoneyShares,
    ].reduce((memo, a) => memo + a, 0);

    const foundersShareClass = new ShareClass({
      name: "Founders' Shares",
      preMoneyShares: this.organization.foundersNumberOfShares,
      postMoneyShares: this.organization.foundersNumberOfShares,
    });

    const commonShareClass = new ShareClass({
      name: "Rest of Common",
      preMoneyShares: this.organization.commonNumberOfShares,
      postMoneyShares: this.organization.commonNumberOfShares,
    });
    const warrantsShareClass = new ShareClass({
      name: "Warrants",
      preMoneyShares: this.organization.warrantsNumberOfShares,
      postMoneyShares: this.organization.warrantsNumberOfShares,
    });
    const grantedOptionsShareClass = new ShareClass({
      name: "Granted Options",
      preMoneyShares: this.organization.grantedOptionsNumberOfShares,
      postMoneyShares: this.organization.grantedOptionsNumberOfShares,
    });
    const oldOptionsShareClass = new ShareClass({
      name: "Options Available before",
      preMoneyShares: this.organization.oldOptionsNumberOfShares,
      postMoneyShares: this.organization.oldOptionsNumberOfShares,
    });

    const newOptionsShareClass = new ShareClass({
      name: "New Options for Pool",
      preMoneyShares: 0,
      postMoneyShares: newOptionsShareClassShares,
    });

    const notesShareClass = new ShareClass({
      name: "Convertible Notes Into New Share Class",
      preMoneyShares: 0,
      postMoneyShares: notesShareClassPostMoneyShares,
    });

    const newMoneyShareClass = new ShareClass({
      name: "New Money Equity",
      preMoneyShares: 0,
      postMoneyShares: newMoneyShareClassPostMoneyShares,
    });

    this.shareClasses.push(
      foundersShareClass,
      commonShareClass,
      warrantsShareClass,
      grantedOptionsShareClass,
      oldOptionsShareClass,
      newOptionsShareClass,
      notesShareClass,
      newMoneyShareClass
    );

    this.totalPostMoneyOwnershipValue = this.shareClasses.reduce(
      (sum, sc) =>
        sum + sc.postMoneyOwnershipValue(this.sharePriceForFinancing),
      0
    );
    this.totalPostMoneyPercentOwnership = this.shareClasses.reduce(
      (sum, sc) =>
        sum + sc.postMoneyPercentOwnership(this.totalPostMoneyShares),
      0
    );
    this.totalPostMoneyValueChange = this.shareClasses.reduce(
      (sum, sc) =>
        sum +
        sc.postMoneyValueChange(
          this.sharePriceForFinancing,
          this.preMoneySharePrice
        ),
      0
    );
    this.totalPostMoneyDilution = this.shareClasses.reduce(
      (sum, sc) =>
        sum +
        sc.postMoneyDilution(
          this.totalPostMoneyShares,
          this.totalPreMoneyShares
        ),
      0
    );
  }

  calcNewOptionsShareClassShares(
    totalPostMoneyOwnershipValue: number,
    sharePriceForFinancing: number
  ): number {
    return asShares(
      (this.organization.postMoneyOptionPoolSize *
        totalPostMoneyOwnershipValue) /
        sharePriceForFinancing
    );
  }

  calcNotesShareClassValue(
    sharePriceForFinancing: number,
    preMoneyShares: number
  ): number {
    return this.organization.notes.reduce((memo: number, note: Note) => {
      return memo + note.value(sharePriceForFinancing, preMoneyShares);
    }, 0);
  }

  calcSharePriceForFinancing(
    totalPreMoneyShares: number,
    totalPostMoneyOwnershipValue: number,
    preMoneySharePrice: number
  ): number {
    let spff: number = iterate(
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
    return roundTo(spff, 5);
  }

  calcNotesShareClassPostMoneyShares(
    sharePriceForFinancing: number,
    preMoneyShares: number
  ): number {
    return this.organization.notes.reduce((memo: number, note: Note) => {
      return memo + note.shares(sharePriceForFinancing, preMoneyShares);
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

export default CapTable;
