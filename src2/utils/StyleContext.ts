import { useContext, createContext } from 'react';
import { StyleContextObject } from './createStyleContext';

export const StyleContext = createContext<StyleContextObject | null>(null);

export const useStyleContext = () => {
  const context = useContext(StyleContext);
  if (!context) {
    throw Error('StyleProvider missing...');
  }
  return context;
};
