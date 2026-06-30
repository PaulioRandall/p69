import chokidar from 'chokidar'
import path from 'path'

import compileFiles from './files.js'
import os from './os.js'

export default (tokenMaps, options = {}) => {
	const src = options.src || './src'

	const chokidarOptions = {
		// Ignore everything except .p69 files.
		ignored: (path, stats) => stats?.isFile() && !path.endsWith('.p69'),

		// Otherwise recompile triggers for each dir under src during start up.
		ignoreInitial: true,

		// A little idiot proofing.
		followSymlinks: false,

		// I don't know what is suitable but seems to work fine.
		// Extend 'stabilityThreshold' if you experience file update issues.
		awaitWriteFinish: {
			stabilityThreshold: 999,
			pollInterval: 200,
		},

		// Avoid triggering recompile twice when some tool deletes and
		// writes a file, rather than updating it.
		atomic: 200,

		...options.chokidar,
	}

	const handler = (filePath) => {
		if (typeof filePath === 'string') {
			os.stdout(`[p69] Recompile: ${path.resolve(filePath)}`)
		} else {
			os.stdout(`[p69] Recompile: ${path.resolve(src)}`)
		}

		compileFiles(tokenMaps, options)
	}

	const absSrc = path.resolve(src)
	os.stdout(`[p69] Watching directory: ${path.resolve(src)}`)

	const watcher = chokidar
		.watch(`${src}`, chokidarOptions) //
		.on('ready', handler)
		.on('add', handler)
		.on('change', handler)
		.on('unlink', handler)
		.on('addDir', handler)
		.on('unlinkDir', handler)
		.on('error', (e) => {
			os.stderr(`Watcher error: ${e}`) //
		})

	return watcher.close
}
