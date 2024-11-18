export async function loadGoogleFont(font: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(url)).text();
  const resource = RegExp(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  ).exec(css);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("Failed to load font data");
}
