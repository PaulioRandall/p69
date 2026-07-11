import P69 from './P69.js'
import testutil from './testutil.js'
import testfiles from './testfiles.js'
import util from './util.js'

function rethrow(e) {
	throw e
}

const tokenMaps = [
	{
		color: 'green',
		pad: '8px',
	},
]

beforeEach(async () => {
	await testutil.reset()
})

// Just to check I've hooked stuff up right.

describe('P69.js', () => {
	describe('loadTokenFiles', () => {
		test('Loads token files', () => {
			const p69 = new P69()

			p69.loadTokenFiles([
				testfiles.tokenFile1, //
				testfiles.tokenFile2,
			])

			expect(p69._tokenMaps).toEqual([
				testfiles.tokenFile1Content, //
				...testfiles.tokenFile2Content,
			])
		})
	})

	describe('setOnError', () => {
		test('Sets valid error', () => {
			const p69 = new P69()

			const f = (e) => {}
			p69.setOnError(f)

			expect(p69._onError).toEqual(f)
		})

		test('Throws when not a function', () => {
			const p69 = new P69()
			const f = () => p69.setOnError('')
			expect(f).toThrow(Error)
		})
	})

	describe('compileFile', () => {
		test('Compiles and creates css file', () => {
			const inFile = testfiles.alphaP69File
			const outFile = testfiles.betaCssFile

			const p69 = new P69()
			p69._onError = rethrow
			p69._tokenMaps = tokenMaps

			p69.compileFile(inFile, {
				dst: outFile,
			})

			const act = testutil.readTestFile(outFile)
			const exp = testfiles.alphaCssFileContent

			expect(act).toEqual(exp)
		})
	})

	describe('compileDir', () => {
		test('Compiles dir of P69 files', () => {
			const p69 = new P69()

			const inDir = testfiles.testDir
			const outFile = testfiles.globalCssFile

			p69._onError = rethrow
			p69._tokenMaps = tokenMaps

			p69.compileDir(inDir, {
				dst: outFile,
			})

			const act = testutil.readTestFile(outFile)
			const exp = util.joinLines(
				testfiles.alphaCssFileContent,
				testfiles.betaCssFileContent,
				testfiles.charlieCssFileContent
			)

			expect(act).toEqual(exp)
		})
	})
})
