import compileFile from './compileFile.js'
import util from './util.js'

class CssFileBuilder {
	_filename = ''
	_content = ''

	constructor(filename) {
		this._filename = filename
	}

	append(s) {
		if (this._content) {
			this._content += '\n\n'
		}

		this._content += s.trim()
	}

	write() {
		util.createOrReplaceWholeFile(this._filename, this._content + '\n')
	}

	print() {
		console.log(this._filename, this._content)
	}
}

export default (dir, tokenMaps, options = {}) => {
	const cssFileBuilder = createCssFileBuilder(options.dst)
	compileP69Files(dir, cssFileBuilder, tokenMaps, options)

	if (!options.dryRun && cssFileBuilder) {
		cssFileBuilder.write()
	}
}

function compileP69Files(dir, cssFileBuilder, tokenMaps, options) {
	for (const p69File of util.listP69Files(dir)) {
		const css = compileFile(p69File, tokenMaps, {
			onError: options.onError,
			dryRun: options.dryRun || !!cssFileBuilder,
		})

		if (cssFileBuilder) {
			cssFileBuilder.append(css)
		}
	}
}

function createCssFileBuilder(dst) {
	if (!dst) {
		return null
	}

	if (util.isDir(dst)) {
		throw util.newError(`dst must be a file, not a directory`)
	}

	return new CssFileBuilder(dst)
}
