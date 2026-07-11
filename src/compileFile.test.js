import path from 'node:path'

import compileFile from './compileFile.js'
import testutil from './testutil.js'
import testfiles from './testfiles.js'

function joinLines(...lines) {
	return lines.join('\n')
}

const mappings = {
	color: 'forestgreen',
}

const exp = joinLines(
	'.alpha {', //
	'\tcolor: forestgreen;',
	'}',
	''
)

const onError = (e) => {
	throw e
}

beforeEach(async () => {
	await testutil.reset()
})

describe('compileFile.js', () => {
	test('Dry run returns CSS', () => {
		const act = compileFile(testfiles.alphaP69File, mappings, {
			dryRun: true,
			onError,
		})

		expect(act).toEqual(exp)
	})

	test('Generates default .css file', () => {
		compileFile(testfiles.alphaP69File, mappings, { onError })

		const act = testutil.readTestFile(testfiles.alphaCssFile)
		expect(act).toEqual(exp)
	})

	test('Generates specified .css', () => {
		compileFile(testfiles.alphaP69File, mappings, {
			dst: testfiles.betaCssFile,
			onError,
		})

		const act = testutil.readTestFile(testfiles.betaCssFile)
		expect(act).toEqual(exp)
	})
})
