import { PropsWithChildren, ReactElement } from "react";

import type { Meta as MetaObj, StoryObj } from "@storybook/react";

import { WhiteSpace } from "./Pre";
import { Paragraph, Pre } from "components";

export default {
  title: "Design System/Code",
  component: Pre,
  parameters: {
    layout: "fullscreen",
  },
} as MetaObj;

const iframe =
  // eslint-disable-next-line @stylistic/ts/quotes
  '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';

export const BlockCodeNormalWhiteSpace: StoryObj = {
  render: ({ children }: PropsWithChildren): ReactElement => (
    <main>
      <Paragraph>
        This is an example of a block code block with normal whitespace:
        <Pre whiteSpace={WhiteSpace.Normal}>
          <code>{children}</code>
        </Pre>
      </Paragraph>
    </main>
  ),
  args: {
    children: iframe,
  },
};

const blockCode = `const BlockCode: StoryObj = {
  render: () => (
    <main>
      <Paragraph>
        This is an example of a block code block:
        <pre>
          <code>{this}</code>
        </pre>
      </Paragraph>
    </main>
  );`;

export const BlockCode: StoryObj = {
  render: ({ children }: PropsWithChildren): ReactElement => (
    <main>
      <Paragraph>
        This is an example of a block code block:
        <Pre>
          <code>{children}</code>
        </Pre>
      </Paragraph>
    </main>
  ),
  args: {
    children: blockCode,
  },
};
