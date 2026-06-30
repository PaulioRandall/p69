import readTokenFiles from './readTokenFiles.js'
import testdata from './testdata.js'

describe('readTokenFiles.js', () => {
	test('Read token file', async () => {
		await testdata.reset()

		const tokenFile = testdata.resolve('/tokens.js')
		const tokenMaps = await readTokenFiles(tokenFile)

		expect(tokenMaps).toEqual([
			{
				color: 'green', //
				pad: '8px',
			},
		])
	})

	test('Read token files', async () => {
		await testdata.reset()

		const tokenFile = testdata.resolve('/tokens.js')
		const tokenExtraFile = testdata.resolve('/tokensExtra.js')

		const tokenMaps = await readTokenFiles([
			tokenFile, //
			tokenExtraFile,
		])

		expect(tokenMaps).toEqual([
			{
				color: 'green', //
				pad: '8px',
			},
			{
				color: 'red',
				pad: '16px',
			},
			{
				color: 'blue',
				pad: '32px',
			},
		])
	})
})
