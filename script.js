function setStyle(containerId, property, value) {
  const container = document.getElementById(containerId);
  if (container) {
    container.style[property] = value;
  }
}
