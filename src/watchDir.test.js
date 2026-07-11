import watchDir from './watchDir.js'
import testutil from './testutil.js'
import testfiles from './testfiles.js'
import util from './util.js'
import os from './os.js'

const TEST_TIMEOUT = 5000

const tokenMaps = [
	{
		color: 'green',
		pad: '8px',
		background: 'blue',
	},
]

beforeEach(async () => {
	await testutil.reset()
})

describe('watchDir.js', () => {
	test(
		'Recompiles on change',
		async () => {
			watcher = null

			try {
				const fileToChange = testfiles.alphaP69File
				const fileChanged = testfiles.alphaCssFile

				// Start watching
				watcher = watchDir(testutil.testDir, tokenMaps, {
					dst: null,
					chokidar: {
						awaitWriteFinish: {
							// We want quick change for the test.
							stabilityThreshold: 200,
							pollInterval: 50,
						},
					},
				})
				await testutil.sleep(200)

				// Check the .css file before the test.
				const beforeContent = testutil.readTestFile(fileChanged)
				const expBeforeContent = util.joinLines(
					`.alpha {`, //
					`\tcolor: green;`,
					`}`,
					``
				)
				expect(beforeContent).toEqual(expBeforeContent)

				// Change the file content.
				const newContent = util.joinLines(
					`.alpha {`, //
					`\tbackground: $background;`,
					`}`,
					``
				)
				os.createOrReplaceWholeFile(fileToChange, newContent)
				await testutil.sleep(500)

				// Check the file was recompiled and the .css file
				// was updated with the changes.
				const afterContent = testutil.readTestFile(fileChanged)
				const expAfterContent = util.joinLines(
					`.alpha {`, //
					`\tbackground: blue;`,
					`}`,
					``
				)
				expect(afterContent).toEqual(expAfterContent)
			} finally {
				// Stop watching.
				watcher?.close()
			}
		},
		TEST_TIMEOUT
	)
})
