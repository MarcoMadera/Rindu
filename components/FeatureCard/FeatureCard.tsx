import { ReactElement } from "react";

import { CardContainer } from "components";

interface IFeatureCard {
  eyeBrowText: string;
  titleText: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  onCTAClick: () => void;
  ctaText: string;
}

export default function FeatureCard({
  eyeBrowText,
  titleText,
  description,
  imageSrc,
  imageAlt,
  onCTAClick,
  ctaText,
}: IFeatureCard): ReactElement {
  return (
    <CardContainer className="featured-card">
      <div className="image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={imageAlt} width={500} />
      </div>
      <div className="data">
        <span>{eyeBrowText}</span>
        <h2>{titleText}</h2>
        <p>{description}</p>
        <button onClick={onCTAClick}>{ctaText}</button>
      </div>
      <style jsx>{`
        img {
          margin: 0 auto;
          position: relative;
        }
        .image {
          display: grid;
        }
        @media screen and (min-width: 0px) and (max-width: 1100px) {
          img {
            transform: translateY(0px);
            width: 100%;
          }
          .data,
          :global(.featured-card:nth-child(even)) .image,
          :global(.featured-card:nth-child(odd)) .image {
            padding: 0;
          }
          .data {
            margin: 20px 0;
            padding: 0;
          }
          :global(.featured-card:nth-child(even)) {
            display: flex;
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </CardContainer>
  );
}
