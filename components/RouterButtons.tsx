import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { __isServer__ } from "utils/constants";
import { AngleBrackect } from "./icons";

export default function RouterButtons(): ReactElement {
  const router = useRouter();
  const [lastIndexHistory, setLastIndexHistory] = useState(0);
  const [biggestLastIdxHistory, setBiggestLastIdxHistory] = useState(0);

  useEffect(() => {
    setLastIndexHistory(window.history.state.idx);
    if (window.history.state.idx > biggestLastIdxHistory) {
      setBiggestLastIdxHistory(window.history.state.idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return (
    <div>
      <button
        onClick={() => {
          router.back();
        }}
        disabled={__isServer__ || history.state.idx === 0}
        className="back"
        aria-label="Go back"
      >
        <AngleBrackect angle="less" />
      </button>
      <button
        onClick={() => {
          if (!__isServer__) {
            window.history.forward();
          }
        }}
        disabled={lastIndexHistory === biggestLastIdxHistory}
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
