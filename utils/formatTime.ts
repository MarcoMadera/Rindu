export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);
  const dh = h > 0 ? `${h}:` : "";
  const dm = h > 0 && m < 10 ? `0${m}:` : `${m}:`;
  const ds = s < 10 ? `0${s}` : s;

  return `${dh}${dm}${ds}`;
}
