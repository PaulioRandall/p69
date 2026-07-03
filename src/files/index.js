import path from 'path'
import prepOptions from './prepOptions.js'
import compileFiles from './compileFiles.js'
import watchFiles from './watchFiles.js'

export default async (tokenFiles, userOptions = {}) => {
	const options = prepOptions(userOptions)

	if (options.watch) {
		await watchFiles(tokenFiles, options)
	} else {
		await compileFiles(tokenFiles, options)
	}
}
