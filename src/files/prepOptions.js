import path from 'node:path'
import util from '../util.js'

const DEFAULT_OPTIONS = {
	// onError (using P69 default)
	src: './src', //
	dst: './src/app.css',
	watch: false,
	chokidar: {},
}

export default function (userOptions) {
	const options = structuredClone(DEFAULT_OPTIONS)

	if (!userOptions) {
		return options
	}

	mergeUserOption(options, userOptions, 'src')
	mergeUserOption(options, userOptions, 'dst')
	mergeUserOption(options, userOptions, 'watch')
	mergeUserOption(options, userOptions, 'chokidar')
	mergeUserOption(options, userOptions, 'onError')

	if (options.dst) {
		options.dst = path.resolve(options.dst)
	}

	if (options.src) {
		options.src = path.resolve(options.src)
	}

	if (options.watch && !util.isObject(options.chokidar)) {
		throw util.newError(`options.chokidar must be an object`)
	}

	return options
}

function mergeUserOption(options, userOptions, optionName) {
	if (Object.hasOwn(userOptions, optionName)) {
		options[optionName] = userOptions[optionName]
	}
}
