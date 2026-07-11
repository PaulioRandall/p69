import fs from 'node:fs'
import path from 'node:path'

const testDataDir = './src/testdata'
const testDir = './src/testdir'

function resolve(testFile) {
	return path.resolve(testDir + testFile)
}

async function reset() {
	purge()
	await sleep(100)
	copyTestdata()
	await sleep(100)
}

function purge() {
	fs.rmSync(testDir, {
		recursive: true,
		force: true,
	})
}

function readTestFile(f) {
	return fs.readFileSync(f, { encoding: 'utf-8' })
}

function copyTestdata() {
	fs.cpSync(testDataDir, testDir, { recursive: true })
}

function sleep(timeout) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout)
	})
}

function expectFileContains(f, exp) {
	const act = fs.readFileSync(f, { encoding: 'utf-8' })
	expect(act).toEqual(exp)
}

export default {
	testDir,
	resolve,
	readTestFile,
	reset,
	sleep,
	expectFileContains,
}
