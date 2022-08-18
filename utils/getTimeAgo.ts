const DATE_UNITS = {
  year: 28_982_400,
  month: 2_415_200,
  week: 604_800,
  day: 86_400,
  hour: 3_600,
  minute: 60,
  second: 1,
};

function getUnitAndValueDate(secondsElapsed: number) {
  let unit = "second";
  let value = secondsElapsed;
  for (const [dateUnit, secondsInUnit] of Object.entries(DATE_UNITS)) {
    if (Math.abs(secondsElapsed) >= secondsInUnit) {
      value = Math.floor(secondsElapsed / secondsInUnit) * -1;
      unit = dateUnit;
      break;
    }
  }
  return { value, unit };
}

function getSecondsDiff(timeStamp: number) {
  return (Date.now() - timeStamp) / 1000;
}

export function getTimeAgo(timeStamp: number, locale: string): string {
  const relativeTimeFormat = new Intl.RelativeTimeFormat(locale);
  const secondsElapse = getSecondsDiff(timeStamp);
  const { value, unit } = getUnitAndValueDate(secondsElapse);
  return relativeTimeFormat.format(value, unit as Intl.RelativeTimeFormatUnit);
}
