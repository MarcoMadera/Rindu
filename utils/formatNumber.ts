/**
 * Format a number with commas
 * @param {number} n 928392382
 * @returns {string} string 928,392,382
 */
export default function formatNumber(n: number): string {
  return n?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
