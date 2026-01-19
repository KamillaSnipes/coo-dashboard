'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { ArrowLeft, Shield, Smartphone, Check, X, Loader2, Lock, Copy, CheckCircle, AlertTriangle, LogOut } from 'lucide-react'
import Card from '@/components/Card'

export default function SecuritySettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)
  const [showDisable, setShowDisable] = useState(false)
  const [disablePassword, setDisablePassword] = useState('')

  useEffect(() => {
    load2FAStatus()
  }, [])

  const load2FAStatus = async () => {
    try {
      const res = await fetch('/api/auth/2fa')
      const data = await res.json()
      setIs2FAEnabled(data.enabled || false)
      if (!data.enabled && data.qrCode) {
        setQrCode(data.qrCode)
        setSecret(data.secret)
      }
    } catch (err) {
      console.error('Failed to load 2FA status:', err)
    } finally {
      setLoading(false)
    }
  }

  const enable2FA = async () => {
    if (verifyCode.length !== 6) return
    
    setSaving(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, code: verifyCode })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setIs2FAEnabled(true)
        setShowSetup(false)
        setSuccess('2FA успешно включена! При следующем входе потребуется код.')
        setTimeout(() => setSuccess(''), 5000)
      } else {
        setError(data.error || 'Ошибка включения 2FA')
      }
    } catch (err) {
      setError('Произошла ошибка')
    } finally {
      setSaving(false)
    }
  }

  const disable2FA = async () => {
    if (!disablePassword) return
    
    setSaving(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/2fa', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setIs2FAEnabled(false)
        setShowDisable(false)
        setDisablePassword('')
        setSuccess('2FA отключена')
        setTimeout(() => setSuccess(''), 5000)
        // Reload to get new QR code
        load2FAStatus()
      } else {
        setError(data.error || 'Ошибка отключения 2FA')
      }
    } catch (err) {
      setError('Произошла ошибка')
    } finally {
      setSaving(false)
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-dark-700 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Безопасность</h1>
          <p className="text-dark-400 mt-1">Настройки аутентификации и защиты</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Current User */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
            <Lock size={24} className="text-primary-400" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{session?.user?.name || 'Пользователь'}</div>
            <div className="text-sm text-dark-400">{session?.user?.email}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
          >
            <LogOut size={16} />
            Выйти
          </button>
        </div>
      </Card>

      {/* 2FA Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${is2FAEnabled ? 'bg-green-500/20' : 'bg-dark-700'}`}>
              <Shield size={20} className={is2FAEnabled ? 'text-green-400' : 'text-dark-400'} />
            </div>
            <div>
              <h3 className="font-semibold">Двухфакторная аутентификация (2FA)</h3>
              <p className="text-sm text-dark-400">
                Дополнительный уровень защиты при входе
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${is2FAEnabled ? 'bg-green-500/20 text-green-300' : 'bg-dark-700 text-dark-400'}`}>
            {is2FAEnabled ? '✓ Включена' : 'Отключена'}
          </div>
        </div>

        {is2FAEnabled ? (
          /* 2FA Enabled State */
          <div>
            <p className="text-dark-300 mb-4">
              Двухфакторная аутентификация активна. При каждом входе будет запрашиваться код из приложения.
            </p>
            
            {showDisable ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-300 mb-3">
                  Для отключения 2FA введите пароль:
                </p>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:border-red-500"
                  placeholder="Введите пароль"
                />
                <div className="flex gap-2">
                  <button
                    onClick={disable2FA}
                    disabled={saving || !disablePassword}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-lg text-sm"
                  >
                    {saving ? 'Отключение...' : 'Отключить 2FA'}
                  </button>
                  <button
                    onClick={() => { setShowDisable(false); setDisablePassword(''); }}
                    className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDisable(true)}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-red-400 rounded-lg text-sm"
              >
                Отключить 2FA
              </button>
            )}
          </div>
        ) : showSetup ? (
          /* 2FA Setup */
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code */}
              <div className="text-center">
                <p className="text-sm text-dark-400 mb-3">
                  1. Отсканируйте QR-код в Google Authenticator
                </p>
                <div className="bg-white p-4 rounded-xl inline-block">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              </div>

              {/* Manual Entry */}
              <div>
                <p className="text-sm text-dark-400 mb-3">
                  Или введите код вручную:
                </p>
                <div className="flex items-center gap-2 p-3 bg-dark-700 rounded-lg mb-6">
                  <code className="flex-1 text-sm font-mono break-all">{secret}</code>
                  <button
                    onClick={copySecret}
                    className="p-2 hover:bg-dark-600 rounded-lg"
                  >
                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>

                <p className="text-sm text-dark-400 mb-3">
                  2. Введите 6-значный код из приложения:
                </p>
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-primary-500"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={enable2FA}
                disabled={saving || verifyCode.length !== 6}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 rounded-lg font-medium"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Проверка...
                  </span>
                ) : (
                  'Включить 2FA'
                )}
              </button>
              <button
                onClick={() => setShowSetup(false)}
                className="px-6 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          /* Enable 2FA Button */
          <div>
            <p className="text-dark-400 mb-4">
              Включите двухфакторную аутентификацию для дополнительной защиты вашего аккаунта.
              Вам понадобится приложение Google Authenticator или Authy.
            </p>
            <button
              onClick={() => setShowSetup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
            >
              <Smartphone size={18} />
              Настроить 2FA
            </button>
          </div>
        )}
      </Card>

      {/* Security Tips */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Shield size={18} className="text-primary-400" />
          Рекомендации по безопасности
        </h3>
        <ul className="space-y-3 text-sm text-dark-300">
          <li className="flex items-start gap-2">
            <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            Используйте уникальный сложный пароль
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            Включите двухфакторную аутентификацию
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            Не передавайте свои учётные данные третьим лицам
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            Выходите из аккаунта на чужих устройствах
          </li>
        </ul>
      </Card>
    </div>
  )
}

