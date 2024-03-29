import type { Meta as MetaObj, StoryObj } from "@storybook/react";

import { Color, Emphasis, TextDecoration } from "./Anchor";
import { Anchor as AnchorComponent, Flex, Grid, Paragraph } from "components";

export default {
  title: "Design System/Anchor",
  component: AnchorComponent,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as MetaObj;

export const WithEmphasis: StoryObj = {
  render: () => (
    <main>
      <Paragraph>
        By embedding a Spotify player on your site, you are agreeing to{" "}
        <AnchorComponent
          href="https://developer.spotify.com/terms/"
          target="_blank"
          emphasis={Emphasis.Bold}
        >
          Spotify&apos;s Developer Terms
        </AnchorComponent>{" "}
        and{" "}
        <AnchorComponent
          href="https://www.spotify.com/platform-rules/"
          target="_blank"
          emphasis={Emphasis.Bold}
        >
          Spotify Platform Rules
        </AnchorComponent>
      </Paragraph>
    </main>
  ),
};

export const Inline: StoryObj = {
  render: () => (
    <main>
      <Paragraph>
        Learn more about your ad choices. Visit{" "}
        <AnchorComponent
          href="https://rindu.marcomadera.com/ad-choices/"
          target="_blank"
          emphasis={Emphasis.Normal}
        >
          Learn more about your ad choices
        </AnchorComponent>{" "}
        and how you can control your online advertising preferences. Explore
        detailed information on how advertisements are personalized for you
        based on your browsing activities. Visit{" "}
        <AnchorComponent
          href="https://rindu.marcomadera.com/ad-insights-and-tools/"
          target="_blank"
          emphasis={Emphasis.Normal}
        >
          Ads insights and tools
        </AnchorComponent>{" "}
        to enhance your online privacy and browsing experience.
      </Paragraph>
    </main>
  ),
};

export const Footer: StoryObj = {
  render: () => (
    <footer>
      <Grid marginBottom="50px">
        <AnchorComponent
          href="https://rindu.marcomadera.com/privacy-policy/"
          color={Color.Secondary}
        >
          Privacy Policy
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/about-us/"
          color={Color.Secondary}
        >
          About Us
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/contact/"
          color={Color.Secondary}
        >
          Contact Us
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/products/"
          color={Color.Secondary}
        >
          Products
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/services/"
          color={Color.Secondary}
        >
          Services
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/blog/"
          color={Color.Secondary}
        >
          Blog
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/careers/"
          color={Color.Secondary}
        >
          Careers
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/faq/"
          color={Color.Secondary}
        >
          FAQ
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/testimonials/"
          color={Color.Secondary}
        >
          Testimonials
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/gallery/"
          color={Color.Secondary}
        >
          Gallery
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/news/"
          color={Color.Secondary}
        >
          News
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/events/"
          color={Color.Secondary}
        >
          Events
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/partners/"
          color={Color.Secondary}
        >
          Partners
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/subscribe/"
          color={Color.Secondary}
        >
          Subscribe
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/sitemap/"
          color={Color.Secondary}
        >
          Sitemap
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/feedback/"
          color={Color.Secondary}
        >
          Feedback
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/downloads/"
          color={Color.Secondary}
        >
          Downloads
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/support/"
          color={Color.Secondary}
        >
          Support
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/subscribe/"
          color={Color.Secondary}
        >
          Subscribe
        </AnchorComponent>
        <AnchorComponent
          href="https://rindu.marcomadera.com/signup/"
          color={Color.Secondary}
        >
          Sign Up
        </AnchorComponent>
      </Grid>
      <hr />
      <Grid maxWidthItem="650px">
        <Flex>
          <AnchorComponent
            href="https://rindu.marcomadera.com/legal/"
            color={Color.Secondary}
            hoverDecoration={TextDecoration.None}
          >
            Legal
          </AnchorComponent>
          <AnchorComponent
            href="https://rindu.marcomadera.com/security-and-privacy-center/"
            color={Color.Secondary}
            hoverDecoration={TextDecoration.None}
          >
            Security and Privacy Center
          </AnchorComponent>
          <AnchorComponent
            href="https://rindu.marcomadera.com/privacy-policy/"
            color={Color.Secondary}
            hoverDecoration={TextDecoration.None}
          >
            Privacy Policy
          </AnchorComponent>
          <AnchorComponent
            href="https://rindu.marcomadera.com/cookies/"
            color={Color.Secondary}
            hoverDecoration={TextDecoration.None}
          >
            Cookies
          </AnchorComponent>
          <AnchorComponent
            href="https://rindu.marcomadera.com/about-ads/"
            color={Color.Secondary}
            hoverDecoration={TextDecoration.None}
          >
            About Ads
          </AnchorComponent>
          <AnchorComponent
            href="https://rindu.marcomadera.com/accessibility/"
            color={Color.Secondary}
            hoverDecoration={TextDecoration.None}
          >
            Accessibility
          </AnchorComponent>
        </Flex>
        <div>
          <Paragraph>
            © 2021{" "}
            <AnchorComponent
              href="https://rindu.marcomadera.com/"
              color={Color.Secondary}
            >
              Rindu
            </AnchorComponent>{" "}
            - All Rights Reserved
          </Paragraph>
        </div>
      </Grid>
    </footer>
  ),
};
