interface ICalculateBannerOpacity {
  headerOpacityPercentage: number;
  alwaysDisplayColor: boolean;
  disableBackground: boolean;
  scrollTop: number;
}

export function calculateBannerOpacity({
  headerOpacityPercentage,
  alwaysDisplayColor,
  disableBackground,
  scrollTop,
}: ICalculateBannerOpacity): number {
  switch (true) {
    case headerOpacityPercentage > 1 || alwaysDisplayColor:
      return 1;
    case disableBackground && scrollTop > 223:
      return headerOpacityPercentage;
    default:
      return 0;
  }
}

interface ICalculateHeaderOpacityPercentage {
  scrollTop: number;
}

export function calculateHeaderOpacityPercentage({
  scrollTop,
}: ICalculateHeaderOpacityPercentage): number {
  const rawPercentage = (scrollTop + -55) / 223;
  if (rawPercentage < 0) {
    return 0;
  } else if (rawPercentage >= 1) {
    return 1;
  } else {
    return rawPercentage;
  }
}

interface ISetOpacityStyles {
  disableBackground: boolean;
  displayOnFixed: boolean;
  disableOpacityChange: boolean;
  headerOpacityPercentage: number;
  bannerOpacity: number;
}

export function setOpacityStyles({
  disableBackground,
  displayOnFixed,
  disableOpacityChange,
  headerOpacityPercentage,
  bannerOpacity,
}: ISetOpacityStyles): void {
  if (disableOpacityChange && !displayOnFixed) {
    document.body.style.setProperty("--header-opacity", "0");
  } else {
    document.body.style.setProperty(
      "--header-opacity",
      !disableBackground
        ? headerOpacityPercentage.toString()
        : bannerOpacity.toString()
    );
  }

  document.body.style.setProperty(
    "--banner-opacity",
    headerOpacityPercentage.toString()
  );
}
