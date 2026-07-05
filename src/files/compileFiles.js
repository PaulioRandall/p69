import path from 'node:path'
import fs from 'node:fs'

import P69 from '../index.js'
import os from '../os.js'
import util from '../util.js'

export default async (tokenMaps, options) => {
	try {
		const p69Files = os.listP69Files(options.src)

		if (options.dst) {
			await checkDst(options.dst)
			await os.createOrReplaceFile(options.dst, '')
		}

		await compileP69Files(p69Files, tokenMaps, options)
	} catch (e) {
		util.logError(e)
	}
}

async function checkDst(dst) {
	if (!fs.existsSync(dst)) {
		return
	}

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

	for (const f of p69Files) {
		try {
			await compileFile(f, tokenMaps, options.dst, compileOptions)
		} catch (e) {
			util.logError(e)
		}
	}
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
