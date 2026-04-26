export const formatCOP = (value: number | string) => {
  const number = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (value: string | Date) => {
  let date: Date;

  if (typeof value === "string") {
    date = new Date(value.includes("T") ? value : value + "T00:00:00");
  } else {
    date = value;
  }

  if (isNaN(date.getTime())) return "";

  const day = date.getDate().toString().padStart(2, "0");

  let month = new Intl.DateTimeFormat("es-CO", {
    month: "short",
  }).format(date);

  month = month.replace(".", "");
  month = month.charAt(0).toUpperCase() + month.slice(1);

  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
