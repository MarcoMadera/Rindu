import React, { useState, useEffect, ReactElement } from "react";
import type { IToast } from "types/toast";

export default function ToastCard({
  id,
  variant,
  message,
  displayTime,
}: Omit<IToast, "timeOut">): ReactElement {
  const [dissapearCard, setDissapearCard] = useState(false);

  useEffect(() => {
    const timeOutTime = setTimeout(() => {
      setDissapearCard(true);
    }, displayTime - 2000);
    return () => clearTimeout(timeOutTime);
  }, [displayTime]);

  return (
    <article
      key={id}
      role="alertdialog"
      aria-labelledby="alertText"
      className={dissapearCard ? "notificationDissapear" : ""}
    >
      <div>
        <p id="alertText">{message}</p>
      </div>
      <style jsx>{`
        article {
          background: ${variant === "info"
            ? "#09c"
            : variant === "error"
            ? "#ff5a5f"
            : variant === "success"
            ? "#1db954"
            : "#ff0"};
        }
      `}</style>
      <style jsx>{`
        p {
          font-size: 14px;
          align-items: center;
          grid-gap: 10px;
          overflow-wrap: break-word;
          margin: 0 10px;
        }
        div {
          padding: 10px 10px 8px 10px;
        }
        article {
          border-radius: 4px;
          width: 100%;
          text-decoration: none;
          transition: 0.3s ease 0s;
          opacity: 1;
        }
        article.notificationDissapear {
          animation: fadeout 2s ease-in-out;
          animation-fill-mode: forwards;
        }
        @keyframes fadeout {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        div > :global(svg) {
          align-self: center;
        }
        @media screen and (min-width: 500px) {
          div {
            max-width: 400px;
          }
        }
      `}</style>
    </article>
  );
}
