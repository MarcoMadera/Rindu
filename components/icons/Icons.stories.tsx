import { ReactElement } from "react";

import * as icons from "components/icons";

export default {
  title: "Components/Icons",
};

export const All = {
  render: (): ReactElement => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gap: "1px",
      }}
    >
      {Object.entries(icons).map(([name, Icon]) => (
        <div
          key={name}
          style={{
            display: "grid",
            alignItems: "center",
            justifyItems: "center",
            width: "100%",
            height: "100%",
            color: "#000",
            outline: "1px solid #000",
            padding: "16px",
          }}
        >
          <Icon
            color="#000"
            width={24}
            height={24}
            active={"true"}
            volume={0.75}
            fill="#000"
            state={1}
          />
          <div style={{ textAlign: "center", overflow: "hidden" }}>{name}</div>
        </div>
      ))}
    </div>
  ),

  name: "all",
};
