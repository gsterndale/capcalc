import { NoteFields } from "./Note";

interface Organization {
  name: string;
  description: string;
  newShareClass: string;
  preMoneyValuation: number;
  newMoneyRaised: number;
  noteConversion: boolean;
  expandOptionPool: boolean;
  postMoneyOptionPoolSize: number;
  notesFields: NoteFields[];
  foundersNumberOfShares: number;
  commonNumberOfShares: number;
  warrantsNumberOfShares: number;
  grantedOptionsNumberOfShares: number;
  oldOptionsNumberOfShares: number;
}

export default Organization;
