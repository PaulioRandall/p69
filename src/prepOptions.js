import os from './os.js'

export default (userOptions) => {
	const options = {
		onError: defaultOnError,
		...userOptions,
	}

	if (typeof options.onError !== 'function') {
		throw new Error(`[P69] options.onError must be a function`)
	}

	return options
}

const defaultOnError = (err, token) => {
	os.stderr('[P69] ', err)
	os.stderr('[P69] ', JSON.stringify(token, null, 2))
}
