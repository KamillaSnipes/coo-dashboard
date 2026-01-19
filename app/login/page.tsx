'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail, Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        login: login.trim(),
        password: password,
        redirect: false,
        callbackUrl: callbackUrl,
      })

      if (result?.error) {
        setLoading(false)
        setError(result.error === 'CredentialsSignin' 
          ? 'Неверный логин или пароль' 
          : result.error)
      } else if (result?.ok) {
        // Принудительный редирект через window.location
        window.location.href = callbackUrl
      } else {
        setLoading(false)
        setError('Ошибка авторизации')
      }
    } catch (err) {
      setLoading(false)
      setError('Произошла ошибка. Попробуйте снова.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
            COO Dashboard
          </h1>
          <p className="text-dark-400 mt-2">Headcorn / Megamind</p>
        </div>

        {/* Login Form */}
        <div className="bg-dark-800/80 backdrop-blur-xl border border-dark-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Login */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Логин
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full bg-dark-700/50 border border-dark-600 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Введите логин"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-700/50 border border-dark-600 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Введите пароль"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Проверка...
                </>
              ) : (
                'Войти'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-dark-700">
            <div className="flex items-center gap-2 text-xs text-dark-500">
              <Lock size={14} />
              <span>Защищённое соединение</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-dark-500 text-sm mt-6">
          © 2026 Headcorn. Все права защищены.
        </p>
      </div>
    </div>
  )
}

function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20 flex items-center justify-center">
      <div className="animate-pulse text-dark-400">Загрузка...</div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}
