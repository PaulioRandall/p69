import testutil from './testutil.js'
import util from './util.js'

const tokenFile1 = testutil.resolve('/tokens1.cjs')
const tokenFile1Content = {
	color: 'green', //
	pad: '8px',
}

const tokenFile2 = testutil.resolve('/tokens2.cjs')
const tokenFile2Content = [
	{
		color: 'red',
		pad: '16px',
	},
	{
		color: 'blue',
		pad: '32px',
	},
]

const alphaP69File = testutil.resolve('/alpha/alpha.p69')
const alphaCssFile = testutil.resolve('/alpha/alpha.css')
const alphaCssFileContent = util.joinLines(
	`.alpha {`, //
	`\tcolor: green;`,
	`}`,
	``
)

const betaP69File = testutil.resolve('/alpha/beta/beta.p69')
const betaCssFile = testutil.resolve('/alpha/beta/beta.css')
const betaCssFileContent = util.joinLines(
	'.beta {', //
	'\tpadding: 8px;',
	'}',
	``
)

const charlieP69File = testutil.resolve('/alpha/charlie/charlie.p69')
const charlieCssFile = testutil.resolve('/alpha/charlie/charlie.css')
const charlieCssFileContent = util.joinLines(
	'.charlie {', //
	'\tcolor: green;',
	'\tpadding: 8px;',
	'}',
	``
)

const globalCssFile = testutil.resolve('/global.css')

export default {
	testDir: testutil.testDir,
	globalCssFile,
	tokenFile1,
	tokenFile1Content,
	tokenFile2,
	tokenFile2Content,
	alphaP69File,
	alphaCssFile,
	alphaCssFileContent,
	betaP69File,
	betaCssFile,
	betaCssFileContent,
	charlieP69File,
	charlieCssFile,
	charlieCssFileContent,
}
