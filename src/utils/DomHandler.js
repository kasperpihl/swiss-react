export default class DomHandler {
  constructor(id) {
    if(typeof document === 'undefined') {
      return;
    }

    this._domEl = document.createElement('style');
    this._domEl.type = 'text/css';
    this._domEl.className = 'swiss-style';
    this._domEl.id = `swiss-style-${id}`;

  }
  update(newChildContent) {
    if(typeof document === 'undefined') {
      return;
    }

    const newChildEl = document.createTextNode(newChildContent);

    if(this._childEl) {
      this._domEl.replaceChild(newChildEl, this._childEl);
    } else {
      this._domEl.appendChild(newChildEl);
    }
    this._childEl = newChildEl;
  }
  add() {
    if(typeof document === 'undefined') {
      return;
    }
    document.head.appendChild(this._domEl);
  }
  remove() {
    if(typeof document === 'undefined') {
      return;
    }
    document.head.removeChild(this._domEl);
  }
}