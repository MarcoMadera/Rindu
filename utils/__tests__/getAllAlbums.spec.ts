import { IUtilsMocks } from "types/mocks";
import { getAllAlbums } from "utils";
import { getMyAlbums } from "utils/spotifyCalls";

jest.mock("utils/spotifyCalls");

const { savedAlbum, paginObject } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

const getAlbums = (number: number): SpotifyApi.SavedAlbumObject[] => {
  const albums: SpotifyApi.SavedAlbumObject[] = Array.from(
    { length: number },
    () => savedAlbum
  );
  return albums;
};

describe("getAllAlbums", () => {
  it("should return items with empty array", async () => {
    expect.assertions(3);

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockResolvedValue(paginObject);

    const allAlbums = await getAllAlbums();
    expect(getMyAlbums).toHaveBeenCalledTimes(1);
    expect(allAlbums).toBeDefined();
    expect(allAlbums?.items).toHaveLength(0);
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });

  it("should return albums equal null if response is null", async () => {
    expect.assertions(2);

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockResolvedValue(null);

    const allAlbums = await getAllAlbums();
    expect(getMyAlbums).toHaveBeenCalledTimes(1);
    expect(allAlbums).toBeNull();
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });
  it("should return albums data if next response is null", async () => {
    expect.assertions(2);

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    )
      .mockResolvedValueOnce({
        ...paginObject,
        total: 80,
        items: getAlbums(50),
      })
      .mockResolvedValueOnce(null);

    const allAlbums = await getAllAlbums();
    expect(getMyAlbums).toHaveBeenCalledTimes(2);
    expect(allAlbums).toBeNull();
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });

  it("should return all albums", async () => {
    expect.assertions(3);

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockResolvedValue({
      ...paginObject,
      total: 50,
      items: getAlbums(50),
    });

    const allAlbums = await getAllAlbums();
    expect(getMyAlbums).toHaveBeenCalledTimes(1);
    expect(allAlbums).toBeDefined();
    expect(allAlbums?.items).toHaveLength(50);
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });

  it("should call getMyAlbums if total is more than limit", async () => {
    expect.assertions(3);

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    )
      .mockResolvedValueOnce({
        ...paginObject,
        total: 60,
        items: getAlbums(50),
      })
      .mockResolvedValueOnce({
        ...paginObject,
        total: 60,
        items: getAlbums(10),
      });

    const allAlbums = await getAllAlbums();
    expect(getMyAlbums).toHaveBeenCalledTimes(2);
    expect(allAlbums).toBeDefined();
    expect(allAlbums?.items).toHaveLength(60);
    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    ).mockClear();
  });

  it("should get all albums", async () => {
    expect.assertions(3);

    (
      getMyAlbums as jest.Mock<
        Promise<SpotifyApi.UsersSavedAlbumsResponse | null>
      >
    )
      .mockResolvedValueOnce({
        ...paginObject,
        total: 170,
        items: getAlbums(50),
      })
      .mockResolvedValueOnce({
        ...paginObject,
        total: 170,
        items: getAlbums(50),
      })
      .mockResolvedValueOnce({
        ...paginObject,
        total: 170,
        items: getAlbums(50),
      })
      .mockResolvedValueOnce({
        ...paginObject,
        total: 170,
        items: getAlbums(20),
      });

    const allAlbums = await getAllAlbums();
    expect(getMyAlbums).toHaveBeenCalledTimes(4);
    expect(allAlbums).toBeDefined();
    expect(allAlbums?.items).toHaveLength(170);
  });
});
