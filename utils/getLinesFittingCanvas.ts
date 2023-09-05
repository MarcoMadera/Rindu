import { IFormatLyricsResponse } from "./formatLyrics";
import { IAllLines, LineType } from "types/lyrics";

export function getLinesFittingCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

interface IGetLineInfo {
  currentLine: IFormatLyricsResponse["lines"][0];
  nextLine: IFormatLyricsResponse["lines"][0];
  lyricLineColor: string;
  lyricTextColor: string;
  lyricsProgressMs: number;
  index: number;
}
interface IGetLineType {
  currentLine: IFormatLyricsResponse["lines"][0];
  nextLine: IFormatLyricsResponse["lines"][0];
  lyricsProgressMs: number;
  index: number;
}

export function getLineType({
  currentLine,
  lyricsProgressMs,
  nextLine,
  index,
}: IGetLineType): LineType {
  const isPreviousLine =
    currentLine.startTimeMs &&
    Number(currentLine.startTimeMs) <= lyricsProgressMs;
  const isNextLine =
    nextLine?.startTimeMs && Number(nextLine?.startTimeMs) >= lyricsProgressMs;
  const isCurrentLine = isPreviousLine && isNextLine;
  const isFirstLine = index === 0;

  const lineTypes: Record<LineType, boolean> = {
    current: !!isCurrentLine,
    previous: !!isPreviousLine,
    first: isFirstLine,
    next: !!isNextLine,
  };

  const type = Object.keys(lineTypes).find(
    (key) => lineTypes[key as keyof typeof lineTypes]
  ) as keyof typeof lineTypes;

  return type;
}

export function getLineInfo({
  currentLine,
  lyricLineColor,
  lyricTextColor,
  lyricsProgressMs,
  nextLine,
  index,
}: IGetLineInfo): {
  color: string;
  text: string;
  type: LineType;
} {
  const type = getLineType({
    currentLine,
    lyricsProgressMs,
    nextLine,
    index,
  });

  const lineColors: Record<LineType, string> = {
    current: "#fff",
    previous: lyricLineColor + "80",
    next: lyricTextColor,
    first: lyricTextColor,
  };

  return {
    color: lineColors[type],
    text: currentLine.words,
    type,
  };
}

interface IgetAllLinesFittingWidth {
  lines: IFormatLyricsResponse["lines"];
  ctx: CanvasRenderingContext2D;
  lyricLineColor: string;
  lyricTextColor: string;
  lyricsProgressMs: number;
  canvasWidth?: number;
}

export function getAllLinesFittingWidth({
  ctx,
  lines,
  lyricLineColor,
  lyricTextColor,
  lyricsProgressMs,
  canvasWidth,
}: IgetAllLinesFittingWidth): IAllLines[] {
  const allLines: IAllLines[] = [];

  lines.forEach((line, i) => {
    const lineInfo = getLineInfo({
      currentLine: line,
      lyricLineColor,
      lyricsProgressMs,
      lyricTextColor,
      nextLine: lines[i + 1],
      index: i,
    });

    const linesText = getLinesFittingCanvas(
      ctx,
      line.words ?? "",
      (canvasWidth ?? 10) - 20
    );
    linesText.forEach((lineText) => {
      allLines.push({
        color: lineInfo.color,
        text: lineText,
        type: lineInfo.type,
      });
    });
  });

  return allLines;
}
