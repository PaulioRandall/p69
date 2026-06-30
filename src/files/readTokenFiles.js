import os from '../os.js'

export default async function (tokenFiles) {
	if (!Array.isArray(tokenFiles)) {
		// User usually passes a file path rather than array of
		// paths. As an array keeps reading simple.
		tokenFiles = [tokenFiles]
	}

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
	const mod = await import(filename)
	const tokenMap = mod.default

	ensureDefaultValueIsValid(tokenMap, filename)

	return isObject(tokenMap) ? [tokenMap] : tokenMap
}

function ensureDefaultValueIsValid(v, filename) {
	if (!Array.isArray(v) && !isObject(v)) {
		const t = typeof result
		throw new Error(
			`[P69-files] Expected default value to be array or object, not '${t}', within '${filename}'`
		)
	}
}

function isObject(v) {
	return (
		typeof v === 'object' && //
		!Array.isArray(v) &&
		v !== null
	)
}
