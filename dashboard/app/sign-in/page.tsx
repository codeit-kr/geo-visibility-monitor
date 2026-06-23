'use client'

import { signIn } from 'next-auth/react'

const SignInPage = () => (
  <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#e7ebf2', padding: 24 }}>
    <div
      style={{
        background: '#fff',
        border: '1px solid #d6dbe6',
        borderRadius: 16,
        padding: '40px 36px',
        maxWidth: 360,
        width: '100%',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#97a0b0',
        }}
      >
        GEO · AI Visibility
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 6px', color: '#14181f' }}>대시보드 로그인</h1>
      <p style={{ fontSize: 13.5, color: '#5b6675', marginBottom: 24, lineHeight: 1.6 }}>
        <b style={{ color: '#2d43e0' }}>@codeit.com</b> 구글 계정으로만 접근할 수 있습니다.
      </p>
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/' })}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 9,
          border: '1px solid #d6dbe6',
          background: '#fff',
          fontSize: 14,
          fontWeight: 600,
          color: '#14181f',
          cursor: 'pointer',
        }}
      >
        Google로 로그인
      </button>
    </div>
  </main>
)

export default SignInPage
