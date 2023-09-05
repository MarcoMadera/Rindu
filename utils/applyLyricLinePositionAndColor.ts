import { LineType } from "types/lyrics";
import {
  findIndexOrLast,
  LINE_HEIGHT,
  LYRICS_PADDING_LEFT,
  LYRICS_PIP_HEADER_HEIGH,
} from "utils";

export function applyLyricLinePositionAndColor(
  ctx: CanvasRenderingContext2D,
  allLines: {
    color: string;
    text: string;
    type: LineType;
  }[],
  containerHeight: number
): void {
  const containerMiddle = containerHeight / 2;
  const currentLineIndex = findIndexOrLast(allLines, (line) => {
    const validTypes = ["current", "first"];
    return validTypes.includes(line.type);
  });

  allLines.forEach((line, index) => {
    const isOneOfFirstLines =
      currentLineIndex * LINE_HEIGHT < containerMiddle - LINE_HEIGHT;
    const isOfLastLines =
      currentLineIndex * LINE_HEIGHT >
      allLines.length * LINE_HEIGHT - LINE_HEIGHT - containerMiddle;
    const canvasRest = containerMiddle % LINE_HEIGHT;
    const bottomLineTrace = isOfLastLines
      ? containerHeight +
        LINE_HEIGHT +
        (LINE_HEIGHT - canvasRest) -
        LINE_HEIGHT * (allLines.length - currentLineIndex)
      : containerMiddle;
    const middleHeight = isOneOfFirstLines
      ? LINE_HEIGHT + currentLineIndex * LINE_HEIGHT
      : bottomLineTrace;

    const lineY =
      LYRICS_PIP_HEADER_HEIGH +
      middleHeight +
      LINE_HEIGHT * (index - currentLineIndex);
    ctx.fillStyle = line.color ?? "#fff";
    const limit = LINE_HEIGHT + LYRICS_PIP_HEADER_HEIGH;
    const isOutsideCanvas = lineY < limit || lineY > containerHeight + limit;
    if (isOutsideCanvas) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillText(line.text, LYRICS_PADDING_LEFT, lineY);
  });
}
