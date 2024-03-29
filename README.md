![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p69)](https://github.com/PaulioRandall/p69/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p69)](https://github.com/PaulioRandall/p69/releases)

# P69

**P69** allows compile time tokens to be used for CSS within Node based projects.

It scans CSS for placeholder tokens which are substituted for user defined values. It's just a glorified `string.replace`.

This tool is straight up optimised for my tastes which means taking the light touch. In general, the design trade-offs lean towards simplicity, readability, and changability.

## For Example

```js
export default {
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
	hello: (name = 'Joe') => {
		return '"Hello ' + name + '"'
	},
}
```

```css
.random-class {
	color: $color.normal;
	font-size: $font.size.md;

	&:hover {
		color: &color.highlight;
	}

	&:after {
		content: $hello(); // "Hello Joe"
		content: $hello("Jenny"); // "Hello Jenny"
	}
}
```

See [sveltekit-minimalist-template](https://github.com/PaulioRandall/sveltekit-minimalist-template) for example project usage.

## Explore

- [Import](#import)
- [Token Maps](#token-maps)
  - [Rules for Token Maps](#rules-for-token-maps)
  - [Escaping the prefix](#escaping-the-prefix)
- [Parsing CSS Strings](#parsing-css-strings)
  - [Options](#options)
- [Parsing P69 Files](#parsing-p69-files)
  - [Options](#options-1)
  - [Example P69 File](#example-p69-file)
- [Watching P69 Files](#watching-p69-files)
  - [Options](#options-2)
- [Svelte](#svelte)
  - [Options](#options-3)
  - [Example Svelte Component](#example-svelte-component)
- [Utility Functions](#utility-functions)
  - [rgbsToColors](#rgbstocolors): Converts a map of RGB and RGBA arrays to CSS RGB and RGBA values.
  - [colorSchemes](#colorschemes): Generates CSS color scheme media queries from a set of themes with CSS variables as values; goes hand-in-hand with [themeVariables](#themevariables).
  - [themeVariables](#themevariables): Generates a **set** of CSS variables from a set of themes; goes hand-in-hand with [colorSchemes](#colorschemes).
  - [sizer](#sizer): Generates a set of size functions.

## Import

<div>
	<a href="https://www.npmjs.com/package/p69">
		<img src="/scripts/npm.svg" width="50" height="50" />
	</a>
	<a href="https://github.com/PaulioRandall/p69">
		<picture>
		  <source media="(prefers-color-scheme: dark)" srcset="/scripts/github-dark.png" />
		  <source media="(prefers-color-scheme: light)" srcset="/scripts/github-light.png" />
		  <img alt="Github Logo" src="/scripts/github-dark.png" width="50" height="50" />
		</picture>
	</a>
</div>

```json
{
	"devDependencies": {
		"p69": "3.x.x"
	}
}
```

[^Back to menu](#explore)

### Token Maps

First create a map of your tokens in JavaScript. I recommend creating a file and exporting. Call it whatever you like.

There are no standards or conventions on how one should organise their tokens. Do what works, not what just happens to be trending!

Here's a rough example:

```js
// tokens.js

import myColors from './my-colors.js'

export default {
	// Used for creating string literals such as those
	// containing '$'.
	toString: (s = '') => s.toString(),

	// Split out parts into meaningfully named files.
	color: myColors,

	// Create hierarchies to meaningfully structure tokens.
	//
	// However, if you employ a design system or design tokens
	// then you should probably derive your structure from there.
	font: {
		family: {
			helvetica: ['Helvetica', 'Arial', 'Verdana'], // $font.family.helvetica;
			verdana: ['Verdana', 'Arial', 'Helvetica'], // $font.family.verdana;
		},
		size: {
			sm: 12, // $font.size.sm;
			md: 16, // $font.size.md;
			lg: 20, // $font.size.lg;
			xl: 24, // $font.size.xl;
		},
	},
}
```

### Rules for Token Maps

**Definition:**

1. There are no standards or conventions on how one should organise their maps. Do what works, not what happens to be trending.
2. Any value type is allowed except undefined and object.
3. Functions are invoked and the result returned as the token value.
4. But a function cannot return any of the disallowed types or another function of any kind; the best way to avoid recursion errors is not to allow recursion.
5. And async functions are not allowed; fetch any external data before you start processing.
6. Nulls are resolved to empty strings, discarding any suffix.
7. It's possible to pass an array of token maps `p69([...])`. Each map is checked in turn when attempting to resolve a token.

**Usage:**

1. All tokens must be prefixed with `$`.
2. Functions can have arguments, e.g. `$func(1, 2, 3)`.
3. A function that has no arguments needs no parenthesis, e.g. `$func` == `$func()`.
4. String arguments to functions do not require quotation but single or double quotes are needed to escape some characters.
5. There is no special escape character, instead create a mapping to handle escaping (some possibilities below).

**Interesting useless side effect:** you can pass arguments to a non-function; it's pointless however since they're not used in processing.

### Escaping the prefix

There's no escape character for the `$` symbol. It's easy enough to write a token for it. A few possibilities:

```js
export const escapeMethods = {
	// The simplest approach is to just to use $$, $$$, $$$$, etc.
	// Add more as you need.
	$: '$',
	$$: '$$',
	$$$: '$$$',

	// We can create a single function that handles all unbroken
	// series of $.
	//
	// $$ => $
	// $$(2) => $$
	// $$(3) => $$$
	$: (n = 1) => '$'.repeat(n),

	// literal accepts a value and returns it. This allows values
	// containing $ anywhere within to be escaped easily.
	//
	// $literal("$$$") => $$$
	// $literal("$ one $$ two $$$ three") => $ one $$ two $$$ three
	literal: (v = '') => v.toString(),

	// The world's your Mollusc. You can create any kind of
	// function to escape however you please. Here's a quotation
	// function.
	//
	// $quote('Lots of $$$') => "Lots of $$$"
	// $quote('Lots of $$$', '`') => `Lots of $$$`
	quote: (v, glyph = '"') => glyph + v.toString() + glyph,
}
```

[^Back to menu](#explore)

## Parsing CSS Strings

```js
import { stringP69 } from 'p69'

const tokens = {
	font: {
		family: {
			verdana: ['Verdana', 'Arial', 'Helvetica'],
		},
	},
}

const before = 'main { font-family: $font.family.verdana; }'
const after = stringP69(tokens, before)

// after: "main { font-family: Verdana, Arial, Helvetica; }"
```

### Options

```js
stringP69(tokens, css, {
	// ref is a useful identifer for when onError
	// is called. The default onError will print it out.
	// Typically a filename but any identifer you find
	// meaningful will do.
	ref: '¯\\_(ツ)_/¯',

	// throwIfMissing will throw an error, after onError
	// is called, if a style token can't be found in the
	// provided mappings.
	throwIfMissing: true,

	// onError is called when an error occurs.
	// If the error isn't thrown then processing will
	// continue for the remaining tokens.
	// By default, logs the error and carries on.
	onError: (err, token, options) => {},
})
```

[^Back to menu](#explore)

## Parsing P69 Files

**P69** files are CSS files containing P69 tokens.

```js
import { filesP69 } from 'p69'

const tokens = {
	theme: {
		strong: 'burlywood',
	},
	font: {
		family: {
			verdana: ['Verdana', 'Arial', 'Helvetica'],
		},
	},
}

await filesP69(tokens)
```

### Options

```js
await filesP69(tokens, {
	// See stringP69 options.
	...stringP69.options,

	// src directory containing .p69 files that need
	// to be converted to CSS. If null then .p69 file
	// processing is skipped.
	src: './src',

	// out is the file path to merge all processed .p69
	// files into. This does not include style content from
	// framework files. If null, a .css file will be
	// created for each .p69 file in the same directory as it.
	//
	// There are virtues and vices to each approach but
	// amalgamation works better for smaller projects while
	// big projects usually benefit from more rigorous
	// modularisation.
	out: './src/app.css',
})
```

### Example P69 File

```css
/* styles.p69 */

.text-strong {
	color: $theme.strong;
	font-weight: bold;
}

.text-fancy {
	font-family: $font.family.spectral;
	font-style: italic;
}
```

[^Back to menu](#explore)

## Watching P69 Files

Unfortunatly, I've had little success in getting a JavaScript token file **and its dependencies** to reload on change. I can get a single file and I can reload a whole directory, albeit a little leaky. ECMAScript modules were designed to load once and once only. I may apply the directory approach in a future update.

```js
import { watchP69 } from 'p69'

const tokens = {
	theme: {
		strong: 'burlywood',
	},
	font: {
		family: {
			verdana: ['Verdana', 'Arial', 'Helvetica'],
		},
	},
}

// Does not block.
// Currently uses chokidar.
const terminateWatcher = watchP69(tokens)

await terminateWatcher()
```

### Options

```js
watchP69(tokens, {
	// See filesP69 options.
	...filesP69.options,

	// chokidar is passed to chokidar as options.
	// See https://github.com/paulmillr/chokidar.
	chokidar: {},
})
```

[^Back to menu](#explore)

## Svelte

```js
// svelte.config.js

import { svelteP69, watchP69, filesP69 } from 'p69'
import tokens from './src/tokens.js'

// Only needed if you're using .p69 files.
// Compiles all into ./src/app.css by default.
if (process.env.NODE_ENV === 'development') {
	watchP69(tokens)
} else {
	await filesP69(tokens)
}

export default {
	...,
	preprocess: [svelteP69(tokens)],
	...,
}
```

### Options

```js
svelteP69(tokens, {
	// See svelteP69 options.
	...filesP69.options,

	// langs is a list of accepted lang attibute values.
	// Undefined means any style tag with no lang set
	// will assumed to be P69 parsable.
	langs: [undefined, 'p69', 'text/p69'],
})
```

### Example Svelte Component

```html
<!-- StyledSection.svelte -->

<script>
	export let title
</script>

<section>
	<h2>{title}</h2>
	<slot />
</section>

<style>
	section {
		background: $color.base;
		border-radius: 4px;
		overflow: hidden;
	}

	section h2 {
		font-size: $font.size.lg.rem;
		color: $color.strong;
	}

	@media $screen.larger_devices {
		section h2 {
			font-size: $font.size.xl.rem;
		}
	}

	section :global(p) {
		font-family: $font.family.helvetica;
		font-size: $font.size.md.rem;
		color: $color.text;
		margin-top: $space.md.em;
	}

	section :global(strong) {
		color: $color.strong;
	}
</style>
```

[^Back to menu](#explore)

## Utility Functions

Optional utility functions to use in your token maps. Don't be limited by what I've done. Write your own if you want.

```js
import { rgbsToColors, themeVariables, colorSchemes, sizer } from 'p69/util'
```

[^Back to menu](#explore)

### rgbsToColors

Converts a map of RGB and RGBA arrays to CSS RGB and RGBA values.

**`rgbsToColors(rgbMap) cssColorMap`**

- **rgbMap**: map of token names to RGB and RGBA arrays.
- **cssColorMap**: map of token names to RGB and RGBA CSS strings.

```js
import { rgbsToColors } from 'p69/util'

const colors = rgbsToColors({
	burly_wood: [222, 184, 135],
	burly_wood_lucid: [222, 184, 135, 0.5],
	ice_cream: [250, 250, 250],
	jet_blue: [30, 85, 175],
	dark_navy_grey: [5, 10, 60],
	dark_navy_grey_lucid: [5, 10, 60, 0.5],
})

console.log(colors) // Use console.table for easy reading
/*
{
	burly_wood: "rgb(222, 184, 135)",
	burly_wood_lucid: "rgba(222, 184, 135, 0.5)",
	ice_cream: "rgb(250, 250, 250)",
	jet_blue: "rgb(30, 85, 175)",
	dark_navy_grey: "rgb(5, 10, 60)",
	dark_navy_grey_lucid: "rgba(5, 10, 60, 0.5)",
}
*/
```

[^Back to menu](#explore)

### colorSchemes

Generates CSS color scheme media queries from a set of themes; goes hand-in-hand with [themeVariables](#themeVariables).

**`themeVariables(themes, prefix) mediaQueries`**

- **themes**: map of colour schemes containing token names to CSS values (themes).
- **prefix**: prefix string to avoid name clashes.
- **mediaQueries**: media queries as a CSS string.

```js
import { colorSchemes } from 'p69/util'

const themes = {
	// P69 doesn't care what the theme names are but browsers do!
	light: {
		base: [250, 250, 250],
		text: [5, 10, 60],
	},
	dark: {
		base: [5, 10, 35],
		text: [231, 245, 255],
	},
}

const scheme = colorSchemes(themes, 'theme-primary')
console.log(scheme)
/*
`@media (prefers-color-scheme: light) {
	:root {
		--theme-primary-base: rgb(250, 250, 250);
		--theme-primary-text: rgb(5, 10, 60);
	}
}

@media (prefers-color-scheme: dark) {
	:root {
		--theme-primary-base: rgb(5, 10, 35);
		--theme-primary-text: rgb(231, 245, 255);
	}
}`
*/
```

[^Back to menu](#explore)

### themeVariables

Generates a **set** of CSS variables from a set of themes; goes hand-in-hand with [colorSchemes](#colorschemes).

**`colorSchemes(themes, prefix) varMap`**

- **themes**: map of colour schemes containing token names to CSS values (themes).
- **prefix**: prefix string to avoid name clashes.
- **varMap**: map of token names to CSS variable strings.

```js
import { themeVariables } from 'p69/util'

const themes = {
	// P69 doesn't care what the theme names are but browsers do!
	light: {
		base: [250, 250, 250],
		text: [5, 10, 60],
	},
	dark: {
		base: [5, 10, 35],
		text: [231, 245, 255],
		meh: [0, 0, 0],
	},
}

const theme = themeVariables(themes, 'theme-primary')
console.log(theme)
/*
{
	base: "var(--theme-primary-base)",
	text: "var(--theme-primary-text)",
	meh: "var(--theme-primary-meh)",
}
*/
```

[^Back to menu](#explore)

### sizer

Generates a set of size maps mapping a pixel value to other units.

**`sizer(tokens, base) sizeMap`**

- **tokens**: map of token names to pixel amounts.
- **base**: pixels per EM. This is not necessarily the users font size, just a way to adjust EM and REM if needed (default=16)
- **sizeMap**: map of token names to a map of the token value in different size units.

Everything is in reference to 96 DPI. _sizeMap_ schema:

```js
{
	token_name: {
		px,  // 1dp
		em,  // 2dp
		rem, // 2dp
		pt,  // 2dp
		pc,  // 1dp
		in,  // 3dp
		cm,  // 2dp
		mm,  // 1dp
	}
}
```

Example:

```js
import { sizer } from 'p69/util'

const tokens = {
	width: sizer(
		{
			min: 320,
			sm: 720,
			md: 920,
			lg: 1200,
			xl: 1600,
		}
		// base: 16,
	),
}

const css = `
main {
	/* width: 45rem (720px at 16px per rem) */
	width: $width.sm.rem;
}

/* min-width: 920px */
@media (min-width: $width.md.px) {
	main {
		/* max-width: 1600px */
		max-width: $width.xl.px; 
	}
}
`
```

[^Back to menu](#explore)
