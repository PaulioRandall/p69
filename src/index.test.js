import compile from './index.js'

const joinLines = (...lines) => lines.join('\n')

const doCompile = (mapping, content, options = {}) => {
	return compile(mapping, content, {
		onError: (e) => {
			throw e
		},
		...options,
	})
}

describe('index.js', () => {
	describe('compile', () => {
		test('performs simple replacement', () => {
			const mapping = {
				green: 'forestgreen',
			}

			const act = doCompile(mapping, `$green`)
			expect(act).toEqual('forestgreen')
		})

		test('performs multiple simple replacements', () => {
			const mapping = {
				green: 'forestgreen',
				red: 'indianred',
			}

			const act = doCompile(
				mapping,
				joinLines(
					'color: $green;',
					'color: $red;',
					'color: $green;',
					'color: orange;'
				)
			)

			expect(act).toEqual(
				joinLines(
					'color: forestgreen;',
					'color: indianred;',
					'color: forestgreen;',
					'color: orange;'
				)
			)
		})

		test('passes correct arguments to users value function', () => {
			let unspecifiedArg = 'something'

			const mapping = {
				func: (a, b, c, d) => {
					unspecifiedArg = d
					return `${a}-${b}-${c}`
				},
			}

			const act = doCompile(mapping, `$func(alpha, beta, charlie)`)
			expect(act).toEqual('alpha-beta-charlie')
			expect(unspecifiedArg).toBeUndefined()
		})
	})
})
