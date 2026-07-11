import compile from './compile.js'
import util from './util.js'

const doCompile = (content, mappings) => {
	return compile(content, mappings, (e) => {
		throw e
	})
}

describe('compile.js', () => {
	test('performs simple replacement', () => {
		const mappings = {
			green: 'forestgreen',
		}

		const act = doCompile(`$green`, mappings)
		expect(act).toEqual('forestgreen')
	})

	test('performs multiple simple replacements', () => {
		const mappings = {
			green: 'forestgreen',
			red: 'indianred',
		}

		const act = doCompile(
			util.joinLines(
				'color: $green;',
				'color: $red;',
				'color: $green;',
				'color: orange;'
			),
			mappings
		)

		expect(act).toEqual(
			util.joinLines(
				'color: forestgreen;',
				'color: indianred;',
				'color: forestgreen;',
				'color: orange;'
			)
		)
	})

	test('passes correct arguments to users value function', () => {
		let unspecifiedArg = 'something'

		const mappings = {
			func: (a, b, c, d) => {
				unspecifiedArg = d
				return `${a}-${b}-${c}`
			},
		}

		const act = doCompile(`$func(alpha, beta, charlie)`, mappings)
		expect(act).toEqual('alpha-beta-charlie')
		expect(unspecifiedArg).toBeUndefined()
	})
})
