import path from 'node:path'

import os from '../os.js'

import prepOptions from './prepOptions.js'
import readMappings from './readMappings.js'
import compileFiles from './compileFiles.js'
import watchFiles from './watchFiles.js'

export default async (tokenFiles, userOptions = {}) => {
	const options = prepOptions(userOptions)

	try {
		const tokenMaps = await readMappings(tokenFiles)
		await compileFiles(tokenMaps, options)

		if (options.watch) {
			watchFiles(tokenMaps, options)
		}
	} catch (e) {
		os.stderr(e)
	}
}
