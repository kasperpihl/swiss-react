const stylesById = {};

export function addStylesForUniqueId(uniqueId, el, styles) {
  stylesById[uniqueId] = {
    el,
    styles
  };
}

export function getStylesForUniqueId(uniqueId) {
  return stylesById[uniqueId] || {};
}