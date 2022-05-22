import Link from "next/link";
import { ReactElement } from "react";

export default function BigPill({
  img,
  title,
  subTitle,
  href,
}: {
  img: string | undefined;
  title: string;
  subTitle: string;
  href: string;
}): ReactElement {
  return (
    <Link href={href}>
      <a className="big-pill">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="img" src={img} alt={title} />
        ) : (
          <div className="img"></div>
        )}
        <div className="big-pill-content">
          <span>{title}</span>
          <h2>{subTitle}</h2>
        </div>
        <style jsx>{`
          .big-pill {
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
          .big-pill:hover,
          .big-pill:focus {
            background-color: rgba(255, 255, 255, 0.1);
          }
          .big-pill .img {
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
          .big-pill-content h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .big-pill-content h3 {
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 10px;
          }
        `}</style>
      </a>
    </Link>
  );
}
