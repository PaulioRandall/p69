import path from 'path'

import P69 from '../index.js'
import prepOptions from './prepOptions.js'
import readTokenFiles from './readTokenFiles.js'
import os from '../os.js'

export default async (tokenFiles, userOptions = {}) => {
	const options = prepOptions(userOptions)

	try {
		const p69Files = os.listP69Files(options.src)
		const tokenMaps = await readTokenFiles(tokenFiles)

		if (options.dst) {
			checkDst(options.dst)
			await os.deleteFile(options.dst)
		}

		return await compileP69Files(p69Files, tokenMaps, options)
	} catch (e) {
		os.stderr(e, '\n')
		return true
	}
}

async function checkDst(dst) {
	const lstat = await fs.lstatSync(dst)

	if (lstat.isDirectory()) {
		throw new Error(`[P69] options.dst must be a file, not a folder`)
	}
}

async function compileP69Files(p69Files, tokenMaps, options) {
	const compileOptions = {}

	if (options.onError) {
		compileOptions.onError = options.onError
	}

	let hasError = false

	for (const f of p69Files) {
		try {
			compileFile(f, tokenMaps, options.dst, compileOptions)
		} catch (e) {
			os.stderr(e, '\n')
			hasError = true
		}
	}

	return hasError
}

export async function compileFile(
	p69File, //
	tokenMaps,
	compositeFile,
	compileOptions
) {
	const p69Content = await os.readWholeFile(p69File)
	const css = P69(tokenMaps, p69Content, compileOptions).trim()
	await writeCssToFile(p69File, compositeFile, css)
}

async function writeCssToFile(p69File, compositeFile, css) {
	if (compositeFile) {
		await appendCssToCompositeFile(compositeFile, css)
	} else {
		await createOrReplaceCssFile(p69File, css)
	}
}

async function appendCssToCompositeFile(compositeFile, css) {
	await os.appendToFile(compositeFile, css + '\n\n')
}

async function createOrReplaceCssFile(p69File, css) {
	const cssFile = os.replaceFileExt(p69File, 'css')
	await os.createOrReplaceFile(cssFile, css + '\n')
}
