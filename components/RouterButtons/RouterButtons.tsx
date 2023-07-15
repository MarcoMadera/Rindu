import { ReactElement, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";

import { AngleBrackect } from "components/icons";

interface HistoryState {
  key: string;
}

export default function RouterButtons(): ReactElement {
  const router = useRouter();
  const [disableForwardButton, setDisableForwardButton] = useState(true);
  const [disableBackButton, setDisableBackButton] = useState(true);
  const userPosition = useRef(0);

  useEffect(() => {
    sessionStorage.setItem("history", JSON.stringify([]));
    userPosition.current = 0;
  }, []);

  useEffect(() => {
    const historyValue = (history.state as HistoryState).key;
    const historyFromSessionStorage = sessionStorage.getItem("history");
    const prevValue = historyFromSessionStorage
      ? (JSON.parse(historyFromSessionStorage) as string[])
      : [];

    if (
      userPosition.current !== 0 &&
      prevValue.at(userPosition.current - 1) &&
      historyValue === prevValue.at(userPosition.current - 1)
    ) {
      userPosition.current--;
      setDisableForwardButton(false);
      setDisableBackButton(userPosition.current === 0);
      return;
    }
    const newValue = [...prevValue, historyValue];

    if (newValue.length > 1) {
      setDisableBackButton(false);
    }
    setDisableForwardButton(prevValue[userPosition.current + 2] === undefined);

    if (
      prevValue.length > 1 &&
      prevValue[userPosition.current + 1] === historyValue
    ) {
      userPosition.current++;
      return;
    }

    sessionStorage.setItem("history", JSON.stringify(newValue));

    if (newValue.length === 1) return;
    userPosition.current++;

    if (
      newValue.length - 1 > userPosition.current &&
      historyValue !== newValue.at(userPosition.current)
    ) {
      setDisableForwardButton(true);
      const slicedPrevValue = prevValue.slice(0, userPosition.current);
      sessionStorage.setItem(
        "history",
        JSON.stringify([...slicedPrevValue, historyValue])
      );
    }
  }, [router.asPath]);

  return (
    <div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          window.history.back();
        }}
        disabled={disableBackButton}
        className="back"
        aria-label="Go back"
      >
        <AngleBrackect angle="less" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          window.history.forward();
        }}
        disabled={disableForwardButton}
        className="forward"
        aria-label="Go forward"
      >
        <AngleBrackect angle="greater" />
      </button>
      <style jsx>{`
        div {
          display: flex;
        }
        button {
          display: flex;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.7);
          border: none;
          border-radius: 50%;
          color: #fff;
          height: 32px;
          justify-content: center;
          position: relative;
          width: 32px;
          margin-right: 16px;
          cursor: pointer;
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
