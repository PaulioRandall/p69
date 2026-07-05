import fs from 'node:fs'

import testdata from './testdata.js'
import compileFiles from './compileFiles.js'

const THREE_SECOND_TEST_TIMEOUT = 3000

function joinLines(...lines) {
	return lines.join('\n')
}

const expectedCSS = [
	{
		path: testdata.testDir + '/alpha/alpha.css',
		content: joinLines(`.alpha {`, `\tcolor: green;`, `}`, ``),
	},
	{
		path: testdata.testDir + '/alpha/beta/beta.css',
		content: joinLines('.beta {', '\tpadding: 8px;', '}', ''),
	},
	{
		path: testdata.testDir + '/alpha/charlie/charlie.css',
		content: joinLines(
			'.charlie {',
			'\tcolor: green;',
			'\tpadding: 8px;',
			'}',
			''
		),
	},
]

describe('files.js', () => {
	test(
		'Processes testDir',
		async () => {
			await testdata.reset()

			const tokenMaps = [
				{
					color: 'green',
					pad: '8px',
				},
			]

			await compileFiles(tokenMaps, {
				src: testdata.testDir,
				dst: null,
			})

			// Wait a mo to ensure files are written and visible.
			await testdata.sleep(500)

			for (const f of expectedCSS) {
				await testdata.expectFileContains(f.path, f.content)
			}
		},
		THREE_SECOND_TEST_TIMEOUT
	)

	test(
		'processes AND amalgamtes testdata from .p69 to .css',
		async () => {
			await testdata.reset()

			const dst = testdata.testDir + '/global.css'
			const tokenMaps = [
				{
					color: 'green',
					pad: '8px',
				},
			]

			await compileFiles(tokenMaps, {
				src: testdata.testDir,
				dst: dst,
			})

			// Wait a mo to ensure file is written and visible.
			await testdata.sleep(500)

			const exp = expectedCSS.reduce((acc, item) => {
				return acc + item.content + '\n'
			}, '')

			await testdata.expectFileContains(dst, exp)
		},
		THREE_SECOND_TEST_TIMEOUT
	)
})
