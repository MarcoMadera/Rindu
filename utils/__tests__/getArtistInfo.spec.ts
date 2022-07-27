import { getArtistInfo } from "utils/getArtistInfo";

const artistInfo = {
  idArtist: "",
  strArtist: "",
  strArtistStripped: null,
  strArtistAlternate: "",
  strLabel: "",
  idLabel: "",
  intFormedYear: "",
  intBornYear: "",
  intDiedYear: null,
  strDisbanded: null,
  strStyle: "",
  strGenre: "",
  strMood: "",
  strWebsite: "",
  strFacebook: "",
  strTwitter: "",
  strGender: "",
  intMembers: "",
  strCountry: "",
  strCountryCode: "",
  strArtistThumb: "",
  strArtistLogo: "",
  strArtistCutout: "",
  strArtistClearart: "",
  strArtistWideThumb: "",
  strArtistFanart: "",
  strArtistFanart2: "",
  strArtistFanart3: "",
  strArtistFanart4: "",
  strArtistBanner: "",
  strMusicBrainzID: "",
  strISNIcode: null,
  strLastFMChart: "",
  intCharted: "",
  strLocked: "",
  strBiographyEN: "",
  strBiographyDE: "",
  strBiographyFR: "",
  strBiographyCN: "",
  strBiographyIT: "",
  strBiographyJP: "",
  strBiographyRU: "",
  strBiographyES: "",
  strBiographyPT: "",
  strBiographySE: "",
  strBiographyNL: "",
  strBiographyHU: "",
  strBiographyNO: "",
  strBiographyIL: "",
  strBiographyPL: "",
};
describe("getArtistInfo", () => {
  it("should return null if no artistName provided", async () => {
    expect.assertions(1);

    const result = await getArtistInfo(undefined);
    expect(result).toBeNull();
  });

  it("should call fetch", async () => {
    expect.assertions(1);
    // eslint-disable-next-line jest/prefer-spy-on
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => ({ artists: [artistInfo] }),
        ok: true,
      })
    ) as unknown as () => Promise<Response>;

    const result = await getArtistInfo("artistName");
    expect(result).toStrictEqual({ artists: [artistInfo] });
  });
  it("should return null if response is not ok", async () => {
    expect.assertions(1);
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn(() => ({ artists: [artistInfo] })),
      ok: false,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => ({ artists: [artistInfo] }),
        ok: false,
      })
    ) as unknown as () => Promise<Response>;

    const result = await getArtistInfo("artistName");
    expect(result).toBeNull();
  });
});
