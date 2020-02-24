// My css.d.ts file
import * as CSS from 'csstype';

declare module 'csstype' {
  interface PropertiesFallback {
    className?: string;
    // ...or allow any other property
    [key: string]:
      | string
      | number
      | (string | number)[]
      | PropertiesFallback
      | undefined;
  }
}
