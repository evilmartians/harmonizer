/**
 * The only UI markup shipped inside the published plugin. Everything else is served from
 * __UI_URL__ and can be redeployed without a Figma publish, so this file is deliberately tiny:
 * whatever lands here is frozen until the next publish and cannot be patched remotely.
 *
 * It probes the UI with fetch before navigating. A bare `location.href` would hand a failed
 * load to the browser's own error page, which replaces this document and takes the retry
 * affordance with it.
 *
 * The probe is deliberately `no-cors`, so it depends on no response header. Anything it relied
 * on could be dropped from hosting config later, and this file could not be fixed to cope. An
 * opaque response only reports reachability, which is the failure worth catching here.
 */
const LOAD_TIMEOUT_MS = 8000;

const PAGE_STYLE = `
  :root { color-scheme: light dark; }
  body {
    margin: 0;
    height: 100vh;
    display: grid;
    place-items: center;
    font: 12px/1.5 "Inter", system-ui, sans-serif;
    color: var(--figma-color-text, #333);
    background: var(--figma-color-bg, #fff);
  }
  #state { text-align: center; padding: 24px; }
`;

/**
 * Shown when the UI never completes the handshake. By then this document has been replaced by
 * the remote page, so the sandbox owns this screen; see the timeout in index.ts. It is plain
 * text with no retry, because the sandbox cannot re-run the shell's load from here.
 */
export const startupErrorHtml = `
<!doctype html>
<style>${PAGE_STYLE}</style>
<div id="state">
  <div>Harmonizer couldn't start.</div>
  <div>Check your connection, then close and reopen the plugin.</div>
</div>
`;

export const shellHtml = `
<!doctype html>
<style>
  ${PAGE_STYLE}
  #error { display: none; }
  #retry {
    margin-top: 12px;
    padding: 6px 14px;
    font: inherit;
    color: var(--figma-color-text-onbrand, #fff);
    background: var(--figma-color-bg-brand, #0d99ff);
    border: 0;
    border-radius: 6px;
    cursor: pointer;
  }
  [data-failed] #loading { display: none; }
  [data-failed] #error { display: block; }
</style>
<div id="state">
  <div id="loading">Loading Harmonizer...</div>
  <div id="error">
    <div>Couldn't reach Harmonizer.</div>
    <div>Check your connection and try again.</div>
    <button id="retry" type="button">Retry</button>
  </div>
</div>
<script>
  (function () {
    var url = ${JSON.stringify(__UI_URL__)};
    var timeout = ${LOAD_TIMEOUT_MS};

    function load() {
      document.body.removeAttribute("data-failed");

      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, timeout);

      fetch(url, { cache: "no-store", mode: "no-cors", signal: controller.signal })
        .then(function () {
          clearTimeout(timer);
          window.location.href = url;
        })
        .catch(function () {
          clearTimeout(timer);
          document.body.setAttribute("data-failed", "");
        });
    }

    document.getElementById("retry").addEventListener("click", load);
    load();
  })();
</script>
`;
