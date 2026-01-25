import { SignUp } from '@clerk/nextjs'
import { LegalLinks } from '@/components/common/LegalLinks'

export default function SignUpPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0b0b0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: '20px',
      }}
    >
      <SignUp afterSignUpUrl="/" signInUrl="/login" />
      <LegalLinks isDark={true} size="small" />
    </main>
  )
}