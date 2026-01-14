import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0b0b0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SignIn afterSignInUrl="/" signUpUrl="/signup" />
    </main>
  )
}