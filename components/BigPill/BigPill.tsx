import { ReactElement } from "react";

import Link from "next/link";

import { Eyebrow, Heading } from "components";

interface BigPillProps {
  img?: string;
  title: string;
  subTitle: string;
  href: string;
}

export default function BigPill({
  img,
  title,
  subTitle,
  href,
}: Readonly<BigPillProps>): ReactElement {
  return (
    <Link href={href} className="BigPill">
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="img" src={img} alt={title} />
      ) : (
        <div className="img"></div>
      )}
      <div className="big-pill-content">
        <Eyebrow size="medium">{title}</Eyebrow>
        <Heading number={3} as={"h2"}>
          {subTitle}
        </Heading>
      </div>
      <style jsx>{`
        :global(.BigPill) {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          background-color: transparent;
          border-radius: 8px;
          position: relative;
          z-index: 1;
          gap: 20px;
          text-decoration: none;
          color: inherit;
          padding: 10px;
        }
        :global(.BigPill:hover),
        :global(.BigPill:focus) {
          background-color: rgba(255, 255, 255, 0.1);
        }
        :global(.BigPill) .img {
          width: 100px;
          min-width: 100px;
          min-height: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          object-position: center center;
        }
        .big-pill-content {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }
        @media (max-width: 768px) {
          :global(.BigPill) {
            padding: 8px;
          }
        }
      `}</style>
    </Link>
  );
}
