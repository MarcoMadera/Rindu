import { ReactElement, useEffect, useState } from "react";

import {
  Anchor,
  Button,
  CheckBoxControl,
  Pre,
  SelectControl,
  TextControl,
} from "components";
import { Emphasis } from "components/Anchor";
import { WhiteSpace } from "components/Pre";
import { useToast, useToggle, useTranslations } from "hooks";

export default function EmbedModal({
  type,
  id,
}: Readonly<{
  type: string;
  id: string;
}>): ReactElement {
  const [showCode, setShowCode] = useToggle();
  const { addToast } = useToast();
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("352");
  const [timeStamp, setTimeStamp] = useState("0:00");
  const [theme, setTheme] = useState<string | null>(null);
  const hasTimeStampChanged = timeStamp !== "0:00";
  const [headerColor, setHeaderColor] = useState<string | null>(null);
  const { translations } = useTranslations();

  useEffect(() => {
    const bodyStyle = document.body.getAttribute("style");
    if (bodyStyle) {
      const headerColor = RegExp(/--header-color:(.*?);/).exec(bodyStyle);
      if (headerColor) {
        setHeaderColor(headerColor[1]);
      }
    }
  }, []);

  const code = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/${type}/${id}?utm_source=generator${
    hasTimeStampChanged ? `&t=${timeStamp}` : ""
  }${
    theme ? `&theme=${theme}` : ""
  }" width="${width}" height="${height}" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;

  return (
    <div>
      <div className="header">
        <div className="color-selector">
          <p>Color:</p>
          <button
            type="button"
            style={{
              backgroundColor: `${headerColor ?? "#252566"}`,
              borderColor: theme === "0" ? "unset" : "#fff",
            }}
            onClick={() => setTheme(null)}
          ></button>
          <button
            type="button"
            style={{
              backgroundColor: "#282828",
              borderColor: theme === "0" ? "#fff" : "unset",
            }}
            onClick={() => setTheme("0")}
          ></button>
        </div>
        <div className="size-selector">
          <p>Size:</p>
          <SelectControl
            options={[
              { value: "352", label: "Normal (352px)" },
              { value: "152", label: "Compact (152px)" },
            ]}
            onChange={(e) => setHeight(e.target.value)}
          />
          <span className="divider">×</span>
          <TextControl
            value={width}
            popupText="When set to 100%, the player width will automatically expand to fit
          mobile and desktop layouts."
            onChange={(e) => setWidth(e.target.value)}
            style={{ maxWidth: 140 }}
          />
        </div>
      </div>
      <div className="embedPlayer">
        <iframe
          style={{ borderRadius: 12, border: "none", margin: "auto" }}
          src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator${
            hasTimeStampChanged ? `&t=${timeStamp}` : ""
          }${theme ? `&theme=${theme}` : ""}`}
          width={width}
          height={height}
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify"
        ></iframe>
      </div>
      <small>
        By embedding a Spotify player on your site, you are agreeing to{" "}
        <Anchor
          href="https://developer.spotify.com/terms/"
          target="_blank"
          emphasis={Emphasis.Bold}
        >
          Spotify&apos;s Developer Terms
        </Anchor>{" "}
        and{" "}
        <Anchor
          href="https://www.spotify.com/platform-rules/"
          target="_blank"
          emphasis={Emphasis.Bold}
        >
          Spotify Platform Rules
        </Anchor>
      </small>
      <div className="footer">
        <div
          className={`startAt-container ${
            type === "episode" ? "visible" : "hidden"
          }`}
        >
          <CheckBoxControl id="timestamp" />
          <label htmlFor="timestamp">Start at</label>
          <TextControl
            variant="empty"
            value={timeStamp}
            disabled={false}
            onChange={(e) => setTimeStamp(e.target.value)}
          />
        </div>
        <div className="copy-code-container">
          <CheckBoxControl
            id="show-code"
            onChange={(event) => {
              if (event.target.checked) setShowCode.on();

              if (!event.target.checked) setShowCode.off();
            }}
          />
          <label htmlFor="show-code">Show code</label>
          <Button
            tabIndex={0}
            onClick={() => {
              try {
                navigator.clipboard.writeText(code);
                addToast({
                  message: translations.toastMessages.copiedToClipboard,
                  variant: "success",
                });
              } catch (error) {
                addToast({
                  message: translations.toastMessages.failedToCopyToClipboard,
                  variant: "error",
                });
              }
            }}
          >
            COPY
          </Button>
        </div>
      </div>
      <section className={showCode ? "show-code" : ""}>
        <Pre whiteSpace={WhiteSpace.Normal}>{code}</Pre>
      </section>
      <style jsx>{`
        :global(.modal) {
          width: 664px;
        }
        .header {
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          justify-content: space-between;
        }
        .color-selector {
          align-items: center;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-flow: row;
          flex-flow: row;
          flex-grow: 1;
          visibility: visible;
        }
        .color-selector p {
          -webkit-box-flex: 0;
          -ms-flex-positive: 0;
          flex-grow: 0;
          margin-right: 6px;
        }
        .color-selector button {
          border: 1px solid hsla(0, 0%, 100%, 0.08);
          border-radius: 50%;
          flex-shrink: 1;
          height: 24px;
          margin: 0 6px;
          padding: 0;
          width: 24px;
        }
        .color-selector button:hover,
        .color-selector button:focus {
          border-color: #fff;
        }
        .size-selector {
          align-items: center;
          color: #ffffff;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-flow: row;
          flex-flow: row;
          justify-content: space-between;
          justify-self: flex-end;
        }
        .size-selector p {
          -ms-flex-negative: 1;
          flex-shrink: 1;
          margin-right: 12px;
        }
        .divider {
          -ms-flex-negative: 1;
          color: #7f7f7f;
          flex-shrink: 1;
          margin: 0 8px;
          text-align: center;
        }

        .embedPlayer {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          margin: 24px 0;
          overflow: auto;
          position: relative;
          text-align: center;
          width: 100%;
          height: 352px;
          max-height: calc(100vh - 402px);
        }
        small {
          color: #7f7f7f;
          display: block;
          font-size: 0.8rem;
          margin-bottom: 24px;
        }

        .footer {
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          justify-content: space-between;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          color: #b3b3b3;
          font-size: 14px;
        }
        .startAt-container {
          -webkit-box-pack: start;
          -ms-flex-pack: start;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          justify-content: flex-start;
          visibility: hidden;
        }
        .copy-code-container > :global(:first-child),
        .startAt-container > :global(:first-child) {
          margin-right: 8px;
        }
        .copy-code-container > :global(:last-child) {
          margin-left: 16px;
        }
        .startAt-container > :global(:last-child) {
          margin-left: 4px;
        }
        .copy-code-container {
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
        }
        .startAt-container input[type="text"][disabled] {
          opacity: 0.3;
        }
        .startAt-container input[type="text"] {
          width: auto;
          background: transparent;
          border: none;
          -webkit-box-shadow: none;
          box-shadow: none;
          color: inherit;
          max-width: 200px;
          text-decoration: underline;
          margin-top: 2px;
        }
        .startAt-container input[type="text"]:focus {
          outline: none;
        }
        section {
          border-radius: 0 0 8px 8px;
          margin-top: 24px;
          position: relative;
          transition: height 0.5s ease-in-out;
          z-index: -1;
          height: 0;
          overflow: hidden;
        }
        section.show-code {
          height: 130px;
        }
        .hidden {
          visibility: hidden;
        }
        .visible {
          visibility: visible;
        }
      `}</style>
    </div>
  );
}
