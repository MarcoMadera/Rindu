/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { verifyHMACSHA256Token } from "utils";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL("../../fonts/SourceSansPro-Black.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function topTracksCover(
  req: NextRequest
): Promise<ImageResponse | void> {
  try {
    const fontData = await font;
    const { searchParams } = new URL(req.url);
    const { token, ...params } = Object.fromEntries(searchParams);
    const { width, height, title, color, imageUrl } = params;

    const isValidToken = await verifyHMACSHA256Token(token, params);

    if (!isValidToken) {
      return new Response("Invalid request.", { status: 401 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: "630px",
            height: "630px",
            background: "#1b1f33",
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
              color: "white",
              fontSize: "32px",
              top: 10,
              left: 10,
            }}
          >
            Rindu
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 180,
            }}
          >
            <div
              style={{
                color: "white",
                display: "flex",
                fontSize: 90,
                fontWeight: 900,
                overflow: "hidden",
                width: 600,
                position: "relative",
                margin: "0 auto",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  width: "-100%",
                  letterSpacing: "1.2px",
                }}
              >
                Top Tracks
              </span>
            </div>
            <div
              style={{
                color: "white",
                display: "flex",
                fontSize: 50,
                fontWeight: 900,
                width: 600,
                position: "relative",
              }}
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  width: 60,
                  height: 60,
                  letterSpacing: "1.2px",
                  background: color,
                  marginLeft: 560,
                  marginTop: -300,
                }}
              ></span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              position: "absolute",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 300,
              bottom: 0,
              left: 30,
            }}
          >
            <div
              style={{
                color: "white",
                display: "flex",
                fontSize: 50,
                fontWeight: 900,
                width: 600,
                position: "relative",
              }}
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  width: "-100%",
                  letterSpacing: "1.2px",
                }}
              >
                {title}
              </span>
            </div>
            <div
              style={{
                color: "white",
                display: "flex",
                fontSize: 50,
                fontWeight: 900,
                width: 600,
                position: "relative",
              }}
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  width: "108%",
                  letterSpacing: "1.2px",
                  height: 40,
                  background: color,
                  marginLeft: -160,
                  marginTop: 40,
                }}
              ></span>
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
              marginTop: 220,
              marginLeft: 460,
              marginRight: 10,
              alignItems: "center",
            }}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                width={140}
                height={140}
                style={{
                  border: "4px solid white",
                  borderRadius: "10px",
                  zIndex: 1,
                }}
              />
            )}
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
