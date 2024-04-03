import { ReactElement } from "react";

import Link from "next/link";

import { Heading } from "components";
import { useTranslations } from "hooks";
import { conjuction, getMonth, Locale, SetLists } from "utils";

export default function SetList({
  setLists,
  artistId,
}: Readonly<{
  setLists: SetLists | null;
  artistId?: string | null;
}>): ReactElement | null {
  const { translations, locale } = useTranslations();

  if (!setLists || !artistId) return null;
  return (
    <div className="set-list">
      <div className="set-list-content">
        <Heading number={2}>{translations.pages.artist.concerts}</Heading>
        {setLists?.setlist?.map((set, i) => {
          if (i > 4) return null;
          const date = set.eventDate.split("-");

          const year = date[2];
          const month = date[1];
          const day = date[0];

          return (
            <Link
              href={`/concert/${artistId}.${set.id}`}
              key={set.id}
              className="set"
            >
              <div className="set-date">
                <span className="month">
                  {getMonth(Number(month) - 1, locale)}
                </span>
                <span className="day">{day}</span>
                <span className="year">{year}</span>
              </div>
              <div className="set-info">
                <Heading number={5} as="h4">
                  {set.venue?.name}
                </Heading>
                <span>
                  {conjuction(
                    [
                      set.venue?.city.name,
                      set.venue?.city.state,
                      set.venue?.city.country.code,
                    ],
                    Locale.EN,
                    { type: "unit" }
                  )}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <style jsx>{`
        .set-info span,
        .about :global(a) {
          color: #ffffffb3;
        }
        .set-list-content :global(a) {
          display: flex;
          padding: 8px;
          cursor: pointer;
          width: 100%;
          text-decoration: none;
        }
        .set-list-content :global(a:hover) {
          border-radius: 3px;
          background: #c6ccd317;
        }
        .set-info {
          margin-left: 18px;
          display: flex;
          flex-direction: column;
        }
        .set-info span {
          margin: 0;
          font-size: 14px;
        }
        .set-list {
          margin-left: 20px;
          flex: 40%;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 999999;
        }
        .month {
          text-align: left;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 12px;
        }
        .day {
          font-weight: normal;
          color: inherit;
          text-transform: none;
          text-align: left;
          font-size: 24px;
        }
        .year {
          font-weight: normal;
          color: inherit;
          text-transform: none;
          text-align: left;
          font-size: 12px;
        }
        .set-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
          font-size: 16px;
          width: fit-content;
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .set-list {
            flex-direction: row;
            margin: 0;
          }
          .set-info {
            align-self: center;
          }
          .set-info :global(h4) {
            padding: 0;
          }
          .set-list-content :global(a) {
            margin-left: 4px;
          }
        }
      `}</style>
    </div>
  );
}
