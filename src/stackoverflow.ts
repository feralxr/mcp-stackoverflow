// Stack Overflow API v2.3 wrapper
// Docs: https://api.stackexchange.com/docs
// Free: 300 req/day unauthenticated, 10,000/day with key

const BASE = "https://api.stackexchange.com/2.3";
const KEY = process.env.SO_API_KEY || "";
const SITE = "stackoverflow";

function buildUrl(path: string, params: Record<string, any> = {}): string {
  const p: Record<string, string> = { site: SITE, filter: "withbody", ...params };
  if (KEY) p.key = KEY;
  // Remove undefined/null
  Object.keys(p).forEach(k => (p[k] === undefined || p[k] === null) && delete p[k]);
  return `${BASE}${path}?${new URLSearchParams(p as Record<string, string>).toString()}`;
}

export async function soFetch(path: string, params: Record<string, any> = {}): Promise<any> {
  const url = buildUrl(path, params);
  const res = await fetch(url, {
    headers: { "Accept-Encoding": "gzip" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SO API error ${res.status}: ${text}`);
  }

  const data = await res.json() as any;

  if (data.error_id) {
    throw new Error(`SO API error ${data.error_id}: ${data.error_message}`);
  }

  return data;
}

// Strip HTML tags from SO body content
export function stripHtml(html: string = ""): string {
  return html
    .replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, "[code block]")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .trim();
}

export function truncate(str: string = "", max = 800): string {
  return str.length > max ? str.slice(0, max) + "..." : str;
}
