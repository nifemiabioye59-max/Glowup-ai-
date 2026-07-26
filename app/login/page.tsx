import { LoginForm } from '@/components/login-form'
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-glow-50 via-white to-lavender-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">Sign in to continue your glow up</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
