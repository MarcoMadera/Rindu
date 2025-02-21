import { ReactElement } from "react";

import { Disc } from "components/icons";
import { useTranslations } from "hooks";
import { templateReplace } from "utils";

export const DiscSeparator = ({
  discNumber,
  style,
}: {
  discNumber?: number;
  style: React.CSSProperties;
}): ReactElement => {
  const { translations } = useTranslations();
  return (
    <div style={style}>
      <Disc width={16} />{" "}
      {templateReplace(translations.pages.album.disc, {
        number: discNumber ?? "0",
      })}
      <style jsx>{`
        div {
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          gap: 8px;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default DiscSeparator;
