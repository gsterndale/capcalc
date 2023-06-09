import { iterate, asUSD, asShares, roundTo } from "@capcalc/utils";
import Organization from "./Organization";
import { Note } from "./Note";
import ShareClass from "./ShareClass";

class CapTable {
  shareClasses: ShareClass[];

  preMoneySharePrice: number;
  sharePriceForFinancing: number;

  totalPreMoneyShares: number;
  totalPreMoneyOwnershipValue: number;
  totalPostMoneyShares: number;
  totalPostMoneyPercentOwnership: number;
  totalPostMoneyOwnershipValue: number;
  totalPostMoneyValueChange: number;
  totalPostMoneyDilution: number;

  constructor(org: Organization) {
    this.totalPreMoneyShares = [
      org.foundersNumberOfShares,
      org.commonNumberOfShares,
      org.warrantsNumberOfShares,
      org.grantedOptionsNumberOfShares,
      org.oldOptionsNumberOfShares,
    ].reduce((memo, a) => memo + a, 0);
    this.totalPreMoneyOwnershipValue = org.preMoneyValuation;

    this.preMoneySharePrice = roundTo(
      this.totalPreMoneyOwnershipValue / this.totalPreMoneyShares,
      5
    );

    this.totalPostMoneyOwnershipValue =
      org.preMoneyValuation + org.newMoneyRaised;

    this.sharePriceForFinancing = this.calcSharePriceForFinancing(
      this.totalPreMoneyShares,
      this.totalPostMoneyOwnershipValue,
      this.preMoneySharePrice,
      org.newMoneyRaised,
      org.postMoneyOptionPoolSize,
      org.notes
    );

    const newOptionsShareClassShares = asShares(
      (org.postMoneyOptionPoolSize * this.totalPostMoneyOwnershipValue) /
        this.sharePriceForFinancing
    );

    const notesShareClassPostMoneyShares = org.notes.reduce(
      (memo: number, note: Note) => {
        return (
          memo +
          note.shares(this.sharePriceForFinancing, this.totalPreMoneyShares)
        );
      },
      0
    );

    const newMoneyShareClassPostMoneyShares = asShares(
      org.newMoneyRaised / this.sharePriceForFinancing
    );

    this.totalPostMoneyShares = [
      this.totalPreMoneyShares,
      newOptionsShareClassShares,
      notesShareClassPostMoneyShares,
      newMoneyShareClassPostMoneyShares,
    ].reduce((memo, a) => memo + a, 0);

    this.shareClasses = [
      new ShareClass({
        name: "Founders' Shares",
        preMoneyShares: org.foundersNumberOfShares,
        postMoneyShares: org.foundersNumberOfShares,
      }),
      new ShareClass({
        name: "Rest of Common",
        preMoneyShares: org.commonNumberOfShares,
        postMoneyShares: org.commonNumberOfShares,
      }),
      new ShareClass({
        name: "Warrants",
        preMoneyShares: org.warrantsNumberOfShares,
        postMoneyShares: org.warrantsNumberOfShares,
      }),
      new ShareClass({
        name: "Granted Options",
        preMoneyShares: org.grantedOptionsNumberOfShares,
        postMoneyShares: org.grantedOptionsNumberOfShares,
      }),
      new ShareClass({
        name: "Options Available before",
        preMoneyShares: org.oldOptionsNumberOfShares,
        postMoneyShares: org.oldOptionsNumberOfShares,
      }),
      new ShareClass({
        name: "New Options for Pool",
        preMoneyShares: 0,
        postMoneyShares: newOptionsShareClassShares,
      }),
      new ShareClass({
        name: "Convertible Notes Into New Share Class",
        preMoneyShares: 0,
        postMoneyShares: notesShareClassPostMoneyShares,
      }),
      new ShareClass({
        name: "New Money Equity",
        preMoneyShares: 0,
        postMoneyShares: newMoneyShareClassPostMoneyShares,
      }),
    ];

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

  calcSharePriceForFinancing(
    totalPreMoneyShares: number,
    totalPostMoneyOwnershipValue: number,
    preMoneySharePrice: number,
    newMoneyRaised: number,
    postMoneyOptionPoolSize: number,
    notes: Note[]
  ): number {
    let spff: number = iterate(
      (guess: number): number => {
        const notesShareClassValue = notes.reduce(
          (memo: number, note: Note) => {
            return memo + note.value(guess, totalPreMoneyShares);
          },
          0
        );
        return (
          (totalPostMoneyOwnershipValue * (1 - postMoneyOptionPoolSize) -
            newMoneyRaised -
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
}

export default CapTable;
