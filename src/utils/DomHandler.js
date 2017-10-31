 export default class DomHandler {
  constructor(id) {
    this.id = `swiss-style-${id}`;
    this.type = 'text/css';
    this.className = 'swiss-style';
    if(typeof document !== 'undefined') {
      return;
    }
  }
  createElement() {
    this._domEl = document.createElement('style');
    this._domEl.type = this.type;
    this._domEl.className = this.className;
    this._domEl.id = this.id;
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
    if(typeof document === 'undefined' || this._domEl) {
      return;
    }
    if(!this._domEl) {
      this.createElement();
    }
    document.head.appendChild(this._domEl);
  }
  remove() {
    if(typeof document === 'undefined' || !this._domEl) {
      return;
    }
    document.head.removeChild(this._domEl);
    this._domEl = null;
  }
}