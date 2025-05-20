import { rgbToHex } from "./rgbToHex";
import { rgbToOklch } from "./rgbToOklch";

export const colors = [
  "#27856a",
  "#1e3264",
  "#8d67ab",
  "#e8115b",
  "#8d67ab",
  "#1e3264",
  "#b49bc8",
  "#f037a5",
  "#e13300",
  "#477d95",
  "#8c1932",
  "#1e3264",
  "#477d95",
  "#777777",
  "#ba5d07",
  "#503750",
  "#477d95",
  "#9cf0e1",
  "#af2896",
  "#8d67ab",
  "#dc148c",
  "#e61e32",
  "#608108",
  "#1e3264",
  "#148a08",
  "#af2896",
  "#eb1e32",
  "#dc148c",
  "#477d95",
  "#e8115b",
  "#477d95",
  "#8d67ab",
  "#af2896",
  "#477d95",
  "#8d67ab",
  "#509bf5",
  "#ba5d07",
  "#777777",
  "#1e3264",
  "#148a08",
  "#af2896",
  "#0d73ec",
  "#148a08",
  "#4b917d",
  "#8c1932",
  "#f59b23",
  "#eb1e32",
  "#1e3264",
  "#8d67ab",
  "#dc148c",
  "#e61e32",
  "#1e3264",
  "#ff6437",
  "#ffc864",
  "#509bf5",
  "#2d46b9",
  "#1e3264",
  "#0d73ec",
  "#af2896",
  "#0d73ec",
  "#e13300",
  "#1e3264",
  "#509bf5",
  "#b49bc8",
  "#8c1932",
];

export function getRandomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

