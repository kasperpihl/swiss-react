# swiss-react

A simple CSS-in-js solution made for a Typescript world 💙

Separating components from styles again 🎂

## Installation

```shell
npm i swiss-react
```

## Demo

I've made a Codesandbox to play around with

- [Codesandbox](https://codesandbox.io/s/friendly-swartz-5hyyt)

## Usage

First create a stylesheet

```typescript
// App.styles.ts
import { createStyles } from 'swiss-react';

export default createStyles('App', () => ({
  Wrapper: () => ({
    display: 'flex'
  })
}));
```

Then use it in your component

```typescript
import React from 'react';
import AppStyles from './App.styles.ts';
import { useClassNames } from 'swiss-react';

function App() {
  const c = useClassNames(styles);

  return <div className={c.wrapper()}>Hi</div>;
}
```
