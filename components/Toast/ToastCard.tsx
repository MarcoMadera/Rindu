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
    }, displayTime - 1000);
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
      <span></span>
      <style jsx>{`
        article {
          background: ${variant === "info"
            ? "#09c"
            : variant === "error"
            ? "#f00"
            : variant === "success"
            ? "#0f0"
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
        span {
          display: block;
          width: 100%;
          height: 2px;
          border-radius: 4px;
          animation: shrink ${displayTime + 50}ms linear;
        }
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        div {
          padding: 10px 10px 8px 10px;
        }
        article {
          border-radius: 4px;
          width: 100%;
          text-decoration: none;
          margin-bottom: 10px;
          transition: 0.3s ease 0s;
          animation: slide-bottom 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
            both;
        }
        @keyframes slide-bottom {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }
        article.notificationDissapear {
          animation: fadeout 1s;
          animation-fill-mode: forwards;
        }
        @keyframes disapear {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        div > :global(svg) {
          align-self: center;
        }
        button {
          border: none;
          font-family: monospace;
          user-select: none;
          font-size: 18px;
          line-height: 10px;
          width: 16px;
          height: 16px;
          background: none;
          float: right;
          cursor: pointer;
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
