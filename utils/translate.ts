import { translationApi } from "./environment";
import { handleJsonResponse } from "./handleJsonResponse";
import { Locale } from "./locale";

export async function translate<T>(
  value: string | string[] | T,
  targetLanguage: Locale
): Promise<T | null> {
  if (!translationApi) {
    console.error("env variable TRANSLATION_API is not set");
    return null;
  }
  try {
    const response = await fetch(translationApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        targetLanguage,
      }),
    });

    const data = await handleJsonResponse<T>(response);
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
