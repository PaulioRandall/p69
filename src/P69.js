import path from 'node:path'

import util from './util.js'

import readTokenFiles from './readTokenFiles.js'
import compile from './compile.js'
import compileFile from './compileFile.js'
import compileDir from './compileDir.js'
import watchDir from './watchDir.js'

export default class P69 {
	// readTokenFiles loads and returns an array of token maps
	// from the array of $tokenFiles. The result array's
	// order will reflect the file order, remembering each
	// file may return multiple token maps.
	static readTokenFiles(tokenFiles) {
		return readTokenFiles(tokenFiles)
	}

	// compile resolves P69 token within $p69Content string
	// (CSS with named placeholder tokens) with the
	// associated value found in $tokenMaps to produce a pure
	// CSS string, i.e. search and replace tokens with values.
	//
	// $tokenMaps is searched in order so if a token's value
	// is not found in the first map, it searches the second
	// and so on.
	//
	// By default, $onError will print unresolvable tokens
	// then carry on. You may throw from $onError to exit
	// early.
	static compile(p69Content, tokenMaps, options = {}) {
		return compile(p69Content, tokenMaps, options.onError)
	}

	// compileFile calls compile with the $tokenMaps and
	// content of $filename then stores the result as a .css
	// file.
	//
	// If $options.dst is specified then it will be used as
	// the destination .css file, otherwise a .css file will
	// be created (or overidden) in the same directory.
	//
	// If $options.onError is specified it will be passed to
	// the compile function.
	//
	// If $options.dryRun is true then file writing is
	// skipped.
	static compileFile(filename, tokenMaps, options = {}) {
		return compileFile(filename, tokenMaps, options)
	}

	// compileDir calls compile with the $tokenMaps and
	// for all .p69 files under $dir.
	//
	// If $options.dst is specified then it will be used as
	// the destination .css file where all CSS will be
	// written, otherwise a .css file will be created (or
	// overidden) for each .p69 in the same directory.
	//
	// If $options.onError is specified it will be passed to
	// the compile function.
	//
	// If $options.dryRun is true then file writing is
	// skipped.
	static compileDir(dir, tokenMaps, options = {}) {
		return compileDir(dir, tokenMaps, {
			onError: this._onError,
			...options,
		})
	}

	_onError = undefined
	_tokenMaps = []

	_setTokenMaps(tokenMaps) {
		this._tokenMaps = tokenMaps
	}

	// loadTokenFiles does the same as P69.readTokenFiles but
	// stores the result internally for use by the comile and
	// watch methods. See P69.readTokenFiles for more details.
	loadTokenFiles(tokenFiles) {
		this._tokenMaps = readTokenFiles(tokenFiles)
	}

	// watchTokenFiles watches the passed $tokenFiles and
	// updates the internal array of token mappings if
	// any files change. Order is maintained.
	//
	// If $options.chokidar are specified they will
	// overide P69 default chokidar options on an
	// option-by-option basis.
	async watchTokenFiles(tokenFiles, options = {}) {
		return watchTokenFiles(
			tokenFiles, //
			this._setTokenMaps.bind(this),
			{
				onError: this._onError,
				...options,
			}
		)
	}

	// setOnError sets the handler function that fires when
	// an error is encountered, e.g. when a token does not
	// map to a value within the token mappings.
	//
	// If set as null or undefined then the default handler
	// function is used. If a non-function is passed
	// then an error is thrown.
	setOnError(onError = null) {
		if (onError === null || onError === undefined) {
			this._onError = undefined
			return
		}

		if (typeof onError !== 'function') {
			const t = typeof onError
			throw newError(`'onError' must be a function, not ${t}`)
		}

		this._onError = onError
	}

	// compileFile calls P69.compileFile with the loaded
	// token maps and set options.
	//
	// A call to loadTokenMaps must be performed first to
	// load the token maps.
	compileFile(filename, options = {}) {
		return compileFile(filename, this._tokenMaps, {
			onError: this._onError,
			...options,
		})
	}

	// compileDir calls P69.compileDir with the loaded
	// token maps and set options.
	//
	// A call to loadTokenMaps must be performed first to
	// load the token maps.
	compileDir(dir, options = {}) {
		if (this._tokenMaps.length === 0) {
			util.warn(
				'No token maps have been loaded. Compiling will be attempted but onError will be called for every token encountered.'
			)
		}

		return compileDir(dir, this._tokenMaps, {
			onError: this._onError,
			...options,
		})
	}

	// watchDir watches all .p69 files within the $dir
	// directory and sub directories and calls compileDir,
	// each time a .p69 file is created, deleted, or changed.
	//
	// A call to loadTokenMaps must be performed first to
	// load the token maps.
	//
	// If $options.dst (CSS file path) is provided then all
	// compiled CSS will be placed into $options.dst,
	// otherwise individual .css files will be created or
	// overidden in the same directory as the .p69 file.
	//
	// If $options.chokidar options are specified they will
	// overide P69 default chokidar options on an
	// option-by-option basis.
	async watchDir(dir, options = {}) {
		return watchDir(dir, this._tokenMaps, {
			onError: this._onError,
			...options,
		})
	}
}
