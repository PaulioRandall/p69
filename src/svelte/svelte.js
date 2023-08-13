import p90 from 'p90'
import { stdout, stderr } from '../writers/writers.js'
import { processFileTree } from '../files/files.js'

let processed = false

export const defaultMimeTypes = ['p69', 'text/p69']

export const sveltePreprocessor = (valueMaps, userOptions = {}) => {
	const options = getOptions(userOptions)
	return newSvelteProcessor(valueMaps, options)
}

const getOptions = (userOptions) => {
	return {
		stdout,
		stderr,
		root: null,
		amalgamate: null,
		mimeTypes: defaultMimeTypes,
		...userOptions,
	}
}

const newSvelteProcessor = (valueMaps, options) => {
	return {
		name: 'P69: CSS preprocessor using P90',
		style: async ({ content, markup, attributes, filename }) => {
			if (!processed && options.root !== null) {
				processed = true
				await processFileTree(options.root, valueMaps, options)
			}

			if (!options.mimeTypes.includes(attributes.lang)) {
				return {
					code: content,
				}
			}

			const fileOptions = {
				...options,
				errorNote: filename,
			}

			return {
				code: await p90(valueMaps, content, fileOptions),
			}
		},
	}
}
