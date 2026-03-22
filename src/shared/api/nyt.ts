import type { Article } from "../types";

const SECTIONS = [
  "World",
  "U.S.",
  "Science",
  "Technology",
  "Health",
  "Business",
  "Arts",
  "Travel",
];

export async function fetchArticles(
  apiKey: string,
  count: number
): Promise<Article[]> {
  const section = SECTIONS[Math.floor(Math.random() * SECTIONS.length)];
  const url = new URL(
    "https://api.nytimes.com/svc/search/v2/articlesearch.json"
  );
  url.searchParams.set("api-key", apiKey);
  url.searchParams.set("fq", `section_name:("${section}")`);
  url.searchParams.set("sort", "newest");
  url.searchParams.set("fl", "web_url,headline,abstract,lead_paragraph,snippet,section_name,pub_date,uri");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`NYT API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const docs = data.response?.docs ?? [];

  return docs.slice(0, count).map(
    (doc: {
      uri: string;
      headline: { main: string };
      abstract: string;
      web_url: string;
      lead_paragraph: string;
      snippet: string;
      section_name: string;
      pub_date: string;
    }): Article => ({
      id: doc.uri,
      headline: doc.headline?.main ?? "Untitled",
      abstract: doc.abstract ?? "",
      url: doc.web_url,
      body: doc.lead_paragraph || doc.snippet || "",
      section: doc.section_name ?? section,
      publishedDate: doc.pub_date,
      readAt: null,
    })
  );
}
