import { ReactElement } from "react";

import { decode } from "html-entities";

import { Carousel, MainTracks, PresentationCard } from "components";
import { CardType } from "components/CardContent";
import { useTranslations } from "hooks";
import { getYear } from "utils";

interface ISearchResultsProps {
  searchResponse: SpotifyApi.SearchResponse;
}

export default function SearchResults({
  searchResponse,
}: Readonly<ISearchResultsProps>): ReactElement {
  const { translations } = useTranslations();

  return (
    <div>
      {searchResponse.tracks?.items &&
      searchResponse.tracks?.items?.length > 0 ? (
        <>
          <MainTracks
            title={translations.songs}
            tracksRecommendations={searchResponse.tracks?.items.slice(0, 5)}
          />
          <Carousel gap={24}>
            {searchResponse.tracks?.items.slice(5)?.map((track) => {
              if (!track) return null;
              return (
                <PresentationCard
                  type={CardType.TRACK}
                  key={track.id}
                  track={track}
                  images={track.album.images}
                  title={track.name}
                  subTitle={track.artists[0].name}
                  id={track.id}
                  isSingle
                />
              );
            })}
          </Carousel>
        </>
      ) : null}
      {searchResponse.playlists?.items &&
      searchResponse.playlists?.items?.length > 0 ? (
        <Carousel title={translations.playlists} gap={24}>
          {searchResponse.playlists?.items?.map((item) => {
            if (!item) return null;
            const { images, name, description, id, owner } = item;
            return (
              <PresentationCard
                type={CardType.PLAYLIST}
                key={id}
                images={images}
                title={name}
                subTitle={
                  decode(description) ||
                  `${translations.by} ${owner.display_name ?? ""}`
                }
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
      {searchResponse.artists?.items &&
      searchResponse.artists?.items?.length > 0 ? (
        <Carousel title={translations.artists} gap={24}>
          {searchResponse.artists?.items?.map((item) => {
            if (!item) return null;
            const { images, name, id } = item;
            return (
              <PresentationCard
                type={CardType.ARTIST}
                key={id}
                images={images}
                title={name}
                subTitle={translations.artist}
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
      {searchResponse.albums?.items &&
      searchResponse.albums?.items?.length > 0 ? (
        <Carousel title={translations.albums} gap={24}>
          {searchResponse.albums?.items?.map((item) => {
            if (!item) return null;
            const { images, name, id, artists, release_date } = item;
            const artistNames = artists.map((artist) => artist.name);
            const subTitle = release_date
              ? `${getYear(release_date)} · ${translations.album}`
              : artistNames.join(", ");
            return (
              <PresentationCard
                type={CardType.ALBUM}
                key={id}
                images={images}
                title={name}
                subTitle={subTitle}
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
      {searchResponse.shows?.items &&
      searchResponse.shows?.items?.length > 0 ? (
        <Carousel title={translations.shows} gap={24}>
          {searchResponse.shows?.items?.map((item) => {
            if (!item) return null;
            const { images, name, id, publisher } = item;
            return (
              <PresentationCard
                type={CardType.SHOW}
                key={id}
                images={images}
                title={name}
                subTitle={publisher}
                id={id}
              />
            );
          })}
        </Carousel>
      ) : null}
      {searchResponse.episodes?.items &&
      searchResponse.episodes?.items?.length > 0 ? (
        <Carousel title={translations.episodes} gap={24}>
          {(
            searchResponse.episodes as SpotifyApi.PagingObject<SpotifyApi.EpisodeObject>
          )?.items?.map((item) => {
            if (!item) return null;
            const { images, name, id, description } = item;
            return (
              <PresentationCard
                type={CardType.EPISODE}
                key={id}
                images={images}
                title={name}
                subTitle={description}
                id={id}
                isSingle
              />
            );
          })}
        </Carousel>
      ) : null}
    </div>
  );
}
