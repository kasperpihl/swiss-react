export default class DomHandler {
  constructor(id) {
    this.id = id;
    this.add();
  }
  append(newTextContent) {
    if (typeof document === 'undefined') {
      return;
    }
    if (!this._domEl) {
      this.add();
    }

    const newChildEl = document.createTextNode(newTextContent);
    this._domEl.appendChild(newChildEl);
  }
  add() {
    if (typeof document === 'undefined') {
      return;
    }
    this._domEl = document.getElementById(this.id);
    this._childEl =
      this._domEl && this._domEl.childNodes.length && this._domEl.childNodes[0];
    if (!this._domEl) {
      this._domEl = document.createElement('style');
      this._domEl.id = this.id;
      this._domEl.type = 'text/css';
      document.head.appendChild(this._domEl);
    }
  }
}
