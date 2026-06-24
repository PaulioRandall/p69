![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p69)](https://github.com/PaulioRandall/p69/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p69)](https://github.com/PaulioRandall/p69/releases)

# P69

**P69** enables use of compile time tokens within CSS strings for Node based projects. It injects user defined values into user placeholder tokens used within CSS strings.

- **P69**: https://github.com/PaulioRandall/p69
- **P69 Files**: https://github.com/PaulioRandall/p69-files
- **P69 Svelte**: https://github.com/PaulioRandall/p69-svelte
- **P69 Util**: https://github.com/PaulioRandall/p69-util

## Example Usage

```js
import P69 from 'p69'

// This mapping was crafted to demonstrate variosu kinds
// of mappings. It's not necessarily the best way to define
// values. Do what works for you, not what everyone else
// is doing.

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
	width: (ctx, size = 'md') => {
		// ctx is an object currently only containing the
		// mappings, i.e. { mappings }. This may be useful
		// for those using indirection within their mappings.

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

Can also pass multiple mappings as an array. The mappings are searched in order and the first value found is used.

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
// It can also by used to enable default mappings that are
// overridden by project specific mappings:

import defaultMapping from 'team-default-mappings'

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
3. A function with no arguments needs no parenthesis, e.g. `$func` is the same as `$func()`.
4. String arguments to functions do not require quotation but single or double quotes are recommended as they allow character escaping and communicate value type to the user or AI agent.
5. There is no special escape character, instead create a mapping to handle escaping (examples in the next section).
6. Any value type is allowed as a token value except undefined and object.
7. Nulls are resolved to empty strings, discarding any suffix.
8. Functions are invoked and the result returned as the token value, but a function cannot return undefined, object, or another function.
9. Async functions are not allowed either; fetch any external data before you start processing.
10. The CSS string is scanned only once so inject a new token will not cause a rescan. Instead, use a function to compute the value.

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

	// Perhaps adding spaces between arguments like console
	// logging does.
	print: (...values) => values.reduce(
		(result, v) => result + " " + v, //
		"", // Empty string by default
	)
}
```
