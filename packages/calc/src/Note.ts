import { asUSD, asShares, roundTo, simpleInterest } from "@capcalc/utils";

type NoteFields = {
  principalInvested: number;
  conversionDiscount: number;
  conversionDate?: Date;
  interestRate?: number;
  interestStartDate?: Date;
  conversionCap?: number;
  name?: string;
};

interface Note extends NoteFields {
  readonly principalInvested: number;
  readonly conversionDiscount: number;
  readonly conversionDate?: Date;
  readonly interestRate?: number;
  readonly interestStartDate?: Date;
  readonly conversionCap?: number;
  readonly name?: string;

  conversionAmount(): number;
  value(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ): number;
  shares(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ): number;
  price(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ): number;
}

class AbstractNoteFactory {
  static create(attrs: NoteFields): Note {
    if (attrs.conversionCap === undefined) {
      return new ConvertibleNote(attrs);
    } else {
      return new CappedNote(attrs);
    }
  }
}

class ConvertibleNote implements Note {
  readonly principalInvested: number;
  readonly conversionDiscount: number;
  readonly conversionDate: Date = new Date();
  readonly interestRate: number = 0;
  readonly interestStartDate: Date = new Date();
  readonly name: string = "";

  constructor(attrs: NoteFields) {
    this.principalInvested = attrs.principalInvested;
    this.conversionDiscount = attrs.conversionDiscount;
    if (attrs.conversionDate !== undefined)
      this.conversionDate = attrs.conversionDate;
    if (attrs.interestRate !== undefined)
      this.interestRate = attrs.interestRate;
    if (attrs.interestStartDate !== undefined)
      this.interestStartDate = attrs.interestStartDate;
    if (attrs.name !== undefined) this.name = attrs.name;
  }

  conversionAmount() {
    return this.principalInvested + this.interestAccrued();
  }

  value(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    // In the spreadsheets this number is NOT rounded as you might expect a USD amount to be
    return this.conversionAmount() / (1 - this.conversionDiscount);
  }

  shares(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    return asShares(
      this.conversionAmount() /
        this.price(
          sharePriceForFinancing,
          preMoneyShares,
          newOptionsShareClassShares
        )
    );
  }

  price(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    // In the spreadsheets this number is NOT rounded as you might expect a USD amount to be
    return sharePriceForFinancing * (1 - this.conversionDiscount);
  }

  private interestAccrued() {
    if (this.interestRate && this.interestRate > 0) {
      const periodInMS =
        this.conversionDate.getTime() - this.interestStartDate.getTime();
      const msPerDay = 1000 * 60 * 60 * 24;
      const periodInDays = Math.round(periodInMS / msPerDay);
      const daysPerYear = 365;
      const period = roundTo(periodInDays / daysPerYear, 2); // calculating to the nearest hundreth
      return simpleInterest(this.principalInvested, this.interestRate, period);
    }
    return 0;
  }
}
class CappedNote extends ConvertibleNote {
  readonly conversionCap: number = 0;

  constructor(attrs: NoteFields) {
    super(attrs);
    if (attrs.conversionCap !== undefined)
      this.conversionCap = attrs.conversionCap;
  }

  value(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    //console.log({
    //  preMoneyShares,
    //  guess: sharePriceForFinancing,
    //  discountValue: this.discountValue(sharePriceForFinancing, preMoneyShares),
    //  capValue: this.capValue(sharePriceForFinancing, preMoneyShares),
    //});
    return Math.max(
      this.discountValue(
        sharePriceForFinancing,
        preMoneyShares,
        newOptionsShareClassShares
      ),
      this.capValue(
        sharePriceForFinancing,
        preMoneyShares,
        newOptionsShareClassShares
      )
    );
  }

  shares(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    //console.log({
    //  preMoneyShares,
    //  guess: sharePriceForFinancing,
    //  discountShares: this.discountShares(
    //    sharePriceForFinancing,
    //    preMoneyShares
    //  ),
    //  capShares: this.capShares(sharePriceForFinancing, preMoneyShares),
    //});
    return Math.max(
      this.discountShares(
        sharePriceForFinancing,
        preMoneyShares,
        newOptionsShareClassShares
      ),
      this.capShares(
        sharePriceForFinancing,
        preMoneyShares,
        newOptionsShareClassShares
      )
    );
  }

  price(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    //console.log({
    //  preMoneyShares,
    //  discountPrice: this.discountPrice(sharePriceForFinancing, preMoneyShares),
    //  capPrice: this.capPrice(sharePriceForFinancing, preMoneyShares),
    //});
    return Math.min(
      this.discountPrice(
        sharePriceForFinancing,
        preMoneyShares,
        newOptionsShareClassShares
      ),
      this.capPrice(
        sharePriceForFinancing,
        preMoneyShares,
        newOptionsShareClassShares
      )
    );
  }

  private capValue(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    const ratio =
      sharePriceForFinancing /
      this.capPrice(
        sharePriceForFinancing,
        preMoneyShares,
        newOptionsShareClassShares
      );
    // sharePriceForFinancing / (this.conversionCap / preMoneyShares)
    // In the spreadsheets this number is NOT rounded as you might expect a USD amount to be
    return this.conversionAmount() * ratio;
  }

  private capShares(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    return asShares(
      this.conversionAmount() /
        this.capPrice(
          sharePriceForFinancing,
          preMoneyShares,
          newOptionsShareClassShares
        )
    );
  }

  private capPrice(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    // In the spreadsheets this number is NOT rounded as you might expect a USD amount to be
    return this.conversionCap / (preMoneyShares + newOptionsShareClassShares);
  }

  private discountValue(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    return super.value(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
  }

  private discountShares(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    return asShares(
      this.conversionAmount() /
        this.discountPrice(
          sharePriceForFinancing,
          preMoneyShares,
          newOptionsShareClassShares
        )
    );
  }
  private discountPrice(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    return super.price(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
  }
}

export { Note, NoteFields, AbstractNoteFactory };
