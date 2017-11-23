 export default class DomHandler {
  constructor(id, prettyName) {
    this.id = `sw${id}`;
    this.type = 'text/css';
    this.prettyName = prettyName;
    this.className = 'swiss-style';
  }
  toString() {
    if(!this._childContent) {
      return null;
    }
    const prettyName = this.prettyName ? `data-name="${this.prettyName}" `: '';
    let string = `<style type="${this.type}" ${prettyName}class="${this.className}" id="${this.id}">`;
    string += this._childContent;
    string += '</style>';
    return string;
  }
  update(newChildContent) {
    this._childContent = newChildContent;
    if(typeof document === 'undefined') {
      return;
    }
    if(!this._domEl) {
      this.add();
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
    this._domEl = document.getElementById(this.id);
    this._childEl = this._domEl && this._domEl.childNodes.length && this._domEl.childNodes[0];
    if(!this._domEl) {
      this._domEl = document.createElement('style');
      this._domEl.type = this.type;
      this._domEl.className = this.className;
      if(this.prettyName) {
        this._domEl['data-name'] = this.prettyName;
      }
      this._domEl.id = this.id;
      document.head.appendChild(this._domEl);
    }
    
  }
  remove() {
    this._childContent = null;
    if(typeof document === 'undefined') {
      return;
    }
    document.head.removeChild(this._domEl);
    this._domEl = null;
  }
}