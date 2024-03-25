export function parseAcceptLanguage(acceptLanguage = ""): string[] {
  const languages = acceptLanguage.split(",").map((lang) => {
    const [code, q = "1"] = lang.trim().split(";q=");
    return { code: code.trim(), q: parseFloat(q) };
  });

  return languages.toSorted((a, b) => b.q - a.q).map(({ code }) => code);
}
