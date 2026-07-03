import os from './os.js'

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
	isObject,
	log,
	logError,
	newError,
}
