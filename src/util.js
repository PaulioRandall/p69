import fs from 'node:fs'
import path from 'node:path'

const TTY_RED = '\x1b[31m'
const TTY_YELLOW = '\x1b[33m'
const TTY_RESET = '\x1b[0m'

function stdout(...msgs) {
	const msg = msgs.join(' ')
	return process.stdout.write(`\n${TTY_YELLOW}${msg}${TTY_RESET}`)
}

function stderr(...msgs) {
	const msg = msgs.join(' ')
	return process.stderr.write(`\n${TTY_RED}${msg}${TTY_RESET}`)
}

function listP69Files(src = '.') {
	src = path.resolve(src + '/**/*.p69')
	return fs //
		.globSync(src)
		.map((f) => path.resolve(f))
		.sort()
}

function replaceFileExt(f, newExt) {
	const currExt = path.extname(f)
	f = f.slice(0, -currExt.length)
	return `${f}.${newExt}`
}

function isDir(f) {
	if (!fs.existsSync(f)) {
		return false
	}

	const lstat = fs.lstatSync(dst)
	return lstat.isDirectory()
}

function readWholeFile(f) {
	return fs.readFileSync(f, { encoding: 'utf-8' })
}

function createOrReplaceWholeFile(f, content) {
	return fs.writeFileSync(f, content, {
		encoding: 'utf-8',
		flush: true,
	})
}

function deleteFile(f) {
	return fs.rmSync(f, { force: true })
}

function deleteDir(f) {
	return fs.rmSync(f, {
		force: true,
		recursive: true,
	})
}

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

function warn(msg) {
	stdout(`[P69] Warning: ${msg}`)
}

function log(msg) {
	stdout(`[P69] ${msg}`)
}

function logError(msg) {
	stderr(`[P69] ${msg}`)
}

function newError(msg) {
	return new Error(`[P69] ${msg}`)
}

export default {
	stdout,
	stderr,
	listP69Files,
	replaceFileExt,
	isDir,
	readWholeFile,
	createOrReplaceWholeFile,
	deleteFile,
	joinLines,
	isObject,
	log,
	warn,
	logError,
	newError,
}
