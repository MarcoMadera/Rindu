import React, { ReactElement } from "react";

import { Meta } from "@storybook/react";
import Image from "next/image";

import { BigPill, CardContainer, Heading } from "components";

export default {
  title: "Components/CardContainer",
  component: CardContainer,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "light",
    },
    backgrounds: {
      default: "white",
    },
  },
} as Meta<typeof CardContainer>;

const MultipleCardsTemplate = (): ReactElement => (
  <>
    <CardContainer></CardContainer>
    <CardContainer></CardContainer>
    <CardContainer></CardContainer>
    <CardContainer></CardContainer>
    <CardContainer></CardContainer>
  </>
);
const MultipleWithContentCardsTemplate = (): ReactElement => (
  <>
    <CardContainer>
      <div>
        <Image
          src={`https://picsum.photos/400/400?random=${2}`}
          alt={"23"}
          width={400}
          height={400}
        />
      </div>
      <div>
        <span>heard</span>
        <h2>weight</h2>
        <p>
          mark worry fairly terrible captured sentence diameter crack split
          these herd before stuck origin income plenty higher yet stage explore
          height excellent cream soft
        </p>
        <a href={"http://he.sh/ceztefic"}>available</a>
      </div>
    </CardContainer>
    <CardContainer>
      <div>
        <h2>sound</h2>
      </div>
      <div>
        <p>
          been sent amount drawn aside kids function neighbor catch example
          indicate shine smell careful spin solar business create hung physical
          quietly feel ranch road
        </p>
        <a href="http://fucogu.li/ifebfo">graph</a>
      </div>
    </CardContainer>
    <CardContainer>
      <div>
        <Heading number={1}>village</Heading>
        <span>
          vessels lying massage hay dirt type proud however tip government
          strike cake addition store sport stood kids foreign even tide heart
          bad west certain
        </span>
      </div>
      <div>
        <video
          title="title"
          controls
          style={{ display: "flex", maxWidth: "100%" }}
        >
          <source
            src="https://user-images.githubusercontent.com/17222523/206883606-1c9ef3e7-21f7-421c-b9cc-b2e43c0d53f5.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
          <track kind="captions" srcLang="en" label="English captions" />
        </video>
      </div>
    </CardContainer>
    <CardContainer>
      <div>
        <Heading number={3}>native managed command</Heading>
        <p>
          attack wise principle leaf rule jump you making hung fence close tree
          planning explanation cut little wheat quick root stood atom oil stuck
          eat
        </p>
      </div>
      <div>
        <BigPill
          href="http://al.mr/no"
          subTitle="forgotten unhappy"
          title="phrase"
          img="https://picsum.photos/400/400?random=${3}"
        />
      </div>
    </CardContainer>
    <CardContainer>
      <div>
        <table>
          <caption>Sample Table</caption>
          <thead>
            <tr>
              <th scope="col">Header 1</th>
              <th scope="col">Header 2</th>
              <th scope="col">Header 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row 1, Column 1</td>
              <td>Row 1, Column 2</td>
              <td>Row 1, Column 3</td>
            </tr>
            <tr>
              <td>Row 2, Column 1</td>
              <td>Row 2, Column 2</td>
              <td>Row 2, Column 3</td>
            </tr>
            <tr>
              <td>Row 3, Column 1</td>
              <td>Row 3, Column 2</td>
              <td>Row 3, Column 3</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <ul>
          <li>power frighten</li>
          <li>http://zuhcondu.bh/pecho</li>
        </ul>
        <ol>
          <li>whom thirty three powerful</li>
          <li>connected enemy current chief</li>
        </ol>
      </div>
    </CardContainer>
  </>
);

export const Default = {
  render: CardContainer,
  args: {},
};

export const MultipleContainers = {
  render: MultipleCardsTemplate,
};

export const MultipleContainersWithContent = {
  render: MultipleWithContentCardsTemplate,
};
