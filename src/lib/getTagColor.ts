export function getTagColor(tag: string, category: string): string {
  if (category === "protein") {
    return "border-red-500 text-red-500";
  }
  if (category === "cuisine") {
    return "border-green-500 text-green-500";
  }
  if (category === "method") {
    return "border-orange-500 text-orange-500";
  }
  return "border-yellow-500 text-yellow-500";
}