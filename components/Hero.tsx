import { ReactElement } from "react";

interface IHero {
  heroTitle: string;
  imgSrc: string;
  imgAlt: string;
}

export default function Hero({
  heroTitle,
  imgSrc,
  imgAlt,
}: IHero): ReactElement {
  return (
    <section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgSrc} alt={imgAlt} width={500} className="hero-image" />
      <div className="hero-title">
        <h1>{heroTitle}</h1>
      </div>
      <style jsx>
        {`
          section {
            margin-top: 64px;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            position: relative;
          }
          div {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgb(112, 83, 120);
            grid-column-start: 7;
            grid-column-end: 13;
            margin-left: -280px;
            height: 700px;
          }
          h1 {
            font-size: 64px;
            line-height: 64px;
            color: rgb(255, 205, 210);
            margin-left: 24%;
            max-width: 56.43%;
            padding: 0px;
            width: 100%;
          }
          img {
            width: 500px;
            margin: 0 auto;
            left: 0px;
            top: 50%;
            transform: translateY(-50%);
            position: relative;
            width: 100%;
            height: 80%;
            grid-column-start: 1;
            grid-column-end: 7;
          }
          @media screen and (min-width: 0px) and (max-width: 1100px) {
            section {
              display: block;
            }
            img {
              transform: translateY(0px);
            }
            div {
              height: auto;
              padding: 40px 0;
              margin: 0;
              margin-top: -10px;
            }
            h1 {
              font-size: 40px;
              line-height: 40px;
              max-width: fit-content;
              margin-left: 0;
              padding: 10px;
            }
          }
        `}
      </style>
    </section>
  );
}
