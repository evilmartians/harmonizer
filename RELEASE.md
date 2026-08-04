# Releasing Harmonizer

The plugin ships in two parts that move on different clocks.

- **The UI** is served from `https://harmonizer.evilmartians.com/plugin/`. It redeploys on
  every push to `main`. No Figma publish needed.
- **The sandbox** is the code that runs inside Figma and draws the palette. It is frozen
  inside the published plugin. It only changes when you publish a new version from the
  Figma desktop app, and it cannot be patched afterwards.

Most changes are UI changes and need no publish at all.

## Which release do I need?

Two different things live behind the publish, and they fail in different ways. Work out
which one your change touches before you decide.

### 1. Code bundled into the sandbox

This is the code that actually ships inside the published plugin.

| Path                                              | What it is                               |
| ------------------------------------------------- | ---------------------------------------- |
| `packages/figma-plugin/src/plugin/**`             | The sandbox itself, including `shell.ts` |
| `packages/figma-plugin/figma.manifest.ts`         | Manifest and `allowedDomains`            |
| `packages/core/src/schemas/brand.ts`              | `HueIndex` / `LevelIndex` constructors   |
| `packages/core/src/utils/assertions/invariant.ts` | `invariant`                              |

To check what the sandbox pulls in today:

```sh
grep -rn 'from "@core' packages/figma-plugin/src/plugin/
```

Ignore the `import type` lines there, they ship nothing. What is left is the bundled set,
and those files bring their own imports along, npm packages included.

**How this fails: it goes stale, quietly.** Users keep running the old sandbox until you
publish. Nothing breaks, your change just does not arrive. So a publish here is about
shipping, not about safety, and you can batch several changes into one publish.

### 2. The wire format

This is the shape of the data the UI sends the sandbox, not code that ships.

| Path                                        | What it defines                    |
| ------------------------------------------- | ---------------------------------- |
| `packages/figma-plugin/src/shared/types.ts` | The messages and their payloads    |
| `packages/core/src/schemas/exportConfig.ts` | `ExportConfig`, sent on every draw |
| `packages/core/src/schemas/settings.ts`     | `ExportConfig["settings"]`         |
| `packages/core/src/types.ts`                | `IndexedColors` key format         |

**How this fails: it breaks users, silently.** A merge deploys the new UI to everyone at
once, while the matching sandbox only arrives after you publish. In between, a fresh UI is
talking to the old sandbox. `src/shared/wireContract.ts` is the compile-time guard on this,
and it is why the type check runs in CI. See "Wire-breaking changes" for the safe order.

Everything else (the whole `src/ui` tree, the rest of `packages/core`, the web app) ships
with a normal deploy and needs no publish at all.

## The order rule

**Deploy the UI first, publish second. Always.**

When you publish, every installed plugin switches to the new sandbox on its next open. If
the UI it expects is not live yet, you break every user at once, and the only fix is
another publish.

## Release A: UI only

Nothing special. Merge to `main`.

The merge workflow runs the type check, builds the web app, builds the plugin UI, runs the
smoke test, then deploys. If any step fails, nothing is deployed.

After the deploy, open the plugin in Figma and confirm your change is there. Users get it
on their next open, with no reinstall.

## Checking a PR inside Figma before merge

Every PR deploys to a Firebase preview channel, and that channel serves `/plugin/` with the
same headers as production. So you can point Figma at a PR's real hosted UI and try it for
real before it reaches `main`, instead of trusting the local dev server.

Two things would normally block this: the sandbox has the UI address compiled in, and Figma
refuses any host the manifest does not list. One command handles both.

**1. Get the preview URL.** The deploy workflow posts it as a comment on the PR. It stays
the same for the life of the PR, so later pushes reuse it.

**2. Build the sandbox against it:**

```sh
pnpm figma:preview https://harmonizer-web--pr71-figma-automatic-rele-6599csx2.web.app
```

Paste whatever the PR comment gives you. Anything after the host is trimmed, so a full link
to the page works too. The command writes that URL into the sandbox, adds the host to
`devAllowedDomains` in the generated `manifest.json`, and then watches for changes.
`figma.manifest.ts` itself is never touched, so nothing can leak into the published
manifest.

**3. In the Figma desktop app**, import `packages/figma-plugin/dist/manifest.json` as a
plugin in development and run it. Only the sandbox now comes from your machine. Everything
else is the deployed build, over the real network, framed by Figma.

**4. Nothing to undo.** No file changed, so there is nothing to remember to revert. The
override lives only for as long as that command runs.

