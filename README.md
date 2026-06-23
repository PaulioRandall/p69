![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p69)](https://github.com/PaulioRandall/p69/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p69)](https://github.com/PaulioRandall/p69/releases)

# P69

**P69** enables use of compile time tokens within CSS strings for Node based projects.

It's just a glorified find and replace, i.e. it scans CSS strings for placeholder tokens which are substituted for user defined values.

> Create an arbitary nested object containing your tokens. There are no standards or conventions on how one should name and organise them. Just keep it simple and do what works, not what everyone else is doing!

- **P69**: https://github.com/PaulioRandall/p69
- **P69 Files**: https://github.com/PaulioRandall/p69-files
- **P69 Svelte**: https://github.com/PaulioRandall/p69-svelte
- **P69 Util**: https://github.com/PaulioRandall/p69-util

## Example Usage

```js
import P69 from 'p69'

// This mapping has been crafted to demonstrate the kinds
// of mappings available. It's not necessarily the best
// way to define values. Do what works for you, not what
// everyone else is doing.

const mappings = {
	color: {
		normal: 'burlywood',
		highlight: 'crimson ',
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

const css = P69(mappings, cssWithTokens)

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

> You can pass multiple mappings. It will search each mapping in order until it finds a value, e.g. `P69([fonts, colors], cssWithTokens)`

## Options

```js
P69(
	mappings,
	cssWithTokens,
	options: {
		// onError is called when an error occurs.
		//
		// If the error isn't thrown then processing will
		// continue for the remaining tokens.
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
4. String arguments to functions do not require quotation but single or double quotes may be used for escaping characters.
5. There is no special escape character, instead create a mapping to handle escaping (examples in the next section).
6. Any value type is allowed as a token value except undefined and object.
7. Functions are invoked and the result returned as the token value, but a function cannot return undefined, object, or another function.
8. Async functions are not allowed either; fetch any external data before you start processing.
9. Nulls are resolved to empty strings, discarding any suffix.

## Escaping the prefix

There's no escape character for the `$` symbol, but it's easy to write your own. A few possibilities:

```js
export const escapeMethods = {
	// Simplest approach is to use $$, $$$, $$$$, etc.
	// Add more as you need.
	$: '$',
	$$: '$$',
	$$$: '$$$',

	// A better approach is to create a function that
	// replaces with an unbroken series of $.
	//
	// $$ => $
	// $$(2) => $$
	// $$(3) => $$$
	$: (n = 1) => '$'.repeat(n),

	// You could also create a function that returns its
	// first argument as a literal value.
	//
	// $literal("$$$") => $$$
	// $literal("$ one $$ two $$$ three") => $ one $$ two $$$ three
	literal: (v = '') => v.toString(),
}
```
