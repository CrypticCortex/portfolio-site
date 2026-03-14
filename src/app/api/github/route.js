// Cache for 1 hour
export const revalidate = 3600;

const USERNAME = "CrypticCortex";


// Turn an ISO timestamp into a relative string like "2h ago" or "3d ago"
function relativeTime(isoString) {
  if (!isoString) return "n/a";

  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return diffSec + "s ago";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return diffMin + "m ago";
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + "h ago";
  const diffDay = Math.floor(diffHr / 24);
  return diffDay + "d ago";
}


export async function GET() {
  try {
    const [userRes, eventsRes] = await Promise.all([
      fetch("https://api.github.com/users/" + USERNAME, {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github.v3+json" },
      }),
      fetch(
        "https://api.github.com/users/" + USERNAME + "/events/public?per_page=10",
        {
          next: { revalidate: 3600 },
          headers: { Accept: "application/vnd.github.v3+json" },
        }
      ),
    ]);

    if (!userRes.ok || !eventsRes.ok) {
      return Response.json(
        { error: "GitHub API returned an error" },
        { status: 500 }
      );
    }

    const user = await userRes.json();
    const events = await eventsRes.json();

    const pushEvents = events.filter((e) => e.type === "PushEvent");
    const lastPush = pushEvents.length > 0 ? pushEvents[0].created_at : null;

    return Response.json({
      public_repos: user.public_repos,
      followers: user.followers,
      last_push_at: relativeTime(lastPush),
      recent_commits_count: pushEvents.length,
    });
  } catch (err) {
    return Response.json(
      { error: "Failed to fetch GitHub data: " + err.message },
      { status: 500 }
    );
  }
}
