export function parseAcceptLanguage(acceptLanguage = ""): string[] {
  const languages = acceptLanguage.split(",").map((lang) => {
    const [code, q = "1"] = lang.trim().split(";q=");
    const baseCode = code.split("-")[0];
    return { code: baseCode.trim(), q: parseFloat(q) };
  });

  return languages
    .toSorted((a, b) => b.q - a.q)
    .map(({ code }) => code)
    .filter((code, index, self) => self.indexOf(code) === index);
}
