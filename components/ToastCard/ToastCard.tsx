import { ReactElement, useEffect, useState } from "react";

import type { IToast } from "types/toast";
import { capitalizeFirstLetter } from "utils";

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

  const colors = {
    info: "#2e77d0",
    error: "#ff5a5f",
    success: "#2e77d0",
    default: "#ff0",
  };

  const background = colors[variant] || colors.default;

  return (
    <article
      key={id}
      role="alertdialog"
      aria-labelledby="alertText"
      className={dissapearCard ? "notificationDissapear" : ""}
    >
      <p id="alertText">{capitalizeFirstLetter(message)}</p>
      <style jsx>{`
        article {
          background: ${background};
        }
      `}</style>
      <style jsx>{`
        p {
          font-size: 14px;
          align-items: center;
          overflow-wrap: break-word;
          margin: 0;
        }
        article {
          border-radius: 8px;
          width: 100%;
          text-decoration: none;
          transition: 0.3s ease 0s;
          opacity: 1;
          box-shadow: 0 4px 12px 4px rgb(0 0 0 / 50%);
          color: #fff;
          display: inline-block;
          font-size: 1rem;
          line-height: 20px;
          max-width: 450px;
          padding: 12px 36px;
          text-align: center;
          transition: none 0.5s cubic-bezier(0.3, 0, 0.4, 1);
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
      `}</style>
    </article>
  );
}
