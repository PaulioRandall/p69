import compile from './compile.js'
import util from './util.js'

export default (filename, tokenMaps, options = {}) => {
	const p69Content = util.readWholeFile(filename)
	const cssContent = compile(p69Content, tokenMaps, options.onError)
	const content = cssContent.trim() + '\n'

	if (options.dryRun !== true) {
		const dst = resolveDst(filename, options.dst)
		util.createOrReplaceWholeFile(dst, content)
	}

	return content
}

function resolveDst(filename, dst) {
	if (!dst) {
		return util.replaceFileExt(filename, 'css')
	}

	if (util.isDir(dst)) {
		throw util.newError(`dst must be a file, not a directory`)
	}

	return dst
}
