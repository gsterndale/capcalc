import { asUSD, asShares, roundTo, simpleInterest } from "@capcalc/utils";

interface NoteFields {
  principalInvested: number;
  conversionDiscount: number;
  conversionDate?: Date;
  interestRate?: number;
  interestStartDate?: Date;
  conversionCap?: number;
  name?: string;
}

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
    return attrs.conversionCap === undefined
      ? new ConvertibleNote(attrs)
      : new CappedNote(attrs);
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
    const {
      principalInvested,
      conversionDiscount,
      conversionDate,
      interestRate,
      interestStartDate,
      name,
    } = attrs;

    this.principalInvested = principalInvested;
    this.conversionDiscount = conversionDiscount;
    this.conversionDate =
      conversionDate !== undefined ? conversionDate : new Date();
    this.interestRate = interestRate !== undefined ? interestRate : 0;
    this.interestStartDate =
      interestStartDate !== undefined ? interestStartDate : new Date();
    this.name = name !== undefined ? name : "";
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
    const discountValue = this.discountValue(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
    const capValue = this.capValue(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
    return Math.max(discountValue, capValue);
  }

  shares(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    const discountShares = this.discountShares(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
    const capShares = this.capShares(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
    return Math.max(discountShares, capShares);
  }

  price(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    const discountPrice = this.discountPrice(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
    const capPrice = this.capPrice(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
    return Math.min(discountPrice, capPrice);
  }

  private capValue(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    const capPrice = this.capPrice(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
    const ratio = sharePriceForFinancing / capPrice;
    return this.conversionAmount() * ratio;
  }

  private capShares(
    sharePriceForFinancing: number,
    preMoneyShares: number,
    newOptionsShareClassShares: number
  ) {
    const capPrice = this.capPrice(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
    return asShares(this.conversionAmount() / capPrice);
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
    const discountPrice = this.discountPrice(
      sharePriceForFinancing,
      preMoneyShares,
      newOptionsShareClassShares
    );
    return asShares(this.conversionAmount() / discountPrice);
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
