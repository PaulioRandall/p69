import path from 'node:path'

import os from '../os.js'

import prepOptions from './prepOptions.js'
import readTokenFiles from './readTokenFiles.js'
import compileFiles from './compileFiles.js'
import watchFiles from './watchFiles.js'

export default async (tokenFiles, userOptions = {}) => {
	const options = prepOptions(userOptions)

	try {
		if (options.watch) {
			await watchFiles(tokenFiles, options)
		} else {
			const tokenMaps = await readTokenFiles(tokenFiles)
			await compileFiles(tokenMaps, options)
		}
	} catch (e) {
		os.stderr(e)
	}
}
