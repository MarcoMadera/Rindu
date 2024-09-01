export function timeStringToSeconds(timeString: string): number {
  const parts = timeString.split(":").map((part) => {
    const number = Number(part);
    if (isNaN(number)) {
      throw new Error("Invalid time format");
    }
    return number;
  });

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  } else {
    throw new Error("Invalid time format");
  }
}
