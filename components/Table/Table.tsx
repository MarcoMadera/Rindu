import { PropsWithChildren, ReactElement } from "react";

export default function Table({
  children,
}: Readonly<PropsWithChildren>): ReactElement {
  return (
    <table>
      {children}
      <style jsx>{`
        table {
          border-collapse: collapse;
          width: 100%;
          background-color: black;
          color: white;
        }
        table :global(th) {
          background-color: #333;
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        table :global(td) {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        table :global(tr:nth-child(even)) {
          background-color: #222;
        }
        table :global(tr:hover) {
          background-color: #444;
        }
        table :global(caption) {
          caption-side: top;
          font-size: 1.2em;
          padding: 10px;
          color: white;
        }
      `}</style>
    </table>
  );
}
