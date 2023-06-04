type Note = {
  principalInvested?: number;
  interestStartDate?: Date;
  interestRate?: number;
  interestConverts?: boolean;
  conversionCap: number;
  conversionDiscount: number;
  conversionDate: Date;
  conversionAmount?: number;
};
export default Note;
