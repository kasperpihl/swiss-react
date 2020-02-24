import { addToDom } from './addToDom';

export interface StyleContextObject {
  getUniqueClassName: (symbol: symbol, name: string) => string;
  appendCss: (css: string) => void;
  didRender: () => void;
}

export const createStyleContext = (): StyleContextObject => {
  const symbolStore: any = {};
  const nameCounter: {
    [key: string]: number;
  } = {};

  let appendingCss: string[] = [];

  return {
    getInstance: (symbol: symbol) => {
      if (!symbolStore[symbol]) {
        // Ensure names are unique including lowercase
        const lName = name.toLowerCase();
        if (!nameCounter[lName]) {
          nameCounter[lName] = 0;
        }

        nameCounter[lName]++;

        const counter = nameCounter[lName];
        const uniqueName = `${name}${counter === 1 ? '' : counter}`;

        symbolStore[symbol] = {
          uniqueName,
          cacheRead,
          cacheWrite
        };
      }
    },
    getUniqueClassName: (symbol: symbol, name: string) => {
      if (!symbolStore[symbol]) {
        // Ensure names are unique including lowercase
        const lName = name.toLowerCase();
        if (!nameCounter[lName]) {
          nameCounter[lName] = 0;
        }

        nameCounter[lName]++;

        const counter = nameCounter[lName];
        symbolStore[symbol] = `${name}${counter === 1 ? '' : counter}`;
      }

      return symbolStore[symbol];
    },
    appendCss: (css: string) => {
      appendingCss.push(css);
    },
    didRender: () => {
      if (appendingCss.length) {
        addToDom('stylify-css', appendingCss.join('\r\n'));
        appendingCss = [];
      }
    }
  };
};
