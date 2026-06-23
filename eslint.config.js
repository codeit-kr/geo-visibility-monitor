import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['node_modules', 'snapshots', 'dist', '.serena', 'dashboard'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // AGENTS §9 — arrow function 만(function 선언 금지).
    rules: { 'func-style': ['error', 'expression', { allowArrowFunctions: true }] },
  },
  {
    // 엔진 어댑터·LLM 판정기는 외부 provider 의 untyped JSON 을 정규화 → any 불가피.
    files: ['src/engines/**/*.ts', 'src/analyze/llmJudge.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
)
