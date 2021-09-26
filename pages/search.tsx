import Head from "next/head";
import useHeader from "hooks/useHeader";
import { useEffect, ReactElement, useRef, MutableRefObject } from "react";
import Search from "components/icons/Search";

function InputElement() {
  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div>
      <form role="search">
        <input
          ref={inputRef as MutableRefObject<HTMLInputElement>}
          maxLength={80}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Artists, songs, or podcasts"
          defaultValue=""
        />
      </form>
      <Search fill="#121212" />
      <style jsx>{`
        div {
          max-width: 364px;
          position: relative;
        }
        div :global(svg) {
          position: absolute;
          display: flex;
          align-items: center;
          left: 12px;
          pointer-events: none;
          height: 100%;
          right: 12px;
          top: 0;
          bottom: 0;
          border: 0;
          margin: 0;
          padding: 0;
          vertical-align: baseline;
        }
        form {
          border: 0;
          margin: 0;
          padding: 0;
          vertical-align: baseline;
        }
        input {
          border: 0;
          border-radius: 500px;
          background-color: #fff;
          color: #000;
          height: 40px;
          padding: 6px 48px;
          text-overflow: ellipsis;
          width: 100%;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: normal;
          line-height: 16px;
          text-transform: none;
        }
        input:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

export default function SearchPage(): ReactElement {
  const { setElement } = useHeader({ showOnFixed: true });

  useEffect(() => {
    setElement(() => <InputElement />);

    return () => {
      setElement(null);
    };
  }, [setElement]);

  return (
    <main>
      <Head>
        <title>Rindu - Search</title>
      </Head>
      <style jsx>{`
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
        }
      `}</style>
    </main>
  );
}
