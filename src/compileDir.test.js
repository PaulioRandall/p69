import fs from 'node:fs'

import testutil from './testutil.js'
import testfiles from './testfiles.js'
import compileDir from './compileDir.js'

import os from './os.js'
import util from './util.js'

const tokenMaps = [
	{
		color: 'green',
		pad: '8px',
	},
]

const onError = (e) => {
	throw e
}

beforeEach(async () => {
	await testutil.reset()
})

describe('compileDir.js', () => {
	test('Writes individual CSS files', () => {
		compileDir(
			testutil.testDir, // src
			tokenMaps,
			{ onError }
		)

		testutil.expectFileContains(
			testfiles.alphaCssFile, //
			testfiles.alphaCssFileContent
		)

		testutil.expectFileContains(
			testfiles.betaCssFile, //
			testfiles.betaCssFileContent
		)

		testutil.expectFileContains(
			testfiles.charlieCssFile, //
			testfiles.charlieCssFileContent
		)
	})

	test('Creates amalgamted css', () => {
		const dst = testfiles.globalCssFile

		compileDir(
			testutil.testDir, // src
			tokenMaps,
			{
				onError,
				dst,
			}
		)

		const exp = util.joinLines(
			testfiles.alphaCssFileContent,
			testfiles.betaCssFileContent,
			testfiles.charlieCssFileContent
		)

		testutil.expectFileContains(dst, exp)
	})
})
