import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
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
      <SignUp afterSignUpUrl="/" signInUrl="/login" />
    </main>
  )
}