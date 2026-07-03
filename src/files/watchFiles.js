import chokidar from 'chokidar'
import path from 'path'

import compileFiles from './compileFiles.js'
import util from '../util.js'

export default (tokenMaps, options) => {
	const chokidarOptions = {
		// Ignore everything except .p69 files.
		ignored: (path, stats) => {
			return stats?.isFile() && !path.endsWith('.p69')
		},

		// True to prevent recompile for each dir under
		// src during start up.
		ignoreInitial: true,

		// Don't be silly.
		followSymlinks: false,

		// I don't know what is suitable but seems to work
		// fine. Extend 'stabilityThreshold' if you
		// experience file update issues.
		awaitWriteFinish: {
			// How long after a change is detected before
			// recompiling.
			stabilityThreshold: 999,
			pollInterval: 200,
		},

		// Avoid triggering recompile twice when a tool
		// deletes then writes the same file, rather than
		// modifying it.
		atomic: 200,

		...options.chokidar,
	}

	const handler = (filePath) => {
		if (typeof filePath === 'string') {
			util.log(`Recompiling ${path.resolve(filePath)}`)
		} else {
			util.log(`Recompiling ${options.src}`)
		}

		compileFiles(tokenMaps, options)
	}

	util.log(`Watching directory: ${options.src}`)

	const watcher = chokidar
		.watch(`${options.src}`, chokidarOptions) //
		.on('ready', handler)
		.on('add', handler)
		.on('change', handler)
		.on('unlink', handler)
		.on('addDir', handler)
		.on('unlinkDir', handler)
		.on('error', (e) => {
			util.logError(`Watcher error: ${e}`) //
		})
}
