export function getScrollbarWidth() {
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";

  const inner = document.createElement("div");
  outer.appendChild(inner);

  document.body.appendChild(outer);
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.remove();

  return scrollbarWidth;
}
