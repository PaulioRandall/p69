import fs from 'fs'

import testdata from './testdata.js'
import compileFiles from './files.js'

const TWO_SECOND_TEST_TIMEOUT = 2000

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

			const tokenMapFiles = [
				testdata.resolve('/tokens.js'),
				testdata.resolve('/tokensExtra.js'),
			]

			const hasErrors = await compileFiles(tokenMapFiles, {
				src: testdata.testDir,
				dst: null,
			})

			expect(hasErrors).toEqual(false)

			for (const f of expectedCSS) {
				await testdata.expectFileContains(f.path, f.content)
			}
		},
		TWO_SECOND_TEST_TIMEOUT
	)
	/*
	test('processes AND amalgamtes testdata from .p69 to .css', async () => {
		await testdata.reset()

		const dst = testdata.testDir + '/global.css'
		const tokenMap = {
			color: 'blue',
			pad: '2rem',
		}

		const hasErrors = await compileFiles(tokenMap, {
			src: testdata.testDir,
			dst: dst,
		})

		expect(hasErrors).toEqual(false)

		const exp = expectedCSS.reduce((acc, f) => {
			return `${acc}${f.content}\n`
		}, '')

		await testdata.expectFileContains(dst, exp)
	}, TWO_SECOND_TEST_TIMEOUT)
*/
})
