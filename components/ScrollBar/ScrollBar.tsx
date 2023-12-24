import { ComponentProps, PropsWithChildren, ReactElement } from "react";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export default function ScrollBar({
  children,
  ...props
}: Readonly<
  PropsWithChildren<ComponentProps<typeof SimpleBar>>
>): ReactElement {
  return (
    <SimpleBar {...props}>
      {children}
      <style global jsx>{`
        .simplebar-track.simplebar-vertical {
          width: 14px;
        }
        .simplebar-scrollbar {
          background-color: transparent;
          transition: background-color 0.2s;
        }
        .simplebar-scrollbar.simplebar-hover {
          background-color: transparent;
        }
        .simplebar-scrollbar:before {
          background-color: #f6f6f6cd;
          border-radius: 0;
          width: 12px;
        }
        .simplebar-scrollbar.simplebar-hover:before {
          background-color: #ffffffde;
          border-radius: 0;
          width: 12px;
        }
      `}</style>
    </SimpleBar>
  );
}
