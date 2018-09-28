import React from 'react';

export default class DomHandler {
  constructor(id) {
    this.id = `sw-${id}`;
    this.add();
  }
  getId() {
    return this.id;
  }
  getContent() {
    return this._childContent;
  }
  toString() {
    if (!this._childContent) {
      return '';
    }
    let string = `<style id="${this.id}" type="text/css">`;
    string += this._childContent;
    string += '</style>';
    return string;
  }
  toComponent() {
    if (!this._childContent) return null;

    return (
      <style id={this.id} type="text/css">
        {this._childContent}
      </style>
    );
  }
  update(newChildContent) {
    this._childContent = newChildContent;
    if (typeof document === 'undefined') {
      return;
    }
    if (!this._domEl) {
      this.add();
    }

    const newChildEl = document.createTextNode(newChildContent);

    if (this._childEl) {
      this._domEl.replaceChild(newChildEl, this._childEl);
    } else {
      this._domEl.appendChild(newChildEl);
    }
    this._childEl = newChildEl;
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
  remove() {
    this._childContent = null;
    if (typeof document === 'undefined') {
      return;
    }
    document.head.removeChild(this._domEl);
    this._domEl = null;
  }
}
