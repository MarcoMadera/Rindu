import { ReactElement } from "react";

import { Meta } from "@storybook/react";
import { sanitize } from "dompurify";

import {
  Button,
  FollowButton,
  LoginButton,
  LyricsPIPButton,
  Paragraph,
  PlayButton,
  RouterButtons,
} from "components";
import { htmlToReact, templateReplace } from "utils";
import { Follow_type } from "utils/spotifyCalls";

export default {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Button>;

export const Default = {
  args: {
    children: "click me",
  },
};

export const HtmlToReactButton = {
  args: {
    html: "",
  },
  render: ({ html }: { html: string }): ReactElement => {
    const format = (content: string) =>
      templateReplace(content, [
        <Button
          key="0"
          onClick={() => {
            alert("hola 0");
          }}
        >
          This is your button 0
        </Button>,
        <LoginButton key="1" />,
        <RouterButtons key="2" />,
        <LyricsPIPButton key="3" />,
        <PlayButton
          key="4"
          allTracks={[]}
          centerSize={24}
          size={52}
          style={{ display: "inline" }}
        />,
        <FollowButton key="5" type={Follow_type.Artist} />,
      ]);

    return (
      <>
        <Paragraph>
          {
            "Include html in the controls and add {0} ... {5} to have different buttons"
          }
        </Paragraph>
        <Paragraph>{htmlToReact(sanitize(html), format)}</Paragraph>
      </>
    );
  },
};
