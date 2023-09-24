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
  value(sharePriceForFinancing: number, preMoneyShares: number): number;
  shares(sharePriceForFinancing: number, preMoneyShares: number): number;
  price(sharePriceForFinancing: number): number;
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
  value(sharePriceForFinancing: number, preMoneyShares: number) {
    // In the spreadsheets this number is NOT rounded as you might expect a USD amount to be
    return this.conversionAmount() / (1 - this.conversionDiscount);
  }
  shares(sharePriceForFinancing: number, preMoneyShares: number) {
    return asShares(
      this.conversionAmount() / this.price(sharePriceForFinancing)
    );
  }
  price(sharePriceForFinancing: number) {
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

  value(sharePriceForFinancing: number, preMoneyShares: number) {
    return Math.max(
      this.discountValue(sharePriceForFinancing, preMoneyShares),
      this.capValue(sharePriceForFinancing, preMoneyShares)
    );
  }
  shares(sharePriceForFinancing: number, preMoneyShares: number) {
    return Math.max(
      this.discountShares(sharePriceForFinancing, preMoneyShares),
      this.capShares(sharePriceForFinancing, preMoneyShares)
    );
  }
  price(preMoneyShares: number) {
    return Math.min(
      this.discountPrice(preMoneyShares),
      this.capPrice(preMoneyShares)
    );
  }

  private capValue(sharePriceForFinancing: number, preMoneyShares: number) {
    const ratio = sharePriceForFinancing / this.capPrice(preMoneyShares);
    // sharePriceForFinancing / (this.conversionCap / preMoneyShares)
    // In the spreadsheets this number is NOT rounded as you might expect a USD amount to be
    return this.conversionAmount() * ratio;
  }
  private capShares(sharePriceForFinancing: number, preMoneyShares: number) {
    return asShares(this.conversionAmount() / this.capPrice(preMoneyShares));
  }
  private capPrice(preMoneyShares: number) {
    // In the spreadsheets this number is NOT rounded as you might expect a USD amount to be
    return this.conversionCap / preMoneyShares;
  }

  private discountValue(
    sharePriceForFinancing: number,
    preMoneyShares: number
  ) {
    return super.value(sharePriceForFinancing, preMoneyShares);
  }
  private discountShares(
    sharePriceForFinancing: number,
    preMoneyShares: number
  ) {
    return super.shares(sharePriceForFinancing, preMoneyShares);
  }
  private discountPrice(preMoneyShares: number) {
    return super.price(preMoneyShares);
  }
}

export { Note, NoteFields, AbstractNoteFactory };
