import path from 'node:path'
import prepOptions from './prepOptions.js'

describe('prepOptions.js', () => {
	test('No user options', () => {
		const act = prepOptions()

		expect(act).toEqual({
			src: './src', //
			dst: './src/app.css',
			watch: false,
			chokidar: {},
		})
	})

	test('Some user options', () => {
		const f = (err, token) => {
			// Do nothing
		}

		const act = prepOptions({
			dst: './src/styles.css',
			onError: f,
		})

		expect(act).toEqual({
			src: path.resolve('./src'), //
			dst: path.resolve('./src/styles.css'),
			onError: f,
			watch: false,
			chokidar: {},
		})
	})
})
