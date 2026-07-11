import Scanner from './scanner/Scanner.js'
import Resolver from './resolver/Resolver.js'

import util from './util.js'

const defaultOnError = (err, token) => {
	util.stderr('[P69] ', err)
	util.stderr('[P69] ', JSON.stringify(token, null, 2))
}

export default function (p69Content, tokenMaps, onError = defaultOnError) {
	p69Content = p69Content.normalize('NFC')

	if (util.isObject(tokenMaps)) {
		tokenMaps = [tokenMaps]
	}

	const resolver = new Resolver(...tokenMaps)
	return replaceAllTokens(resolver, p69Content, onError)
}

function replaceAllTokens(resolver, p69Content, onError) {
	const tokens = Scanner.scanAll(p69Content)

	// Work from back to front of the CSS string so
	// replacements at the start don't screw up scanned
	// token indexes later in the CSS.
	tokens.reverse()

	for (const tk of tokens) {
		let tokenFound = false

		try {
			let value = resolver.resolve(tk.path, tk.args)
			value = appendSuffix(value, tk.suffix)
			p69Content = replaceValue(p69Content, value, tk.start, tk.end)
		} catch (e) {
			onError(e, tk)
		}
	}

	return p69Content
}

function appendSuffix(value, suffix) {
	if (value === undefined || value === null) {
		return value
	}
	return value + suffix
}

function replaceValue(content, value, start, end) {
	const prefix = content.slice(0, start)
	const postfix = content.slice(end, content.length)
	return `${prefix}${value}${postfix}`
}
