import type { Meta as MetaObj, StoryObj } from "@storybook/react";

export default {
  title: "Design System/Lists",
  parameters: {
    layout: "fullscreen",
  },
} as MetaObj;

export const OrderedList: StoryObj = {
  render: () => (
    <main>
      <ol>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ol>
    </main>
  ),
};

export const UnorderedList: StoryObj = {
  render: () => (
    <main>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
    </main>
  ),
};

export const NestedList: StoryObj = {
  render: () => (
    <main>
      <ul>
        <li>First item</li>
        <li>
          Second item
          <ul>
            <li>First sub-item</li>
            <li>Second sub-item</li>
          </ul>
        </li>
        <li>Third item</li>
      </ul>
    </main>
  ),
};

export const DefinitionList: StoryObj = {
  render: () => (
    <main>
      <dl>
        <dt>First term</dt>
        <dd>First definition</dd>
        <dt>Second term</dt>
        <dd>Second definition</dd>
        <dt>Third term</dt>
        <dd>Third definition</dd>
      </dl>
    </main>
  ),
};

export const DescriptionList: StoryObj = {
  render: () => (
    <main>
      <dl>
        <dt>First term</dt>
        <dd>First description</dd>
        <dt>Second term</dt>
        <dd>Second description</dd>
        <dt>Third term</dt>
        <dd>Third description</dd>
      </dl>
    </main>
  ),
};

export const DescriptionListInline: StoryObj = {
  render: () => (
    <main>
      <dl>
        <dt>First term</dt>
        <dd>First description</dd>
        <dt>Second term</dt>
        <dd>Second description</dd>
        <dt>Third term</dt>
        <dd>Third description</dd>
      </dl>
    </main>
  ),
};
