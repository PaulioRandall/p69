import compile from './compile.js'
import os from './os.js'
import util from './util.js'

export default (filename, tokenMaps, options = {}) => {
	const p69Content = os.readWholeFile(filename)
	const cssContent = compile(p69Content, tokenMaps, options.onError)
	const content = cssContent.trim() + '\n'

	if (options.dryRun !== true) {
		dst = resolveDst(filename, options.dst)
		os.createOrReplaceWholeFile(dst, content)
	}

	return content
}

function resolveDst(filename, dst) {
	if (!dst) {
		return os.replaceFileExt(filename, 'css')
	}

	if (os.isDir(dst)) {
		throw util.newError(`dst must be a file, not a directory`)
	}

	return dst
}
