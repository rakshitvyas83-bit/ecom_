export function hasAdminLabel(labels: readonly string[] | undefined) {
  return labels?.some((label) => label.trim().toLowerCase() === "admin") ?? false;
}
