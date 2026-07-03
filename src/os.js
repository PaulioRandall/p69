import fs from 'fs'
import path from 'path'

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

function readWholeFile(f) {
	return fs.readFileSync(f, { encoding: 'utf-8' })
}

function createOrReplaceFile(f, content) {
	return fs.promises
		.writeFile(f, content, { encoding: 'utf-8' })
		.then(handleOK)
		.catch(handleErr)
}

function appendToFile(f, content) {
	return fs.promises
		.appendFile(f, content, { encoding: 'utf-8' })
		.then(handleOK)
		.catch(handleErr)
}

function deleteFile(f) {
	return fs.promises //
		.rm(f, { force: true })
		.then(handleOK)
		.catch(handleErr)
}

function handleOK(result) {
	return [result, true]
}

function handleErr(err) {
	stderr(err)
	return [null, false]
}

export default {
	stdout,
	stderr,
	listP69Files,
	replaceFileExt,
	readWholeFile,
	createOrReplaceFile,
	appendToFile,
	deleteFile,
}