export const anchorOklch = [
  {
    hex: "#8f6e76",
    oklch: {
      l: 0.4985834418410455,
      c: 0.14394351135809472,
      h: 2.435104775404167,
    },
  },
  {
    hex: "#bb566c",
    oklch: {
      l: 0.4986503090434564,
      c: 0.4348398166061782,
      h: 9.691250840443736,
    },
  },
  {
    hex: "#c35062",
    oklch: {
      l: 0.49767343595498104,
      c: 0.49390029866887114,
      h: 15.709597929729279,
    },
  },
  {
    hex: "#bc8f8f",
    oklch: {
      l: 0.6927437241427709,
      c: 0.054795623862900975,
      h: 18.565295767570316,
    },
  },
  {
    hex: "#a56565",
    oklch: {
      l: 0.4979562308847503,
      c: 0.28030938247490966,
      h: 23.0326466907977,
    },
  },
  {
    hex: "#cfa297",
    oklch: {
      l: 0.65,
      c: 0.12,
      h: 25,
    },
  },
  {
    hex: "#b85a5a",
    oklch: {
      l: 0.49790258225990813,
      c: 0.4194901758327074,
      h: 25.27797338903575,
    },
  },
  {
    hex: "#d63f47",
    oklch: {
      l: 0.49870678517220013,
      c: 0.6624313248330204,
      h: 27.14450518245891,
    },
  },
  {
    hex: "#c84e4e",
    oklch: {
      l: 0.4983619562330531,
      c: 0.5490826004796999,
      h: 27.72349263370096,
    },
  },
  {
    hex: "#b6392e",
    oklch: {
      l: 0.5256,
      c: 0.1647,
      h: 28.8,
    },
  },
  {
    hex: "#e12e3a",
    oklch: {
      l: 0.4982470541391666,
      c: 0.7711201274252439,
      h: 29.71978863448284,
    },
  },
  {
    hex: "#d54141",
    oklch: {
      l: 0.4987337972916018,
      c: 0.6671126009744309,
      h: 30.326704221753918,
    },
  },
  {
    hex: "#c94e41",
    oklch: {
      l: 0.49799981593713993,
      c: 0.5843086533367371,
      h: 34.501717963597194,
    },
  },
  {
    hex: "#85C64A",
    oklch: {
      l: 0.882446,
      c: 0.663631,
      h: 34.769512,
    },
  },
  {
    hex: "#b45e50",
    oklch: {
      l: 0.498465549537992,
      c: 0.41007251924244137,
      h: 35.43885850745217,
    },
  },
  {
    hex: "#e91c1c",
    oklch: {
      l: 0.49790535812370634,
      c: 0.9030023427738435,
      h: 36.946905635176755,
    },
  },
  {
    hex: "#ec1017",
    oklch: {
      l: 0.4982362097699921,
      c: 0.9355415137500125,
      h: 37.27604138533164,
    },
  },
  {
    hex: "#e22f1a",
    oklch: {
      l: 0.498360661324346,
      c: 0.8570994832689905,
      h: 39.52029626705976,
    },
  },
  {
    hex: "#df351e",
    oklch: {
      l: 0.4989764938389348,
      c: 0.8255245289881892,
      h: 39.62287809981182,
    },
  },
  {
    hex: "#cb0e04",
    oklch: {
      l: 0.42798905707092816,
      c: 0.8625411427641884,
      h: 39.96754034849748,
    },
  },
  {
    hex: "#CBAE87",
    oklch: {
      l: 0.885992,
      c: 0.897741,
      h: 41.931367,
    },
  },
  {
    hex: "#6BC783",
    oklch: {
      l: 0.881274,
      c: 0.802661,
      h: 47.250511,
    },
  },
  {
    hex: "#A26844",
    oklch: {
      l: 0.5719,
      c: 0.0902,
      h: 51.89,
    },
  },
  {
    hex: "#816A56",
    oklch: {
      l: 0.5453,
      c: 0.0337,
      h: 61.59,
    },
  },
  {
    hex: "#cd853f",
    oklch: {
      l: 0.6781925733062264,
      c: 0.12274871125790536,
      h: 62.181583611829986,
    },
  },
  {
    hex: "#8a7260",
    oklch: {
      l: 0.4983779478260753,
      c: 0.15014785983962545,
      h: 64.10765765097635,
    },
  },
  {
    hex: "#a76821",
    oklch: {
      l: 0.4977153741180665,
      c: 0.5164294122203602,
      h: 67.75176557265878,
    },
  },
  {
    hex: "#A68B6B",
    oklch: {
      l: 0.6,
      c: 0.2,
      h: 78.4,
    },
  },
  {
    hex: "#da9e00",
    oklch: {
      l: 0.7371900955944705,
      c: 0.1521705578976286,
      h: 81.25882897067898,
    },
  },
  {
    hex: "#d2a300",
    oklch: {
      l: 0.7382721900044404,
      c: 0.15092109362815018,
      h: 87.79576729529022,
    },
  },
  {
    hex: "#837555",
    oklch: {
      l: 0.4974300367440358,
      c: 0.19666121945038878,
      h: 89.06779907080218,
    },
  },
  {
    hex: "#797911",
    oklch: {
      l: 0.4922894618876802,
      c: 0.5226420543063509,
      h: 103.29283808301093,
    },
  },
  {
    hex: "#5e8130",
    oklch: {
      l: 0.4984992200029318,
      c: 0.46973067277170133,
      h: 123.93391390396084,
    },
  },
  {
    hex: "#707a64",
    oklch: {
      l: 0.49838585644601563,
      c: 0.13478819571665654,
      h: 126.6536583962463,
    },
  },
  {
    hex: "#6AAE3F",
    oklch: {
      l: 0.7,
      c: 0.5,
      h: 127.1,
    },
  },
  {
    hex: "#697c60",
    oklch: {
      l: 0.4981339224051126,
      c: 0.18135337891923028,
      h: 134.0691088933477,
    },
  },
  {
    hex: "#727872",
    oklch: {
      l: 0.4976807412819575,
      c: 0.04290111829665197,
      h: 144.17346989608112,
    },
  },
  {
    hex: "#5FAE7F",
    oklch: {
      l: 0.7,
      c: 0.4,
      h: 148.4,
    },
  },
  {
    hex: "#4a825f",
    oklch: {
      l: 0.4979370534545406,
      c: 0.2994479478294838,
      h: 153.6381385882019,
    },
  },
  {
    hex: "#757575",
    oklch: {
      l: 0.49238989620828066,
      c: 1.0095479534534456e-7,
      h: 158.19859051364818,
    },
  },
  {
    hex: "#767676",
    oklch: {
      l: 0.49637016560651304,
      c: 1.0157072690942638e-7,
      h: 158.19859051364818,
    },
  },
  {
    hex: "#767676",
    oklch: {
      l: 0.49637016560651304,
      c: 1.0157072690942638e-7,
      h: 158.19859051364818,
    },
  },
  {
    hex: "#468080",
    oklch: {
      l: 0.49855358965549085,
      c: 0.19829630757986447,
      h: 197.3690195052163,
    },
  },
  {
    hex: "#707878",
    oklch: {
      l: 0.49778181120824044,
      c: 0.0316290483022557,
      h: 199.0593923293304,
    },
  },
  {
    hex: "#747777",
    oklch: {
      l: 0.49784107852002407,
      c: 0.011986675044185246,
      h: 199.27555173188333,
    },
  },
  {
    hex: "#547d83",
    oklch: {
      l: 0.4972555950250627,
      c: 0.14809988169968225,
      h: 211.78892953930773,
    },
  },
  {
    hex: "#4e7d8d",
    oklch: {
      l: 0.49748541669110935,
      c: 0.17880904811768894,
      h: 229.89917575697584,
    },
  },
  {
    hex: "#627a86",
    oklch: {
      l: 0.4978150726858124,
      c: 0.11019411357184557,
      h: 238.49544868699394,
    },
  },
  {
    hex: "#557b94",
    oklch: {
      l: 0.4977907091019347,
      c: 0.18846548116206144,
      h: 249.94394209837375,
    },
  },
  {
    hex: "#157eb2",
    oklch: {
      l: 0.4985009604895808,
      c: 0.3633593311400803,
      h: 255.82421109894403,
    },
  },
  {
    hex: "#447ba8",
    oklch: {
      l: 0.4976247759919738,
      c: 0.2979762315231328,
      h: 261.5971320034081,
    },
  },
  {
    hex: "#5a7896",
    oklch: {
      l: 0.49262026271691867,
      c: 0.19832075324318052,
      h: 262.06308322693656,
    },
  },
  {
    hex: "#727780",
    oklch: {
      l: 0.498931938032037,
      c: 0.05567104346653424,
      h: 270.56891376833704,
    },
  },
  {
    hex: "#697792",
    oklch: {
      l: 0.49823959439442933,
      c: 0.16397198258738982,
      h: 274.60234679808343,
    },
  },
  {
    hex: "#63779e",
    oklch: {
      l: 0.4987487663356997,
      c: 0.2349603929305674,
      h: 276.6483149981526,
    },
  },
  {
    hex: "#3A5FD9",
    oklch: {
      l: 0,
      c: 0.17,
      h: 280,
    },
  },
  {
    hex: "#4f46e5",
    oklch: {
      l: 0.5,
      c: 0.23,
      h: 290,
    },
  },
  {
    hex: "#3b6ee5",
    oklch: {
      l: 0.4917484657298881,
      c: 0.6955521841558661,
      h: 290.0160627115473,
    },
  },
  {
    hex: "#4338ca",
    oklch: {
      l: 0.45,
      c: 0.2,
      h: 292,
    },
  },
  {
    hex: "#6366f1",
    oklch: {
      l: 0.55,
      c: 0.25,
      h: 295,
    },
  },
  {
    hex: "#8b00ff",
    oklch: {
      l: 0.42,
      c: 0.25,
      h: 305,
    },
  },
  {
    hex: "#9d00ff",
    oklch: {
      l: 0.46,
      c: 0.29,
      h: 306,
    },
  },
  {
    hex: "#76228C",
    oklch: {
      l: 0.4326,
      c: 0.1741,
      h: 318.29,
    },
  },
  {
    hex: "#8d6c8d",
    oklch: {
      l: 0.49871753400203145,
      c: 0.23101269352204162,
      h: 325.68150439803486,
    },
  },
  {
    hex: "#d32f9d",
    oklch: {
      l: 0.49881961686066817,
      c: 0.740737856695295,
      h: 343.0341060021902,
    },
  },
  {
    hex: "#847179",
    oklch: {
      l: 0.49613159241108873,
      c: 0.09032756705045335,
      h: 349.4112156297942,
    },
  },
  {
    hex: "#d13a86",
    oklch: {
      l: 0.49865770709848123,
      c: 0.6482278557969514,
      h: 352.9948874602621,
    },
  },
  {
    hex: "#d23c79",
    oklch: {
      l: 0.49879360744150647,
      c: 0.6259159195114771,
      h: 359.9833570765902,
    },
  },
];

