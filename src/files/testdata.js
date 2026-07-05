import fs from 'node:fs'
import path from 'node:path'

const testDataDir = './src/files/testdata'
const testDir = './src/files/testdir'

function resolve(testFile) {
	return path.resolve(testDir + testFile)
}

const reset = async () => {
	await purge()
	await sleep(250)
	await copyTestdata()
	await sleep(250)
}

const purge = async () => {
	await fs.promises.rm(testDir, {
		recursive: true,
		force: true,
	})
}

const copyTestdata = async () => {
	fs.cpSync(testDataDir, testDir, { recursive: true })
}

const sleep = (timeout) => {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout)
	})
}

const expectFileContains = async (f, exp) => {
	const act = await fs.promises.readFile(f, { encoding: 'utf-8' })
	expect(act).toEqual(exp)
}

export default {
	testDir,
	resolve,
	reset,
	sleep,
	expectFileContains,
}
