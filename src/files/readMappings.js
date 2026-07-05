import url from 'node:url'
import util from '../util.js'

export default async function (tokenFiles) {
	if (!Array.isArray(tokenFiles)) {
		// User usually passes a file path rather than array of
		// paths. As an array keeps reading simple.
		tokenFiles = [tokenFiles]
	}

	tokenFiles = tokenFiles.sort()
	return await loadTokenMaps(tokenFiles)
}

async function loadTokenMaps(tokenFiles) {
	const result = []

	for (const f of tokenFiles) {
		const tokenMaps = await loadTokenMapsFromFile(f)
		result.push(...tokenMaps)
	}

	return result
}

async function loadTokenMapsFromFile(filename) {
	const importPath = url.pathToFileURL(filename)
	const mod = await import(importPath.href)
	const tokenMap = mod.default

	ensureDefaultValueIsValid(tokenMap, filename)

	return util.isObject(tokenMap) ? [tokenMap] : tokenMap
}

function ensureDefaultValueIsValid(v, filename) {
	if (!Array.isArray(v) && !util.isObject(v)) {
		const t = typeof result
		throw util.newError(
			`Expected default value to be array or object, not '${t}', within '${filename}'`
		)
	}
}
