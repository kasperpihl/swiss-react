const domCache: {
  [key: string]: HTMLStyleElement;
} = {};

export function addToDom(id: string, css: string) {
  if (typeof document === 'undefined') {
    return;
  }

  let element = domCache[id];

  // Check if we hit the cache
  if (!element) {
    element = document.getElementById(id) as HTMLStyleElement;
    // Check if it exists in dom
    if (!element) {
      element = document.createElement('style');
      element.id = id;
      element.type = 'text/css';
      document.head.appendChild(element);
    }
    // Add to cache
    domCache[id] = element;
  }

  const newChildEl = document.createTextNode(css);
  element.appendChild(newChildEl);
}
