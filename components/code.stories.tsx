import type { Meta as MetaObj, StoryObj } from "@storybook/react";

import Paragraph from "./Paragraph";
import TextHighlighter from "./TextHighlighter";

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
        <pre>
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
        </pre>
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
