/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { getRandomColor, hexToHsl, verifyHMACSHA256Token } from "utils";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL("../../fonts/SourceSansPro-Black.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const colors: Record<string, string> = {};

export default async function radioCover(
  req: NextRequest
): Promise<ImageResponse | void> {
  try {
    const fontData = await font;
    const { searchParams } = new URL(req.url);
    const { token, ...params } = Object.fromEntries(searchParams);
    const { cover1, cover2, cover3, width, height, name } = params;

    const isValidToken = await verifyHMACSHA256Token(token, params);

    if (!isValidToken) {
      return new Response("Invalid request.", { status: 401 });
    }

    if (!colors[name]) {
      colors[name] = getRandomColor();
    }

    const color = colors[name];
    const [h, s, l] = hexToHsl(color, true) ?? [0, 0, 0];
    const textColor = l > 60 ? "#404040" : "white";
    const firstColor = `hsl(${h}, ${s}%, ${l + 30}%)`;
    const secondaryColor = `hsl(${h}, ${s}%, ${l + 20}%)`;
    const tertiaryColor = `hsl(${h}, ${s}%, ${l + 15}%)`;
    const isTextTooLong = name.length >= 20;
    const textOverflow = isTextTooLong ? "ellipsis" : "unset";

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: "630px",
            height: "630px",
            background: firstColor,
            justifyItems: "center",
            letterSpacing: "-.02em",
            fontWeight: 700,
            // eslint-disable-next-line quotes
            fontFamily: '"SourceSansPro"',
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              letterSpacing: "-.02em",
              fontWeight: 400,
              fontFamily: "unset",
              color: textColor,
              fontSize: "32px",
              top: 10,
              left: 10,
            }}
          >
            Rindu
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -80,
              width: "790px",
              height: "790px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              background: secondaryColor,
              zIndex: -1,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: 145,
              left: 68,
              width: "500px",
              height: "500px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              background: tertiaryColor,
              zIndex: -1,
            }}
          ></div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 80,
            }}
          >
            <div
              style={{
                color: textColor,
                display: "flex",
                fontSize: 60,
                fontWeight: 900,
                overflow: "hidden",
                width: 600,
                position: "relative",
                margin: "-430px auto 0",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  textOverflow: textOverflow,
                  whiteSpace: "nowrap",
                  display: "flex",
                  width: "-100%",
                  letterSpacing: "1.2px",
                }}
              >
                {name || ""}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                fontWeight: 600,
                color: textColor,
                letterSpacing: ".1em",
              }}
            >
              RADIO
            </div>
          </div>
          <div
            style={{
              display: "flex",
              position: "absolute",
              width: "100%",
              height: "100%",
              justifyItems: "center",
              alignContent: "center",
              marginTop: 85,
              marginLeft: 10,
              marginRight: 10,
              alignItems: "center",
            }}
          >
            <img
              src={cover2}
              width={210}
              height={210}
              style={{
                border: "6px solid white",
                borderRadius: "50%",
                zIndex: 1,
              }}
            />
            <img
              src={cover3}
              width={210}
              height={210}
              style={{
                border: "6px solid white",
                borderRadius: "50%",
                zIndex: 1,
                marginLeft: 190,
              }}
            />
            <img
              src={cover1}
              width={290}
              height={290}
              style={{
                border: "8px solid white",
                borderRadius: "50%",
                zIndex: 2,
                marginLeft: -450,
              }}
            />
          </div>
        </div>
      ),
      {
        width: Number(width) || 630,
        height: Number(width) || Number(height) || 630,
        fonts: [
          {
            name: "SourceSansPro",
            data: fontData,
            style: "normal",
          },
        ],
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
