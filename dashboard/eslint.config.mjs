import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['.next', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    // 엔진 레포와 동일: arrow function 만(function 선언 금지).
    rules: { 'func-style': ['error', 'expression', { allowArrowFunctions: true }] },
  },
  {
    // CommonJS 설정 파일(next.config.js 등)
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },
  {
    // 마크다운 hast 트리(rehype 플러그인)는 untyped 노드를 순회 → any 불가피.
    files: ['src/CallsDetail.tsx'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
)
