import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';

export default [
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.es2021,
				...globals.browser,
			},
		},
		settings: {
			jsdoc: {
				mode: 'typescript'
			}
		}
	},
	jsdoc.configs['flat/recommended-typescript-flavor'],
	{
		files: ['htdocs/js/**/*.js'],
		rules: {
			'jsdoc/valid-types': 'error',
			'quotes': [
				'error',
				'single', {
					'avoidEscape': true,
					'allowTemplateLiterals': true
				}
			],
		}
	}
];
