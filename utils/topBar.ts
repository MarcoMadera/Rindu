interface ICalculateBannerOpacity {
  scrollTop: number;
}

export function calculateBannerOpacity({
  scrollTop,
}: ICalculateBannerOpacity): number {
  const rawPercentage = (scrollTop + -55) / 223;
  return rawPercentage;
}

interface ICalculateHeaderOpacityPercentage {
  scrollTop: number;
  disableOpacityChange: boolean;
  displayOnFixed: boolean;
  disableBackground: boolean;
}

export function calculateHeaderOpacityPercentage({
  scrollTop,
  disableOpacityChange,
  displayOnFixed,
  disableBackground,
}: ICalculateHeaderOpacityPercentage): number {
  const rawPercentage = (scrollTop + -55) / 223;
  const isOpacityDelayed =
    disableOpacityChange && !displayOnFixed && rawPercentage < 0.5;
  if (rawPercentage < 0 || isOpacityDelayed || disableBackground) {
    return 0;
  } else if (rawPercentage >= 1) {
    return 1;
  } else {
    return rawPercentage;
  }
}

interface ISetOpacityStyles {
  disableBackground: boolean;
  headerOpacityPercentage: number;
  bannerOpacity: number;
}

export function setOpacityStyles({
  headerOpacityPercentage,
  bannerOpacity,
}: ISetOpacityStyles): void {
  document.body.style.setProperty(
    "--header-opacity",
    headerOpacityPercentage.toString()
  );

  document.body.style.setProperty("--banner-opacity", bannerOpacity.toString());
}
