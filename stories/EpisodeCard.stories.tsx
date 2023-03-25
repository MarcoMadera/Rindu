import React from "react";

import { withKnobs } from "@storybook/addon-knobs";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { EpisodeCard } from "components";
import { HeaderType } from "types/pageHeader";

export default {
  title: "Components/EpisodeCard",
  component: EpisodeCard,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
      style: { width: "fit-content" },
    },
  },
  argTypes: {
    id: { control: "text" },
    title: { control: "text" },
    subTitle: { control: "text", type: "string" },
    images: { control: "array" },
    type: {
      options: HeaderType,
      control: { type: "select" },
    },
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof EpisodeCard>;

const Template: ComponentStory<typeof EpisodeCard> = (args) => (
  <EpisodeCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  item: {
    audio_preview_url:
      "https://p.scdn.co/mp3-preview/1dca233834f6a9e5a34a9445b92dd133580f9ef1",
    description:
      "Strip Down and Dive In with Tatiana Ringsby (@tringsby) and Kela Rose (@sundazedkk). These two best friends go all in on topics that actually matter with vulnerability, but still try not to take themselves too seriously. By diving into topics surrounding mental health, environmentalism, gender identity, radical self love, body positivity/body neutrality, sexual orientation, and so many more awesome topics they tear their walls down to give others permission to do the same. Its all about being real, authentic, and opening up conversations that need to be had here on Skinny Dipping.",
    duration_ms: 45505,
    explicit: true,
    external_urls: {
      spotify: "https://open.spotify.com/episode/5aubkIdfpFOBcHaF8gxYwo",
    },
    href: "https://api.spotify.com/v1/episodes/5aubkIdfpFOBcHaF8gxYwo",
    id: "5aubkIdfpFOBcHaF8gxYwo",
    images: [
      {
        height: 640,
        url: "https://i.scdn.co/image/ab6765630000ba8adea5d4cd16f16977604725eb",
        width: 640,
      },
      {
        height: 300,
        url: "https://i.scdn.co/image/ab67656300005f1fdea5d4cd16f16977604725eb",
        width: 300,
      },
      {
        height: 64,
        url: "https://i.scdn.co/image/ab6765630000f68ddea5d4cd16f16977604725eb",
        width: 64,
      },
    ],
    is_externally_hosted: false,
    is_playable: true,
    language: "en",
    languages: ["en"],
    name: "Skinny Dipping: The Official Trailer",
    release_date: "2021-01-20",
    release_date_precision: "day",
    type: "episode",
    uri: "spotify:episode:5aubkIdfpFOBcHaF8gxYwo",
  } as SpotifyApi.EpisodeObjectSimplified,
  position: 0,
  show: {
    copyrights: [],
    description:
      "Skinny Dipping the rebirth is more vulnerable, more real, more impactful then every. Every Tuesday Kela Rose will dive in with her amazing guests and every Tuesday she will dive into a mini episode-- Soul in Progress minis.  Hey guys, honestly so grateful to be at this space and place to get to facilitate and open up important conversations. Nothing else lights me up more inside. I cannot wait to show you what this season has in store. Thank you always for being a huge part of these conversations. xx Kela Rose",
    episodes: {
      href: "https://api.spotify.com/v1/shows/2OLNxlrm2OCdATbUaonmEh/episodes?offset=0&limit=50",
      items: [],
      limit: 50,
      next: null,
      offset: 0,
      previous: null,
      total: 39,
    },
    explicit: true,
    external_urls: {
      spotify: "https://open.spotify.com/show/2OLNxlrm2OCdATbUaonmEh",
    },
    href: "https://api.spotify.com/v1/shows/2OLNxlrm2OCdATbUaonmEh",
    id: "2OLNxlrm2OCdATbUaonmEh",
    images: [
      {
        height: 640,
        url: "https://i.scdn.co/image/ab6765630000ba8adea5d4cd16f16977604725eb",
        width: 640,
      },
      {
        height: 300,
        url: "https://i.scdn.co/image/ab67656300005f1fdea5d4cd16f16977604725eb",
        width: 300,
      },
      {
        height: 64,
        url: "https://i.scdn.co/image/ab6765630000f68ddea5d4cd16f16977604725eb",
        width: 64,
      },
    ],
    is_externally_hosted: false,
    languages: ["en"],
    media_type: "mixed",
    name: "Skinny Dipping",
    publisher: "Kela Rose",
    total_episodes: 39,
    type: "show",
    uri: "spotify:show:2OLNxlrm2OCdATbUaonmEh",
    available_markets: [],
    html_description: "",
  } as SpotifyApi.ShowObject,
};
