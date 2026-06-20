// Live OSS contributions -- fetched from GitHub, never hardcoded.
// Source of truth is the GitHub search API, so the site can't claim a PR is
// merged when it isn't. Status is shown as it actually is.
//
// Cache for 1 hour (GitHub unauthenticated search is rate-limited).
export const revalidate = 3600;

const USERNAME = "CrypticCortex";

// Which statuses to surface. "merged" and "open" only by default --
// abandoned/closed-unmerged PRs are not paraded. Set to ["merged"] for
// merged-only.
const SHOW = ["merged"];


function relativeTime(isoString) {
  if (!isoString) return "n/a";
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 60) return diffSec + "s ago";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return diffMin + "m ago";
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + "h ago";
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return diffDay + "d ago";
  const diffMo = Math.floor(diffDay / 30);
  if (diffMo < 12) return diffMo + "mo ago";
  return Math.floor(diffMo / 12) + "y ago";
}


export async function GET() {
  try {
    const headers = { Accept: "application/vnd.github.v3+json" };
    // Optional: set GITHUB_TOKEN in the deploy env to raise rate limits.
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = "Bearer " + process.env.GITHUB_TOKEN;
    }

    const query = encodeURIComponent("type:pr author:" + USERNAME);
    const res = await fetch(
      "https://api.github.com/search/issues?q=" + query + "&per_page=100&sort=created&order=desc",
      { next: { revalidate: 3600 }, headers }
    );

    if (!res.ok) {
      return Response.json({ error: "GitHub API error", items: [] }, { status: 502 });
    }

    const data = await res.json();
    const rawItems = Array.isArray(data.items) ? data.items : [];

    const items = rawItems
      .map((pr) => {
        // repository_url -> https://api.github.com/repos/{owner}/{name}
        const parts = (pr.repository_url || "").split("/repos/")[1] || "";
        const [owner, name] = parts.split("/");
        const merged = pr.state === "closed" && pr.pull_request && pr.pull_request.merged_at;
        const status = merged ? "merged" : pr.state === "open" ? "open" : "closed";
        return {
          owner,
          repo: name,
          fullName: owner && name ? owner + "/" + name : pr.repository_url,
          title: pr.title,
          number: pr.number,
          url: pr.html_url,
          status,
          when: relativeTime(merged ? pr.pull_request.merged_at : pr.created_at),
          ts: new Date(merged ? pr.pull_request.merged_at : pr.created_at).getTime(),
        };
      })
      // Only external contributions -- drop PRs to your own repos/forks.
      .filter((pr) => pr.owner && pr.owner.toLowerCase() !== USERNAME.toLowerCase())
      .filter((pr) => SHOW.includes(pr.status));

    // Merged first, then open; newest first within each group.
    const rank = { merged: 0, open: 1, closed: 2 };
    items.sort((a, b) => (rank[a.status] - rank[b.status]) || (b.ts - a.ts));

    return Response.json({
      mergedCount: items.filter((i) => i.status === "merged").length,
      openCount: items.filter((i) => i.status === "open").length,
      items,
    });
  } catch (err) {
    return Response.json({ error: "Failed to fetch OSS data: " + err.message, items: [] }, { status: 500 });
  }
}
