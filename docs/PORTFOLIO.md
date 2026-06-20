# Portfolio Change Protocol

The standard for changing this site. Exists because the portfolio drifted into
13 design variants across 3 repos and "redesign" became the default unit of
change. This file makes the portfolio obey the same discipline as the rest of
the system: single source of truth, content/data separation, define-done, a
changelog. Read this before touching anything.

## The five rules

1. **One canonical repo.** `portfolio-site/` is live (crypticcortex.vercel.app),
   so it is the only repo that deploys. Experiments never live next to it. The
   old variant repos belong in `~/coding/.archive/` or a clearly-marked
   `design-lab/`, never in the deploy path.

2. **Content is data, never code.** All copy lives in `src/lib/data.js`.
   `src/app/page.js` is a pure renderer -- it maps over data and owns layout +
   animation only. If you are editing a sentence inside `page.js`, stop: that
   string belongs in `data.js`.

3. **data.js derives from upstream, one direction.** The canonical narrative
   lives in `~/.claude/agam/MUGAM.md`, `~/coding/career-ops/config/profile.yml`,
   and `~/coding/career-ops/cv.md`. Edit positioning THERE first, then sync the
   delta down into `data.js`. The site is never a competing identity doc.

4. **Classify every change -- three lanes.** Name the lane before you start:
   - **content** (copy, metrics, a project): edit `data.js` only. No design
     talk. This is ~90% of changes.
   - **component** (a section's layout/behavior): edit one component. Log a
     one-line reason below.
   - **redesign** (new aesthetic): write done-criteria FIRST (see below) and a
     reason the current design fails. No criteria = not allowed. Should fire
     almost never.

5. **Log it.** Every change gets a dated line in the Changelog. Every redesign
   pastes its done-criteria here before work starts.

6. **No unverifiable static claims.** Anything with a status that can drift or
   inflate -- OSS PRs, GitHub stats, star counts, "merged" labels -- is fetched
   live or it does not go on the site. Never hardcode "merged into X" as a
   static string; it rots and it lies. If it can't be fetched live, it must be
   dated and personally verified. (Why this rule exists: the OSS section once
   risked listing filed-but-unmerged PRs as contributions. Now `/api/oss` pulls
   real status from GitHub and shows merged vs in-review as it actually is.)

## The loop

```
1. edit narrative upstream (profile.yml / MUGAM.md) if positioning changed
2. sync the delta into data.js
3. npm run dev -> eyeball the affected section -> npm run build
4. log one line in this file -> deploy
```

## Upstream -> data.js mapping

| data.js export   | Upstream source of truth                          |
|------------------|---------------------------------------------------|
| meta, hero       | MUGAM.md (one-liner, archetypes)                  |
| experiences      | cv.md (Experience), profile.yml (proof_points)    |
| projects         | MUGAM.md proof points, cv.md (Projects)           |
| openSource (TODO)| profile.yml proof_points, cv.md (Open Source)     |
| papers           | cv.md (Research)                                   |
| skillCategories, skills | cv.md (Skills)                             |
| achievements, education | cv.md (Education, Certifications)           |

## Done-criteria (lock before any redesign)

A redesign is not "done" until ALL are true. Copy this block, fill it, before
opening the editor:

- [ ] Title reads "AI Engineer" everywhere; no "Software Engineer I".
- [ ] agam (OSS) + an Open Source contributions section are live with links.
- [ ] Every Guidewire bullet has a number or a decision, not a feature list.
- [ ] Paper count is consistent and the MedGPT number is verified.
- [ ] Hero states the research + production + OSS trifecta and an availability line.
- [ ] CV PDF is one click from the page.

## Content backlog (the actual job)

Structure is now standardized. These are the content changes that make the site
do its job (land interviews). Each is a **content** lane edit -- `data.js` only,
derived from profile.yml. Do these next; do not start a redesign instead.

1. ~~Drop "Software Engineer I" -> "AI Engineer"~~ DONE.
2. ~~Add `agam` as a featured project~~ DONE (Cognitive OS demoted to normal card).
3. ~~Add an `openSource` array + section~~ DONE differently: built `/api/oss`
   which fetches PR status live from GitHub (merged-only, external repos only).
   No hardcoded contribution claims -- see Rule 6.
4. ~~Swap Guidewire feature-lists for outcome metrics from cv.md~~ DONE
   (latency 30s->21s, multi-judge eval 5x5x5 95% CI, LLM-out-of-booking FSM).
   Hexon bullet also reframed to the ~20% cost-cut outcome.
5. DONE: MedGPT 30->80% verified true by Kalyan (2026-06-20); stays prominent.
   Papers: site shows 5 published + 1 underway; cv.md/profile.yml say 6 published.
   Site stays conservative (5+1) until the 6th is confirmed published.
6. PENDING: availability line + CV PDF link in hero/contact.

## Changelog

```
2026-06-20 | component | Extracted hero/experience-intro/skills/contact copy from page.js into data.js. No visual change. Established this protocol.
2026-06-20 | component | Added Rule 6 (no unverifiable static claims). Built /api/oss live GitHub PR fetch + Open Source section (merged-only, external repos, 1h cache, optional GITHUB_TOKEN). Nothing hardcoded.
2026-06-20 | content   | Role Software Engineer I -> AI Engineer. Guidewire bullets swapped to outcome metrics (latency, multi-judge eval, FSM booking). Hexon reframed to ~20% cost cut. agam added as featured project; Cognitive OS demoted. All sourced from cv.md. MedGPT left unchanged pending verification.
```
