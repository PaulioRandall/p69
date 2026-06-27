![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p69)](https://github.com/PaulioRandall/p69/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p69)](https://github.com/PaulioRandall/p69/releases)

# P69

**P69** resolves _P69 Tokens_ within CSS strings, i.e. it injects user defined values into placeholder tokens.

- **P69**: https://github.com/PaulioRandall/p69
- **P69 Files**: https://github.com/PaulioRandall/p69-files
- **P69 Svelte**: https://github.com/PaulioRandall/p69-svelte
- **P69 Util**: https://github.com/PaulioRandall/p69-util

## Basic Usage

```js
import P69 from 'p69'

// This mapping was crafted to demonstrate the various
// token to value mappings available. It's does not
// represent the optimal way to define a mapping. Do what
// works for you, not what everyone else is doing.

const mapping = {
	color: {
		normal: 'burlywood',
		highlight: 'crimson',
	},
	font: {
		size: {
			sm: '0.8rem',
			md: '1rem',
			lg: '1.2rem',
		},
	},
	width: (size = 'md') => {
		const sizes = {
			xs: '5rem',
			sm: '10rem',
			md: '15rem',
			lg: '20rem',
			xl: '25rem',
		}

		return sizes[md]
	},
}

const cssWithTokens = `
.my-class {
	color: $color.normal;
	font-weight: bold;

	font-size: $font.size.md;
	width: $width('lg');
}

.my-class:hover {
	color: $color.highlight;
}
`

const css = P69(mapping, cssWithTokens)
// css:
`
.my-class {
	color: burlywood;
	font-size: 1rem;
	width: 20rem;
}

.my-class:hover {
	color: crimson;
}
`
```

### Functions have 'this' Context

A context object is bound to _this_ value if the function allows rebinding, i.e. if the function was not created using the arrow notation `=>`.

In JavaScript, using the arrow notation sets _this_ value based on the context in which the function was defined. Access to the mapping list is rarely needed so arrow functions are perfectly fine to use. Just take care to use the `function` keyword instead if you need the execution context.

Currently, the context object only contains the array of mappings, i.e. `{ mappings }`. This may be useful for those using indirection.

```js
const mapping = {
	smallestFontSizeFor: function () {
		const ctx = this // = { mappings }

		const fontSizes = ctx.mappings.map((m) => m.font.size.sm)
		return Math.min(...fontSizes)
	},
	arrowFunc: (fontSizeCategory) => {
		const ctx = this // = undefined

		// You can not compute the smallest font size across
		// all mappings using the arrow function.
	},
}
```

### Multiple Mappings

You can also pass multiple mappings as an array. The mappings are searched in order and the first value found is used.

```js
// This allows you to organise your mappings to what makes
// sense for your project. E.g. split them up into logical
// parts:

import fonts from './fontMapping.js'
import colors from './colorMapping.js'
import sizes from './sizeMapping.js'

// ...

P69([fonts, colors, sizes], cssWithTokens)
```

```js
// It can also by used to allow a default mapping to be
// overridden by a project specific mapping:

import defaultMapping from 'design-system-tokens'

const customMapping = {
	color: {
		normal: 'blue',
		highlight: 'cyan',
	},
}

// ...

P69([customMapping, defaultMapping], cssWithTokens)
```

## Options

```js
P69(
	mappings,
	cssWithTokens,
	options: {
		// onError is called when an error occurs.
		//
		// If the error, or a new error, isn't thrown by the
		// function then processing will continue for the
		// remaining tokens.
		onError: (err, token) => {
			// By default, logs the error and carries on.
		},
	}
)
```

## Rules for Token Mappings

1. All tokens must be prefixed with `$`.
2. Functions can have arguments, e.g. `$func(1, 2, 3)`.
3. A function with no arguments needs no parenthesis, e.g. `$func` is the same as `$func()`. However, including them may create more readable code.
4. String arguments to functions do not require quotation but single or double quotes are recommended as they allow character escaping and communicate value type to the user or AI agent.
5. There is no special escape character, instead create a mapping to handle escaping (examples in the next section).
6. Any value type is allowed as a token value except undefined and object.
7. Nulls are resolved to empty strings, discarding any suffix.
8. Functions are invoked and the result returned as the token value, but a function cannot return undefined, object, or another function.
9. Async functions are not allowed either; fetch any external data before you start processing.
10. The CSS string is scanned only once so returning a token as a value will rerun the resolver. Instead, use functions to compute values.

## Escaping `$`

There's no escape character for the `$` symbol, but it's easy to write your own. A few possibilities:

```js
export const escapeMethods = {
	// Simplest approach is to use $$, $$$, $$$$, etc.
	// Add more as you need.
	$: '$',
	$$: '$$',
	$$$: '$$$',

	// A better approach is to create a function that
	// performs replacement with an unbroken series of $.
	//
	// $$    => $
	// $$(2) => $$
	// $$(3) => $$$
	$: (n = 1) => '$'.repeat(n),

	// You could also create a function that returns its
	// arguments as a literal value.
	//
	// $literal("$$$")          => $$$
	// $literal("$ one $$ two") => $ one $$ two
	literal: (v = '') => v.toString(),

	// Perhaps you could add spaces between arguments.
	print: (...values) =>
		values.reduce(
			(result, v) => result + ' ' + v, //
			'' // Empty string by default
		),
}
```
