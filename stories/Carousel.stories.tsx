import React, { ComponentProps, PropsWithChildren } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Carousel } from "components";

export default {
  title: "Components/Carousel",
  component: Carousel,
  parameters: {
    layout: "fullscreen",
    container: {
      disablePadding: true,
    },
  },
  argTypes: {
    title: { control: "text" },
    gap: { control: "number" },
    boxWidth: { control: "number", defaultValue: 200, min: 0, max: 1000 },
    totalBoxes: { control: "number", defaultValue: 50, min: 0, max: 1000 },
  },
} as ComponentMeta<typeof Carousel>;

const Box = ({
  children,
  boxWidth,
}: PropsWithChildren<{ boxWidth: number }>) => (
  <div
    style={{
      minWidth: `${boxWidth}px`,
      height: "200px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "rgba(0, 0, 0, 0.3)",
    }}
  >
    {children}
  </div>
);

const getBoxes = (totalBoxes: number, boxWidth: number) =>
  Array.from({ length: totalBoxes }).map((_, i) => (
    <Box key={i} boxWidth={boxWidth}>{`Box ${i + 1}`}</Box>
  ));

const Template: ComponentStory<
  ({
    boxWidth,
    totalBoxes,
    ...args
  }: { boxWidth: number; totalBoxes: number } & ComponentProps<
    typeof Carousel
  >) => JSX.Element
> = (args) => {
  const { boxWidth, totalBoxes, ...carouselProps } = args;

  return (
    <div
      style={{
        padding: "2em",
        background: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <Carousel {...carouselProps}>{getBoxes(totalBoxes, boxWidth)}</Carousel>
    </div>
  );
};

export const Boxes = Template.bind({});

Boxes.args = {
  title: "The best carousel",
  gap: 24,
  boxWidth: 200,
  totalBoxes: 50,
};
