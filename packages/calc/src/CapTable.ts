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
    postMoneyOptionPoolSize: number | undefined,
    notes: Note[]
  ): number {
    const startingGuess = preMoneyValuation / totalPreMoneyShares; // preMoneySharePrice
    let spff: number = iterate(
      (guess: number): number => {
        var guessNewOptionsNumberOfShares: number;
        if (postMoneyOptionPoolSize === undefined) {
          guessNewOptionsNumberOfShares = 0;
        } else {
          const guessNewAndOldOptionsNumberOfShares =
            (postMoneyOptionPoolSize * totalPostMoneyOwnershipValue) / guess;
          guessNewOptionsNumberOfShares =
            guessNewAndOldOptionsNumberOfShares - oldOptionsNumberOfShares;
        }
        const notesShareClassShares = notes.reduce(
          (memo: number, note: Note) => {
            return (
              memo +
              note.shares(
                guess,
                totalPreMoneyShares,
                guessNewOptionsNumberOfShares
              )
            );
          },
          0
        );
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
    return roundTo(spff, 4);
  }

  shareClasses(): ShareClass[] {
    return [
      new ShareClass({
        name: "Founders' Shares",
        preMoneyShares: this.organization.foundersNumberOfShares,
        postMoneyShares: this.organization.foundersNumberOfShares,
      }),
      new ShareClass({
        name: "Other Common",
        preMoneyShares: this.organization.commonNumberOfShares,
        postMoneyShares: this.organization.commonNumberOfShares,
      }),
      new ShareClass({
        name: "Common Warrants",
        preMoneyShares: this.organization.warrantsNumberOfShares,
        postMoneyShares: this.organization.warrantsNumberOfShares,
      }),
      new ShareClass({
        name: "Convertible Notes",
        preMoneyShares: 0,
        postMoneyShares: this.notesShareClassPostMoneyShares(),
      }),
      new ShareClass({
        name: "Preferred Investors",
        preMoneyShares: 0,
        postMoneyShares: this.newMoneyShareClassPostMoneyShares(),
      }),
      new ShareClass({
        name: "Options Granted",
        preMoneyShares: this.organization.grantedOptionsNumberOfShares,
        postMoneyShares: this.organization.grantedOptionsNumberOfShares,
      }),
      new ShareClass({
        name: "Options Available",
        preMoneyShares: this.organization.oldOptionsNumberOfShares,
        postMoneyShares: this.organization.oldOptionsNumberOfShares,
      }),
      new ShareClass({
        name: "Options Increase",
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
      var postMoneyOptionPoolSize = undefined;
      if (this.organization.expandOptionPool)
        postMoneyOptionPoolSize = this.organization.postMoneyOptionPoolSize;
      this.spff = CapTable.calcSharePriceForFinancing(
        this.totalPreMoneyShares(),
        this.totalPostMoneyOwnershipValue(),
        this.organization.preMoneyValuation,
        this.organization.oldOptionsNumberOfShares,
        postMoneyOptionPoolSize,
        this.notes
      );
    }
    return this.spff;
  }

  private newOptionsShareClassShares(): number {
    if (this.organization.expandOptionPool) {
      return asShares(
        (this.organization.postMoneyOptionPoolSize *
          this.totalPostMoneyOwnershipValue()) /
          this.sharePriceForFinancing() -
          this.organization.oldOptionsNumberOfShares
      );
    } else {
      return 0;
    }
  }

  private notesShareClassPostMoneyShares(): number {
    const spff = this.sharePriceForFinancing();
    const tpms = this.totalPreMoneyShares();
    const noscs = this.newOptionsShareClassShares();
    return this.notes.reduce((memo: number, note: Note) => {
      return memo + note.shares(spff, tpms, noscs);
    }, 0);
  }

  private newMoneyShareClassPostMoneyShares(): number {
    return asShares(
      this.organization.newMoneyRaised / this.sharePriceForFinancing()
    );
  }
}

export default CapTable;