**Afterwards, rebuild before you publish.** Like any development build, this leaves a
`dist/plugin.js` pointing somewhere that is not the live site. Step 4 of Release B covers
this, and a production build is the fix.

The URL cannot leak into a published plugin. A production build ignores the override
entirely, so `pnpm figma build:plugin`, the command used to publish, is always safe.

To check the preview's headers without Figma:

```sh
curl -sI https://harmonizer-web--pr71-figma-automatic-rele-6599csx2.web.app/plugin/index.html
```

## Release B: sandbox change

### 1. Prepare

If the wire between the UI and the sandbox changed, `src/shared/wireContract.ts` stops
compiling. Read the comment at the top of that file before you change it. It is the only
thing that catches a UI/sandbox mismatch, which otherwise fails silently in a user's Figma.

Bump `SANDBOX_VERSION` in `packages/figma-plugin/src/plugin/version.ts` by one. Do this
once per publish, not per commit.

Do **not** raise `MIN_SUPPORTED_SANDBOX_VERSION` in `src/ui/main.tsx` yet. See
"Wire-breaking changes" below.

### 2. Check it in Figma locally

```sh
pnpm figma dev
```

In the Figma desktop app, import `packages/figma-plugin/dist/manifest.json` as a plugin in
development, then run it. Confirm:

- Figma accepts the manifest
- the UI loads and the palette appears
- your sandbox change does what you expect
- generating a palette still draws the right background

### 3. Merge to `main`

This deploys the UI. Confirm the live page is healthy:

```sh
curl -sI https://harmonizer.evilmartians.com/plugin/index.html
```

Look for `cache-control: no-store` and a `content-security-policy` with
`frame-ancestors`. Without the second one, Figma renders a blank window with no error.

### 4. Build for publish

```sh
git checkout main && git pull
pnpm figma build:plugin
```

**This step is not optional.** `pnpm figma dev` leaves a `dist/plugin.js` that points at
`http://localhost:5174`, and `pnpm figma:preview` leaves one pointing at a preview channel.
Publishing either ships a plugin that does not work for anyone. The production build points
at the live URL.

Build from a clean, up-to-date `main`. The build stamps the git short SHA into
`SANDBOX_BUILD`, which is what a support request needs to identify the exact published
build.

### 5. Publish

In the Figma desktop app, open the plugin's development entry, which points at
`packages/figma-plugin/dist/manifest.json`, and publish a new version. Write release notes
that describe the user-visible change.

### 6. Verify

Open the plugin from the Figma community listing (not the development entry) and generate
a palette.

Then push a small UI change and confirm it reaches the installed plugin with no publish.
That proves the deploy loop still works.

## Wire-breaking changes

A change that the old sandbox cannot understand takes **two merges**, because merging
deploys the UI to everyone at once while the new sandbox only arrives after you publish.

1. **Merge 1:** change the sandbox, and keep the UI working with both the old and the new
   sandbox. Deploy, then publish (steps above). Between the merge and the publish, every
   user is running a fresh UI against the old sandbox, so this compatibility is what keeps
   them working.
2. **Merge 2:** once the publish is live, raise `MIN_SUPPORTED_SANDBOX_VERSION` in
   `src/ui/main.tsx` and delete the old path from the UI.

Wait a while between the two. Figma updates plugins on its own, but only when the user
next opens one.

Always put the compatibility code in the UI. It is the only side you can still fix.

## If a release goes wrong

- **Bad UI deploy:** revert the commit and push. The next deploy fixes every user.
- **Bad sandbox publish:** there is no rollback. You must publish again. If the UI can work
  around the broken sandbox, deploy that first, since it lands in minutes instead of
  waiting on a Figma review.
- **"Couldn't reach Harmonizer" with a Retry button:** the shell could not fetch the UI at
  all. Hosting is down, or the deploy wiped `/plugin/`. Check the build order in the deploy
  workflow: the web build empties `packages/web-app/dist` and must run before the plugin
  UI build.
- **"Harmonizer couldn't start":** the UI was reachable but never completed the handshake
  within 30 seconds. The page loaded and then failed, or something else was served in its
  place. Open the plugin's console and work from there. Note that a catch-all hosting
  rewrite answers _any_ wrong path with 200 and the web app, so "reachable" does not mean
  "correct": confirm `/plugin/index.html` returns the plugin page, not the web app.
- **The plugin window is blank and stays blank:** it should become one of the two screens
  above. If it does not, the sandbox itself failed before it could show anything. Check the
  frame-ancestors header on `/plugin/index.html`.
