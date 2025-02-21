import { ReactElement } from "react";

import { Disc } from "components/icons";

export const DiscSeparator = ({
  discNumber,
  style,
}: {
  discNumber?: number;
  style: React.CSSProperties;
}): ReactElement => (
  <div style={style}>
    <Disc width={16} /> Disc {discNumber ?? "0"}
    <style jsx>{`
      div {
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        gap: 8px;
      }
    `}</style>
  </div>
);

export default DiscSeparator;
