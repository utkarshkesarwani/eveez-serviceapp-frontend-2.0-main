export const ShortformatDate = (rawdate) => {
  const date = new Date(rawdate);

  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const dateParts = formattedDate.split(" ");
  const day = parseInt(dateParts[1]);
  const finalDate = `${day} ${dateParts[0]} ${dateParts[2]}`;
  return finalDate;
};

export const LongFormatDate = (rawdate) => {
  const date = new Date(rawdate);

  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const dateParts = formattedDate.split(" ");
  const day = parseInt(dateParts[1]);
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  const finalDate = `${day}${getOrdinalSuffix(day)} ${dateParts[0]} ${
    dateParts[2]
  }`;
  return finalDate;
};

export const defaultDateFormat = (rawdate) => {
  // Parse the date in UTC to avoid timezone issues
  const date = new Date(rawdate);

  // Extract the UTC date components (ignoring time and timezone)
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const CalendarFormat = (rawDate) => {
  const year = rawDate.getFullYear();
  const month = String(rawDate.getMonth() + 1).padStart(2, "0");
  const day = String(rawDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
