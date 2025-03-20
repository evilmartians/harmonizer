import { invariant } from "@core/utils/assertions/invariant";

const createButton = document.querySelector("#create");
const textarea = document.querySelector("textarea");
const cancelButton = document.querySelector("#cancel");

invariant(createButton, "Create button not found");
invariant(textarea, "Textarea not found");
invariant(cancelButton, "Cancel button not found");

window.addEventListener("message", (event) => {
  const paletteExists = event.data.pluginMessage.paletteExists;
  createButton.textContent = paletteExists ? "Update palette" : "Create palette";
});

createButton.addEventListener("click", () => {
  parent.postMessage({ pluginMessage: { type: "create-palette", json: textarea.value } }, "*");
});

cancelButton.addEventListener("click", () => {
  parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
});
