import readTokenFiles from './readTokenFiles.js'
import testutil from './testutil.js'
import testfiles from './testfiles.js'

beforeEach(async () => {
	await testutil.reset()
})

describe('readTokenFiles.js', () => {
	test('Read simple token file', () => {
		const tokenMaps = readTokenFiles(testfiles.tokenFile1)

		expect(tokenMaps).toEqual([
			{
				color: 'green', //
				pad: '8px',
			},
		])
	})

	test('Read set of token files', () => {
		const tokenMaps = readTokenFiles([
			testfiles.tokenFile1, //
			testfiles.tokenFile2,
		])

		expect(tokenMaps).toEqual([
			testfiles.tokenFile1Content, //
			...testfiles.tokenFile2Content,
		])
	})
})
