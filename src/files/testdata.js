import fs from 'fs'
import path from 'path'

const newPath = (dir, f) => {
	f = path.join(dir, f)
	return path.resolve(f)
}

const root = './src/files/testdata'
const files = [
	{
		path: newPath(root, './alpha/alpha.html'),
		format: 'html',
		content: '',
	},
	{
		path: newPath(root, './alpha/alpha.p69'),
		format: 'p69',
		content: '.alpha {\n\tcolor: $color;\n}\n',
	},
	{
		path: newPath(root, './alpha/beta/beta.html'),
		format: 'html',
		content: '',
	},
	{
		path: newPath(root, './alpha/beta/beta.p69'),
		format: 'p69',
		content: '.beta {\n\tpadding: $pad;\n}\n',
	},
	{
		path: newPath(root, './alpha/charlie/charlie.html'),
		format: 'html',
		content: '',
	},
	{
		path: newPath(root, './alpha/charlie/charlie.p69'),
		format: 'p69',
		content: '.charlie {\n\tcolor: $color;\n\tpadding: $pad;\n}\n',
	},
	{
		path: newPath(root, './alpha/charlie/other.css'),
		format: 'css',
		content: '.other {\n\tcolor: green;\n}\n',
	},
]

const reset = async () => {
	await purge()
	await create()
	await sleep(250)
}

const purge = async () => {
	await fs.promises.rm(root, {
		recursive: true,
		force: true,
	})
}

const create = async () => {
	for (const f of files) {
		await createFile(f.path, f.content)
	}
}

const createFile = async (filepath, content) => {
	const parent = path.dirname(filepath)
	await fs.promises.mkdir(parent, { recursive: true })
	await fs.promises.writeFile(filepath, content, { encoding: 'utf-8' })
}

const expectFileContains = async (f, exp) => {
	const act = await fs.promises.readFile(f, { encoding: 'utf-8' })
	expect(act).toEqual(exp)
}

const sleep = (timeout) => {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout)
	})
}

export default {
	root,
	files,
	reset,
	purge,
	create,
	expectFileContains,
	sleep,
}
