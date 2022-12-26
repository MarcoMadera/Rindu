interface ICalculateBannerOpacity {
  scrollTop: number;
}

export function calculateBannerOpacity({
  scrollTop,
}: ICalculateBannerOpacity): number {
  const rawPercentage = (scrollTop + -55) / 223;
  if (rawPercentage < 0) {
    return 0;
  }
  if (rawPercentage >= 1) {
    return 1;
  }

  return rawPercentage;
}

interface ICalculateHeaderOpacityPercentage {
  scrollTop: number;
  disableOpacityChange: boolean;
  displayOnFixed: boolean;
  disableBackground: boolean;
}

export function calculateHeaderOpacity({
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
  }
  if (rawPercentage >= 1) {
    return 1;
  }

  return rawPercentage;
}

interface ISetOpacityStyles {
  headerOpacity: number;
  bannerOpacity: number;
}

export function setOpacityStyles({
  headerOpacity,
  bannerOpacity,
}: ISetOpacityStyles): void {
  document.body.style.setProperty("--header-opacity", headerOpacity.toString());
  document.body.style.setProperty("--banner-opacity", bannerOpacity.toString());
}
