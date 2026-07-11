import watchTokenFiles from './watchTokenFiles.js'
import testutil from './testutil.js'
import testfiles from './testfiles.js'
import util from './util.js'

const TEST_TIMEOUT = 5000

beforeEach(async () => {
	await testutil.reset()
})

describe('watchTokenFiles.js', () => {
	test(
		'Reloads on change',
		async () => {
			watcher = null

			try {
				const fileToChange = testfiles.tokenFile1

				let called = 0
				const onTokenFilesChanged = (tm) => {
					called++
				}

				// Start watching.
				watcher = watchTokenFiles(
					fileToChange, //
					onTokenFilesChanged,
					{
						chokidar: {
							awaitWriteFinish: {
								// We want quick change for the test.
								stabilityThreshold: 200,
								pollInterval: 50,
							},
						},
					}
				)
				await testutil.sleep(500)

				// Check content in tokenMaps before changing.
				expect(called).toEqual(1)

				// Change the file content.
				const newContent = util.joinLines(
					'module.exports = {',
					"\tcolor: 'blue',",
					"\tpad: '16px',",
					'}'
				)
				util.createOrReplaceWholeFile(fileToChange, newContent)
				await testutil.sleep(500)

				expect(called).toEqual(2)

				// Jest hijacks the module load system so can't
				// easily test the reloading of token files :(
				/*
				expect(tokenMaps).toEqual([
					{
						color: 'blue',
						pad: '16px',
					}
				])
				*/
			} finally {
				// Stop watching.
				watcher?.close()
			}
		},
		TEST_TIMEOUT
	)
})
