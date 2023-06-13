import { iterate, asUSD, asShares, roundTo } from "@capcalc/utils";
import Organization from "./Organization";
import { AbstractNoteFactory, Note } from "./Note";
import ShareClass from "./ShareClass";

interface ICapTable {
  readonly organization: Organization;
  readonly notes: Note[];

  shareClasses(): ShareClass[];

  preMoneySharePrice(): number;
  sharePriceForFinancing(): number;

  totalPreMoneyShares(): number;
  totalPreMoneyOwnershipValue(): number;
  totalPostMoneyShares(): number;
  totalPostMoneyPercentOwnership(): number;
  totalPostMoneyOwnershipValue(): number;
  totalPostMoneyValueChange(): number;
  totalPostMoneyDilution(): number;
}

class CapTable implements ICapTable {
  organization: Organization;
  notes: Note[];

  private spff: number | undefined; // used to cache result of expensive calculation

  constructor(org: Organization) {
    this.organization = org;
    this.notes = org.notesFields.map((note) =>
      AbstractNoteFactory.create(note)
    );
  }

  static calcSharePriceForFinancing(
    totalPreMoneyShares: number,
    totalPostMoneyOwnershipValue: number,
    preMoneyValuation: number,
    oldOptionsNumberOfShares: number,
    postMoneyOptionPoolSize: number,
    notes: Note[]
  ): number {
    const startingGuess = preMoneyValuation / totalPreMoneyShares; // preMoneySharePrice
    let spff: number = iterate(
      (guess: number): number => {
        const notesShareClassShares = notes.reduce(
          (memo: number, note: Note) => {
            return memo + note.shares(guess, totalPreMoneyShares);
          },
          0
        );
        const guessNewAndOldOptionsNumberOfShares =
          (postMoneyOptionPoolSize * totalPostMoneyOwnershipValue) / guess;
        const guessNewOptionsNumberOfShares =
          guessNewAndOldOptionsNumberOfShares - oldOptionsNumberOfShares;
        const totalSharesBeforeFinancing =
          totalPreMoneyShares +
          guessNewOptionsNumberOfShares +
          notesShareClassShares;
        return preMoneyValuation / totalSharesBeforeFinancing;
      },
      startingGuess, // starting guess
      1000, // iterations
      5 // decimals
    );
    return roundTo(spff, 5);
  }

  shareClasses(): ShareClass[] {
    return [
      new ShareClass({
        name: "Founders' Shares",
        preMoneyShares: this.organization.foundersNumberOfShares,
        postMoneyShares: this.organization.foundersNumberOfShares,
      }),
      new ShareClass({
        name: "Rest of Common",
        preMoneyShares: this.organization.commonNumberOfShares,
        postMoneyShares: this.organization.commonNumberOfShares,
      }),
      new ShareClass({
        name: "Warrants",
        preMoneyShares: this.organization.warrantsNumberOfShares,
        postMoneyShares: this.organization.warrantsNumberOfShares,
      }),
      new ShareClass({
        name: "Convertible Notes Into New Share Class",
        preMoneyShares: 0,
        postMoneyShares: this.notesShareClassPostMoneyShares(),
      }),
      new ShareClass({
        name: "New Money Equity",
        preMoneyShares: 0,
        postMoneyShares: this.newMoneyShareClassPostMoneyShares(),
      }),
      new ShareClass({
        name: "Granted Options",
        preMoneyShares: this.organization.grantedOptionsNumberOfShares,
        postMoneyShares: this.organization.grantedOptionsNumberOfShares,
      }),
      new ShareClass({
        name: "Options Available before",
        preMoneyShares: this.organization.oldOptionsNumberOfShares,
        postMoneyShares: this.organization.oldOptionsNumberOfShares,
      }),
      new ShareClass({
        name: "New Options for Pool",
        preMoneyShares: 0,
        postMoneyShares: this.newOptionsShareClassShares(),
      }),
    ];
  }

  totalPreMoneyShares(): number {
    return [
      this.organization.foundersNumberOfShares,
      this.organization.commonNumberOfShares,
      this.organization.warrantsNumberOfShares,
      this.organization.grantedOptionsNumberOfShares,
      this.organization.oldOptionsNumberOfShares,
    ].reduce((memo, a) => memo + a, 0);
  }

  totalPostMoneyShares(): number {
    return [
      this.totalPreMoneyShares(),
      this.newOptionsShareClassShares(),
      this.notesShareClassPostMoneyShares(),
      this.newMoneyShareClassPostMoneyShares(),
    ].reduce((memo, a) => memo + a, 0);
  }

  totalPreMoneyOwnershipValue(): number {
    return this.organization.preMoneyValuation;
  }

  totalPostMoneyOwnershipValue(): number {
    return (
      this.organization.preMoneyValuation + this.organization.newMoneyRaised
    );
  }

  totalPostMoneyPercentOwnership(): number {
    return this.shareClasses().reduce(
      (sum, sc) =>
        sum + sc.postMoneyPercentOwnership(this.totalPostMoneyShares()),
      0
    );
  }

  totalPostMoneyValueChange(): number {
    return this.shareClasses().reduce(
      (sum, sc) =>
        sum +
        sc.postMoneyValueChange(
          this.sharePriceForFinancing(),
          this.preMoneySharePrice()
        ),
      0
    );
  }

  totalPostMoneyDilution(): number {
    return this.shareClasses().reduce(
      (sum, sc) =>
        sum +
        sc.postMoneyDilution(
          this.totalPostMoneyShares(),
          this.totalPreMoneyShares()
        ),
      0
    );
  }

  preMoneySharePrice(): number {
    return roundTo(
      this.totalPreMoneyOwnershipValue() / this.totalPreMoneyShares(),
      5
    );
  }

  sharePriceForFinancing(): number {
    if (this.spff === undefined) {
      this.spff = CapTable.calcSharePriceForFinancing(
        this.totalPreMoneyShares(),
        this.totalPostMoneyOwnershipValue(),
        this.organization.preMoneyValuation,
        this.organization.oldOptionsNumberOfShares,
        this.organization.postMoneyOptionPoolSize,
        this.notes
      );
    }
    return this.spff;
  }

  private newOptionsShareClassShares(): number {
    return asShares(
      (this.organization.postMoneyOptionPoolSize *
        this.totalPostMoneyOwnershipValue()) /
        this.sharePriceForFinancing() -
        this.organization.oldOptionsNumberOfShares
    );
  }

  private notesShareClassPostMoneyShares(): number {
    return this.notes.reduce((memo: number, note: Note) => {
      return (
        memo +
        note.shares(this.sharePriceForFinancing(), this.totalPreMoneyShares())
      );
    }, 0);
  }

  private newMoneyShareClassPostMoneyShares(): number {
    return asShares(
      this.organization.newMoneyRaised / this.sharePriceForFinancing()
    );
  }
}

export default CapTable;
