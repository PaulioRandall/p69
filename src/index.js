import Scanner from './scanner/Scanner.js'
import Resolver from './resolver/Resolver.js'
import prepareOptions from './prepareOptions.js'

export default (mappings, cssWithTokens, options = {}) => {
	options = prepareOptions(options)

	if (isObject(mappings)) {
		mappings = [mappings]
	}

	cssWithTokens = cssWithTokens.normalize('NFC')
	const resolver = new Resolver(...mappings)

	return replaceAllTokens(resolver, cssWithTokens, options.onError)
}

const isObject = (v) => {
	return (
		typeof v === 'object' && //
		!Array.isArray(v) &&
		v !== null
	)
}

const replaceAllTokens = (resolver, cssWithTokens, onError) => {
	const tokens = Scanner.scanAll(cssWithTokens)

	// Work from back to front of the CSS string so
	// replacements at the start don't screw up scanned
	// token indexes later in the CSS.
	tokens.reverse()

	for (const tk of tokens) {
		let tokenFound = false

		try {
			let value = resolver.resolve(tk.path, tk.args)
			value = appendSuffix(value, tk.suffix)
			cssWithTokens = replaceValue(cssWithTokens, value, tk.start, tk.end)
		} catch (e) {
			onError(e, tk)
		}
	}

	return cssWithTokens
}

const appendSuffix = (value, suffix) => {
	if (value === undefined || value === null) {
		return value
	}
	return value + suffix
}

const replaceValue = (cssWithTokens, value, start, end) => {
	const prefix = cssWithTokens.slice(0, start)
	const postfix = cssWithTokens.slice(end, cssWithTokens.length)
	return `${prefix}${value}${postfix}`
}
