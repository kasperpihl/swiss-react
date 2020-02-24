import React, { ReactNode, useMemo } from 'react';
import { createStyleContext } from './utils/createStyleContext';
import { StyleContext } from './utils/StyleContext';

export interface IStyleProviderProps {
  children: ReactNode;
}

export const StyleProvider = ({ children }: IStyleProviderProps) => {
  const sContext = useMemo(() => createStyleContext(), []);

  return (
    <StyleContext.Provider value={sContext}>{children}</StyleContext.Provider>
  );
};