function getDistance(
  a: { l: number; c: number; h: number },
  b: { l: number; c: number; h: number }
) {
  const dh = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h));
  const dl = a.l - b.l;
  const dc = a.c - b.c;

  const HUE_WEIGHT = 3.0;
  const C_WEIGHT = 1.0;
  const L_WEIGHT = 0.5;

  return Math.sqrt(
    L_WEIGHT * dl * dl + C_WEIGHT * dc * dc + HUE_WEIGHT * Math.pow(dh / 360, 2)
  );
}

function getLuminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  const int = parseInt(hex, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export function getTextContrast(bgHex: string, textHex: string): number {
  const bgLum = getLuminance(bgHex);
  const textLum = getLuminance(textHex);
  const brightest = Math.max(bgLum, textLum);
  const darkest = Math.min(bgLum, textLum);
  return (brightest + 0.05) / (darkest + 0.05);
}

function isContrastAcceptable(bgHex: string): boolean {
  // accesible 2.0
  const rules = [
    { color: "#FFFFFF", min: 2.0 },
    { color: "#000000", min: 2.3 },
  ];

  let allPass = true;

  for (const { color, min } of rules) {
    const contrast = getTextContrast(bgHex, color);
    if (contrast < min) {
      allPass = false;
    }
  }

  return allPass;
}

function hueDifference(h1: number, h2: number) {
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
}

const hueBias = (inputHue: number, anchorHue: number) => {
  const diff = hueDifference(inputHue, anchorHue);
  return 1 - Math.min(diff / 180, 1);
};
export function getSafeColorFromImage(r: number, g: number, b: number): string {
  const input = rgbToOklch(r, g, b);

  const warmAnchors = anchorOklch.filter(
    (a) => a.oklch.h >= 20 && a.oklch.h <= 90
  );
  const coolAnchors = anchorOklch.filter(
    (a) => a.oklch.h < 20 || a.oklch.h > 90
  );

  const hueIsGreenish = input.h >= 100 && input.h <= 160;
  const filteredCoolAnchors = hueIsGreenish
    ? coolAnchors
    : coolAnchors.filter((a) => a.oklch.h < 100 || a.oklch.h > 160);

  const sortedAnchors = [...warmAnchors, ...filteredCoolAnchors];

  let bestMatch = sortedAnchors[0];
  let bestDistance = Infinity;

  for (const anchor of sortedAnchors) {
    const dist = getDistance(input, anchor.oklch);

    const bias = hueBias(input.h, anchor.oklch.h);
    const weightedDist = dist - 0.05 * bias;

    if (weightedDist < bestDistance) {
      bestDistance = weightedDist;
      bestMatch = anchor;
    }
  }

  const rawHex = rgbToHex({ r, g, b });
  const rawOk = isContrastAcceptable(rawHex);
  const anchorOk = isContrastAcceptable(bestMatch.hex);

  if (bestDistance < 0.04 && anchorOk) {
    return bestMatch.hex;
  }

  if (rawOk && !anchorOk) {
    return rawHex;
  }

  if (!rawOk && anchorOk) {
    return bestMatch.hex;
  }

  if (rawOk && anchorOk) {
    return rawHex;
  }

  return "#787878";
}
