export default (
  value: string,
  type: string,
  checked: boolean | undefined
): number | string | Date | boolean | undefined => {
  switch (type) {
    case "checkbox":
      return !!checked;
    case "number":
      return value === "" ? undefined : parseFloat(value);
    case "date":
      if (value === "") {
        return undefined;
      } else {
        const date = new Date(value);
        date.setHours(24);
        return date;
      }
    default:
      return value;
  }
};
