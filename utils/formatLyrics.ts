export default function formaLyrics(lyrics: string): string[] {
  return lyrics.split("\n").map((line) => {
    return line.trim();
  });
}
