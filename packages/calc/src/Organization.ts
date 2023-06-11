import { NoteFields } from "./Note";

type Organization = {
  newShareClass: string;
  preMoneyValuation: number;
  newMoneyRaised: number;
  noteConversion: boolean;
  notesConvertToNewClass: boolean;
  expandOptionPool: boolean;
  postMoneyOptionPoolSize: number;
  notesFields: NoteFields[];
  foundersNumberOfShares: number;
  commonNumberOfShares: number;
  warrantsNumberOfShares: number;
  grantedOptionsNumberOfShares: number;
  oldOptionsNumberOfShares: number;
};

export default Organization;
