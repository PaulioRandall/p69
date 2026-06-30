import path from 'path'

const DEFAULT_OPTIONS = {
	src: './src', //
	dst: './src/app.css',
	// onError (using P69 default)
}

export default function (userOptions) {
	const options = structuredClone(DEFAULT_OPTIONS)

	if (!userOptions) {
		return options
	}

	mergeUserOption(options, userOptions, 'src')
	mergeUserOption(options, userOptions, 'dst')
	mergeUserOption(options, userOptions, 'onError')

	if (options.dst) {
		options.dst = path.resolve(options.dst)
	}

	if (options.src) {
		options.src = path.resolve(options.src)
	}

	return options
}

function mergeUserOption(options, userOptions, optionName) {
	if (Object.hasOwn(userOptions, optionName)) {
		options[optionName] = userOptions[optionName]
	}
}
