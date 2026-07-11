import module from 'node:module'
import url from 'node:url'
import util from './util.js'

const require = module.createRequire(import.meta.url)

export default function (tokenFiles) {
	if (!Array.isArray(tokenFiles)) {
		// User usually passes a file path rather than array of
		// paths. As an array keeps reading simple.
		tokenFiles = [tokenFiles]
	}

	tokenFiles = tokenFiles.sort()

	clearRequireCache(tokenFiles)
	return loadTokenMapsFromFiles(tokenFiles)
}

function clearRequireCache(tokenFiles) {
	// Clear import so it loads changed files during
	// development.
	for (const filename of tokenFiles) {
		const key = require.resolve(filename)
		delete require.cache[key]
	}
}

function loadTokenMapsFromFiles(tokenFiles) {
	return tokenFiles.reduce((acc, f) => {
		acc.push(...loadTokenMapsFromFile(f))
		return acc
	}, [])
}

function loadTokenMapsFromFile(filename) {
	const importPath = url.pathToFileURL(filename)
	const tokenMap = require(importPath.href)

	checkExportValue(tokenMap, filename)

	return util.isObject(tokenMap) ? [tokenMap] : tokenMap
}

function checkExportValue(v, filename) {
	if (Array.isArray(v) || util.isObject(v)) {
		return
	}

	const t = typeof result
	throw util.newError(
		`Expected default value to be array or object, not '${t}', within '${filename}'`
	)
}
