import { ReactElement, useRef } from "react";

import Link from "next/link";

import { CardType } from "./CardTrack";
import { ArtistList, ExplicitSign } from "components";
import { useOnScreen, useTranslations } from "hooks";
import { ITrack } from "types/spotify";
import { chooseImage, getTrackAddedDate } from "utils";

interface ITrackDetails {
  track: ITrack;
  type: CardType;
  isSmallScreen: boolean;
}
export function TrackDetails({
  track,
  type,
  isSmallScreen,
}: Readonly<ITrackDetails>): ReactElement {
  const { locale } = useTranslations();
  const trackRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(trackRef);

  return (
    <>
      <section>
        {type !== "presentation" &&
          (track.album?.images?.length ? (
            //  eslint-disable-next-line @next/next/no-img-element
            <img
              loading="lazy"
              src={chooseImage(track.album?.images, 48).url}
              alt=""
              className="img"
              width="48"
              height="48"
            />
          ) : (
            <div className="img"></div>
          ))}
        <div className="trackArtistsContainer">
          {track.id && track.name ? (
            <Link
              href={`/${track.type ?? "track"}/${track.id}`}
              className="trackName"
              tabIndex={isVisible ? 0 : -1}
            >
              {track.name}
            </Link>
          ) : null}
          <span className="trackArtists">
            {track.explicit && <ExplicitSign />}
            <ArtistList artists={track.artists} />
          </span>
        </div>
      </section>
      {type === "playlist" && track.album?.id ? (
        <>
          <section>
            <p className="trackArtists">
              <Link
                href={`/${track.album.type ?? "album"}/${track.album.id}`} // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={isVisible ? 0 : -1}
                aria-hidden={!isVisible}
              >
                {track.album.name}
              </Link>
            </p>
          </section>
          <section>
            <p className="trackArtists">
              {getTrackAddedDate(track.added_at, locale)}
            </p>
          </section>
        </>
      ) : null}
      <section>
        {track.popularity && !isSmallScreen ? (
          <div className="pop-meter">
            <div className="pop-meter-bar"></div>
            <div
              className="pop-meter-overlay"
              style={{
                width: `${track.popularity}%`,
              }}
            ></div>
          </div>
        ) : null}
      </section>
      <style jsx>{`
        .img {
          margin: 0;
          padding: 0;
          margin-right: 23px;
          width: 48px;
          height: 48px;
        }
        :global(.trackName),
        .trackArtists :global(a) {
          text-decoration: none;
        }
        :global(.trackName) {
          margin: 0;
          padding: 0;
        }
        .trackArtistsContainer {
          display: block;
          align-items: center;
        }
        :global(.trackName:hover),
        .trackArtists :global(a:hover) {
          text-decoration: underline;
        }
        .pop-meter {
          width: 30px;
          height: 9px;
          position: relative;
          margin: 0 auto;
        }
        .pop-meter-bar,
        .pop-meter-overlay {
          width: 100%;
          position: absolute;
          top: -1px;
          height: 9px;
          overflow-x: hidden;
        }
        .pop-meter-bar:after,
        .pop-meter-overlay:after {
          content: " ";
          display: block;
          transform: translate(0, 0.5px);
          position: absolute;
          left: -4px;
          width: 2px;
          height: 8px;
          top: 0;
        }
        .pop-meter-bar:after {
          box-shadow:
            4px 0 0 0 #3e3e40,
            8px 0 0 0 #3e3e40,
            12px 0 0 0 #3e3e40,
            16px 0 0 0 #3e3e40,
            20px 0 0 0 #3e3e40,
            24px 0 0 0 #3e3e40,
            28px 0 0 0 #3e3e40,
            32px 0 0 0 #3e3e40;
        }
        .pop-meter-overlay:after {
          box-shadow:
            4px 0 0 0 #88898c,
            8px 0 0 0 #88898c,
            12px 0 0 0 #88898c,
            16px 0 0 0 #88898c,
            20px 0 0 0 #88898c,
            24px 0 0 0 #88898c,
            28px 0 0 0 #88898c,
            32px 0 0 0 #88898c;
        }
      `}</style>
    </>
  );
}
