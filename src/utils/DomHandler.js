 export default class DomHandler {
  constructor(id) {
    this.id = `swiss-style-${id}`;
    this.type = 'text/css';
    this.className = 'swiss-style';
  }
  createElement() {
    this._domEl = document.getElementById(this.id);
    if(!this._domEl) {
      this._domEl = document.createElement('style');
    }
    this._domEl.type = this.type;
    this._domEl.className = this.className;
    this._domEl.id = this.id;
  }
  toString() {
    if(!this.isOn || !this._childContent) {
      return null;
    }
    let string = `<style type="${this.type}" class="${this.className}" id="${this.id}">`;
    string += this._childContent;
    string += '</style>';
    return string;
  }
  update(newChildContent) {
    this._childContent = newChildContent;
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
    this.isOn = true;
    if(typeof document === 'undefined') {
      return;
    }
    if(!this._domEl) {
      this.createElement();
    }
    document.head.appendChild(this._domEl);
  }
  remove() {
    this.isOn = false;
    if(typeof document === 'undefined') {
      return;
    }
    document.head.removeChild(this._domEl);
    this._domEl = null;
  }
}