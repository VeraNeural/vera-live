import { SignIn } from '@clerk/nextjs'
import { LegalLinks } from '@/components/common/LegalLinks'

export default function LoginPage() {
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
      <SignIn afterSignInUrl="/" signUpUrl="/signup" />
      <LegalLinks isDark={true} size="small" />
    </main>
  )
}