import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { ErrorBoundary } from "components";

export default {
  title: "Components/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "fullscreen",
    container: {
      style: {
        width: "fit-content",
      },
    },
  },
} as Meta<typeof ErrorBoundary>;

const BuggyComponent = () => {
  throw new Error("This is an intentional error!");
};

const Template: StoryFn<typeof ErrorBoundary> = () => {
  return (
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  );
};

export const Default = {
  render: Template,
};
