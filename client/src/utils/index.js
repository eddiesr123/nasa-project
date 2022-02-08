export const getFormattedDate = (date) => {
  let utcDate = new Date(date).toLocaleDateString("en-US", { timeZone: "utc" });
  return new Date(utcDate).toDateString();
};
