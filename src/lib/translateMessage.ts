import { config } from "../config";

export async function translateMessage(message:string, language:string):Promise<string> {
  const res:Response = await fetch(config.TRANSLATOR_URL, {
    method: "POST",
    body: JSON.stringify({
      q: message,
      source: "en",
      target: language,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const responseContent = await res.json();

  return responseContent.translatedText;
}
