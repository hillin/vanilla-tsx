# vanilla-tsx
TSX support to generate vanilla document.createElement code.

TSX, or [Typescript JSX](https://www.typescriptlang.org/docs/handbook/jsx.html), is the Typescript flavor of JSX which was made popular by the React framework. It allows developers to write XML/HTML code along with Typescript code, making DOM generation much easier.

Typescript has built-in React JSX support, but it can also utilize a customized JSX factory method to generate code for non-React context. vanilla-tsx is such a JSX factory which utilizes the *vanilla* `document.createElement` function to generate DOM.

## Getting Started

1. Get vanilla-tsx on [npm](https://www.npmjs.com/package/vanilla-tsx).

2. In your Typescript project, open your *tsconfig.json* file, add the following code:

   ```json
   {
     "compilerOptions": {
         /* ... */
         "jsx": "react",  /* <-- add this line */
     }
     /* ... */
   }
   ```

3. Open or create a *.tsx* file, add the following code to the beginning:

   ```typescript
   /** @jsx JsxFactory */
   import { JsxFactory } from "vanilla-tsx";
   ```

4. Now you can write TSX code, and all DOM elements will be generated with `document.createElement` (and `document.createElementNS` for SVG elements).

## Features

- Generate DOM elements with `document.createElement`
- Generate SVG elements with `document.createElementNS`
- Generate event handling code for attributes whose name matches `onEventName`
- Support custom function tag
- Correctly generate valueless attributes (e.g. `<input disable />`)
- Fix attribute generation for `vector-effect`