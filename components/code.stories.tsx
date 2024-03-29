import type { Meta as MetaObj, StoryObj } from "@storybook/react";

import { WhiteSpace } from "./Pre";
import { Paragraph, Pre, TextHighlighter } from "components";

export default {
  title: "Design System/Code",
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as MetaObj;

export const InlineCode: StoryObj = {
  render: () => (
    <main>
      <Paragraph>
        This is an example of <code>inline code block</code>
      </Paragraph>
    </main>
  ),
};

export const BlockCode: StoryObj = {
  render: () => (
    <main>
      <Paragraph>
        This is an example of a block code block:
        <Pre>
          <code>
            {`const BlockCode: StoryObj = {
  render: () => (
    <main>
      <Paragraph>
        This is an example of a block code block:
        <pre>
          <code>{this}</code>
        </pre>
      </Paragraph>
    </main>
  );`}
          </code>
        </Pre>
      </Paragraph>
    </main>
  ),
};
export const BlockCodeNormalWhiteSpace: StoryObj = {
  render: () => (
    <main>
      <Paragraph>
        This is an example of a block code block with normal whitespace:
        <Pre whiteSpace={WhiteSpace.Normal}>
          <code>
            {
              // eslint-disable-next-line quotes
              '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'
            }
          </code>
        </Pre>
      </Paragraph>
    </main>
  ),
};

export const Highlighted: StoryObj = {
  render: () => (
    <main>
      <TextHighlighter text="highlighted text">
        This is an example of highlighted text
      </TextHighlighter>
    </main>
  ),
};

export const CommandLine: StoryObj = {
  render: () => (
    <main>
      <pre>
        <samp>
          <span>Marco@rindu:~$</span>
          <kbd>md5 -s &quot;Hello world&quot;</kbd>
          MD5 (&quot;Hello world&quot;) = 3e25960a79dbc69b674cd4ec67a72c62
          <span>Marco@rindu:~$</span> <span>█</span>
        </samp>
      </pre>
    </main>
  ),
};
