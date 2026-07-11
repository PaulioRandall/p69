import path from 'node:path'
import chokidar from 'chokidar'

import compileDir from './compileDir.js'
import util from './util.js'

export default (dir, tokenMaps, options) => {
	const chokidarOptions = prepChokidarOptions(options)

	const handler = (filePath) => {
		util.log(`Recompiling ${dir}\n`)
		compileDir(dir, tokenMaps, options)
	}

	util.log(`Watching directory: ${dir}`)

	return chokidar
		.watch(dir, chokidarOptions) //
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

function prepChokidarOptions(options) {
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
			stabilityThreshold: 500,
			pollInterval: 100,
		},

		// Avoid triggering recompile twice when a tool
		// deletes then writes the same file, rather than
		// modifying it.
		atomic: 200,
	}

	if (options.chokidar) {
		Object.assign(chokidarOptions, options.chokidar)
	}

	return chokidarOptions
}
