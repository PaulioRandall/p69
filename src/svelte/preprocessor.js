import p90 from '../p90/p90.js'
import { processTree } from '../files/process.js'

export default (tokenMaps, userOptions = {}) => {
	return newSvelteProcessor(tokenMaps, {
		throwOnError: false,
		root: './src',
		output: './src/app.css',
		mimeTypes: [undefined, 'p69', 'text/p69'],
		...userOptions,
	})
}

const newSvelteProcessor = (tokenMaps, options) => {
	if (options.root) {
		processTree(options.root, tokenMaps, options)
	}

	return {
		name: 'p69-svelte-preprocessor',
		style: async ({ attributes, content, filename }) => {
			if (!acceptsMimeType(options, attributes.lang)) {
				return
			}

			return {
				code: await compileCSS(tokenMaps, content, filename, options),
			}
		},
	}
}

const acceptsMimeType = (options, lang) => {
	return options.mimeTypes.includes(lang)
}

const compileCSS = (tokenMaps, code, filename, options) => {
	return p90(tokenMaps, code, {
		...options,
		errorNote: filename,
	})
}
