import { getAllAlbums } from "utils/getAllAlbums";
import { getMyAlbums } from "utils/spotifyCalls/getMyAlbums";

jest.mock("utils/spotifyCalls/getMyAlbums", () => ({
  getMyAlbums: jest.fn(),
}));

const getAlbums = (number: number): SpotifyApi.SavedAlbumObject[] => {
  const albums: SpotifyApi.SavedAlbumObject[] = Array.from(
    { length: number },
    () => ({
      album: {
        name: "albumName",
        images: [{ url: "albumUrl" }],
        album_type: "album",
        artists: [
          {
            name: "artistName",
            external_urls: { spotify: "artistUrl" },
            href: "",
            id: "",
            type: "artist",
            uri: "",
          },
        ],
        copyrights: [{ text: "copyrightText", type: "C" }],
        external_ids: { isrc: "isrc" },
        external_urls: { spotify: "spotifyUrl" },
        genres: ["genre"],
        release_date: "releaseDate",
        total_tracks: 10,
        href: "href",
        id: "id",
        type: "album",
        label: "label",
        popularity: 10,
        tracks: {
          href: "",
          items: [],
          limit: 0,
          next: "",
          offset: 0,
          previous: "",
          total: 0,
        },
        release_date_precision: "day",
        uri: "uri",
      },
      added_at: "addedAt",
    })
  );
  return albums;
};

describe("getAllAlbums", () => {
  it("should return items with empty array", async () => {
    expect.assertions(3);
    const accessToken = "accessToken";

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockResolvedValue({
      total: 0,
      items: [],
      href: "",
      limit: 50,
      next: "",
      offset: 0,
      previous: "",
    });

    const albumsData = await getAllAlbums(accessToken);
    expect(getMyAlbums).toHaveBeenCalledTimes(1);
    expect(albumsData).toBeDefined();
    expect(albumsData?.items).toHaveLength(0);
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });

  it("should return albums equal null if response is null", async () => {
    expect.assertions(2);
    const accessToken = "accessToken";

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockResolvedValue(null);

    const albumsData = await getAllAlbums(accessToken);
    expect(getMyAlbums).toHaveBeenCalledTimes(1);
    expect(albumsData).toBeNull();
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });
  it("should return albums data if next response is null", async () => {
    expect.assertions(2);
    const accessToken = "accessToken";

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    )
      .mockResolvedValueOnce({
        total: 80,
        items: getAlbums(50),
        href: "",
        limit: 50,
        next: "",
        offset: 0,
        previous: "",
      })
      .mockResolvedValueOnce(null);

    const albumsData = await getAllAlbums(accessToken);
    expect(getMyAlbums).toHaveBeenCalledTimes(2);
    expect(albumsData).toBeNull();
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });

  it("should return all albums", async () => {
    expect.assertions(3);
    const accessToken = "accessToken";

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockResolvedValue({
      total: 50,
      items: getAlbums(50),
      href: "",
      limit: 50,
      next: "",
      offset: 0,
      previous: "",
    });

    const albumsData = await getAllAlbums(accessToken);
    expect(getMyAlbums).toHaveBeenCalledTimes(1);
    expect(albumsData).toBeDefined();
    expect(albumsData?.items).toHaveLength(50);
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });

  it("should call getMyAlbums if total is more than limit", async () => {
    expect.assertions(3);
    const accessToken = "accessToken";

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    )
      .mockResolvedValueOnce({
        total: 60,
        items: getAlbums(50),
        href: "",
        limit: 50,
        next: "",
        offset: 0,
        previous: "",
      })
      .mockResolvedValueOnce({
        total: 60,
        items: getAlbums(10),
        href: "",
        limit: 50,
        next: "",
        offset: 0,
        previous: "",
      });

    const albumsData = await getAllAlbums(accessToken);
    expect(getMyAlbums).toHaveBeenCalledTimes(2);
    expect(albumsData).toBeDefined();
    expect(albumsData?.items).toHaveLength(60);
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });

  it("should get all albums", async () => {
    expect.assertions(3);
    const accessToken = "accessToken";

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    )
      .mockResolvedValueOnce({
        total: 170,
        items: getAlbums(50),
        href: "",
        limit: 50,
        next: "",
        offset: 0,
        previous: "",
      })
      .mockResolvedValueOnce({
        total: 170,
        items: getAlbums(50),
        href: "",
        limit: 50,
        next: "",
        offset: 0,
        previous: "",
      })
      .mockResolvedValueOnce({
        total: 170,
        items: getAlbums(50),
        href: "",
        limit: 50,
        next: "",
        offset: 0,
        previous: "",
      })
      .mockResolvedValueOnce({
        total: 170,
        items: getAlbums(20),
        href: "",
        limit: 50,
        next: "",
        offset: 0,
        previous: "",
      });

    const albumsData = await getAllAlbums(accessToken);
    expect(getMyAlbums).toHaveBeenCalledTimes(4);
    expect(albumsData).toBeDefined();
    expect(albumsData?.items).toHaveLength(170);
  });
});
