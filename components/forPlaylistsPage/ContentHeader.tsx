import React, { ReactElement, ReactNode } from "react";

export function ContentHeader({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <header>
      <div></div>
      <section>{children}</section>
      <style jsx>{`
        section {
          display: flex;
          height: 232px;
          min-width: 232px;
          width: 100%;
          margin-top: 60px;
          position: absolute;
        }
        header {
          display: flex;
          align-items: center;
          padding: 0 32px;
          height: 30vh;
          max-height: 500px;
          min-height: 340px;
          width: 100%;
          background: #535353;
          position: relative;
        }
        div {
          background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
        }
        div {
          display: block;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      `}</style>
    </header>
  );
}
