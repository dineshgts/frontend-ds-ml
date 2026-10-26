export function formatDatasetDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(date);
}

export function formatDatasetNumber(value: number | null | undefined) {
  return value == null ? "Not available" : value.toLocaleString("en-IN");
}
