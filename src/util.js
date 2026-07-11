import os from './os.js'

function joinLines(...lines) {
	return lines.join('\n')
}

function isObject(v) {
	return (
		typeof v === 'object' && //
		!Array.isArray(v) &&
		v !== null
	)
}

function log(msg) {
	os.stdout(`[P69] ${msg}`)
}

function logError(msg) {
	os.stderr(`[P69] ${msg}`)
}

function newError(msg) {
	return new Error(`[P69] ${msg}`)
}

export default {
	joinLines,
	isObject,
	log,
	logError,
	newError,
}
