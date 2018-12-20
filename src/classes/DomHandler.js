export default class DomHandler {
  constructor(id) {
    this.add(id);
  }
  append(newTextContent) {
    if (typeof document === 'undefined') {
      return;
    }

    const newChildEl = document.createTextNode(newTextContent);
    this._domEl.appendChild(newChildEl);
  }
  add(id) {
    if (typeof document === 'undefined') {
      return;
    }
    this._domEl = document.getElementById(id);
    if (!this._domEl) {
      this._domEl = document.createElement('style');
      this._domEl.id = id;
      this._domEl.type = 'text/css';
      document.head.appendChild(this._domEl);
    }
  }
}
