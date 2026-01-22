'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import StatusBadge from '@/components/StatusBadge'
import { 
  Mic, 
  Video, 
  FileText, 
  Clock, 
  User, 
  Calendar,
  Download,
  ExternalLink,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Play,
  CheckCircle,
  AlertCircle,
  Loader,
  Upload,
  Link as LinkIcon,
  Users,
  Building,
  Briefcase,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react'

interface Transcription {
  id: string
  name: string
  status: 'completed' | 'processing' | 'failed' | 'pending'
  created_at: string
  duration?: number
  language?: string
  text?: string
  linkedTo?: {
    type: 'meeting' | 'department' | 'project'
    id: string
    name: string
  }
}

// Список людей для привязки 1:1
const people = [
  'Виктория Бакирова', 'Артём Василевский', 'Евгений Косицын', 
  'Александра Комардина', 'Анастасия Андрианова', 'Юлия Лелик',
  'Сергей Кумашев', 'Константин', 'Пётр', 'Никита Жирнов',
  'Наташа', 'Лёля', 'Максим', 'Алина', 'Полина', 'Тимур', 'Ирина'
]

// Список отделов
const departments = [
  { id: 'sales', name: 'Отдел продаж' },
  { id: 'china', name: 'Отдел Китая' },
  { id: 'marketing', name: 'Маркетинг' },
  { id: 'hr', name: 'HR' },
  { id: 'dubai', name: 'Дубай' },
  { id: 'logistics', name: 'Логистика' },
]

export default function RecordingsPage() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showNewModal, setShowNewModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [selectedTranscription, setSelectedTranscription] = useState<Transcription | null>(null)
  const [newMeetingUrl, setNewMeetingUrl] = useState('')
  const [newAudioUrl, setNewAudioUrl] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [showGeminiModal, setShowGeminiModal] = useState(false)
  const [geminiAnalysis, setGeminiAnalysis] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedTextForAnalysis, setSelectedTextForAnalysis] = useState('')
  
  // Форма привязки
  const [linkType, setLinkType] = useState<'meeting' | 'department' | 'project'>('meeting')
  const [linkTargetId, setLinkTargetId] = useState('')
  const [linkTargetName, setLinkTargetName] = useState('')

  // Загрузка транскрипций из Transkriptor
  const loadTranscriptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/transkriptor')
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        setTranscriptions([])
      } else {
        // Нормализуем данные
        const files = data.files || data.transcriptions || data.data || []
        setTranscriptions(Array.isArray(files) ? files : [])
      }
    } catch (err) {
      setError('Не удалось загрузить транскрипции')
      setTranscriptions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTranscriptions()
  }, [loadTranscriptions])

  // Создать транскрипцию из URL
  const createFromUrl = async (url: string, type: 'audio' | 'meeting') => {
    setSyncing(true)
    try {
      const response = await fetch('/api/transkriptor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: type === 'meeting' ? 'schedule_meeting' : 'transcribe_url',
          [type === 'meeting' ? 'meetingUrl' : 'url']: url,
          language: 'ru'
        })
      })
      const data = await response.json()
      
      if (data.error) {
        alert(data.error + (data.suggestion ? '\n' + data.suggestion : ''))
      } else {
        alert('Запрос отправлен! Транскрипция появится после обработки.')
        loadTranscriptions()
      }
    } catch (err) {
      alert('Ошибка при создании транскрипции')
    } finally {
      setSyncing(false)
      setShowNewModal(false)
      setNewMeetingUrl('')
      setNewAudioUrl('')
    }
  }

  // Анализ с Gemini
  const analyzeWithGemini = async (text: string, action: 'analyze' | 'categorize' | 'summarize' = 'categorize') => {
    setAnalyzing(true)
    setGeminiAnalysis(null)
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text,
          context: selectedTranscription?.name || ''
        })
      })
      const data = await response.json()
      
      if (data.error) {
        alert('Ошибка: ' + data.error + (data.details ? '\n' + data.details : ''))
      } else {
        setGeminiAnalysis(data.result)
      }
    } catch (err) {
      alert('Ошибка при анализе с Gemini')
    } finally {
      setAnalyzing(false)
    }
  }

  // Привязать транскрипцию к сущности
  const linkTranscription = async () => {
    if (!selectedTranscription || !linkTargetName) return
    
    // Сохраняем локально (в реальности отправляем на API)
    const updated = transcriptions.map(t => 
      t.id === selectedTranscription.id 
        ? { ...t, linkedTo: { type: linkType, id: linkTargetId, name: linkTargetName } }
        : t
    )
    setTranscriptions(updated)
    
    // Сохраняем в базу
    try {
      await fetch('/api/page-data?page=transcription-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: updated.filter(t => t.linkedTo).map(t => ({ id: t.id, linkedTo: t.linkedTo })) })
      })
    } catch (e) {
      console.error('Error saving link:', e)
    }
    
    setShowLinkModal(false)
    setSelectedTranscription(null)
    setLinkTargetName('')
  }

  // Фильтрация
  const filteredTranscriptions = transcriptions.filter(t => {
    const matchesSearch = t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.text?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-400" size={18} />
      case 'processing': return <Loader className="text-yellow-400 animate-spin" size={18} />
      case 'failed': return <AlertCircle className="text-red-400" size={18} />
      default: return <Clock className="text-dark-400" size={18} />
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '—'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🎙️ Записи встреч</h1>
          <p className="text-dark-400 mt-1">Интеграция с Transkriptor — автоматическая транскрибация</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTranscriptions}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Обновить
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Новая запись
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <FileText className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{transcriptions.length}</p>
              <p className="text-dark-400 text-sm">Всего записей</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{transcriptions.filter(t => t.status === 'completed').length}</p>
              <p className="text-dark-400 text-sm">Готово</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Loader className="text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{transcriptions.filter(t => t.status === 'processing').length}</p>
              <p className="text-dark-400 text-sm">В обработке</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Users className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{transcriptions.filter(t => t.linkedTo).length}</p>
              <p className="text-dark-400 text-sm">Привязано</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
            <input
              type="text"
              placeholder="Поиск по названию или тексту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value="all">Все статусы</option>
            <option value="completed">Готово</option>
            <option value="processing">В обработке</option>
            <option value="pending">Ожидает</option>
            <option value="failed">Ошибка</option>
          </select>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
          <p className="font-medium">⚠️ {error}</p>
          <p className="text-sm mt-1 text-red-400/70">
            Проверьте API ключ Transkriptor или попробуйте обновить список
          </p>
        </div>
      )}

      {/* Transcriptions List */}
      <Card title="📋 Список транскрипций">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-primary-400" size={32} />
            <span className="ml-3 text-dark-400">Загрузка из Transkriptor...</span>
          </div>
        ) : filteredTranscriptions.length === 0 ? (
          <div className="text-center py-12 text-dark-400">
            <Mic size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Нет транскрипций</p>
            <p className="text-sm mt-1">Создайте новую запись или загрузите аудио/видео</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
            >
              Создать запись
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTranscriptions.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-dark-700/50 rounded-xl hover:bg-dark-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(t.status)}
                      <h3 className="font-medium">{t.name || `Запись ${t.id}`}</h3>
                      {t.linkedTo && (
                        <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                          {t.linkedTo.type === 'meeting' ? '👤' : t.linkedTo.type === 'department' ? '🏢' : '📁'} {t.linkedTo.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-dark-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(t.created_at)}
                      </span>
                      {t.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDuration(t.duration)}
                        </span>
                      )}
                      {t.language && (
                        <span className="uppercase">{t.language}</span>
                      )}
                    </div>
                    {t.text && (
                      <p className="mt-2 text-sm text-dark-300 line-clamp-2">
                        {t.text.substring(0, 200)}...
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {t.status === 'completed' && (
                      <>
                        {t.text && (
                          <button
                            onClick={() => {
                              setSelectedTextForAnalysis(t.text || '')
                              setSelectedTranscription(t)
                              analyzeWithGemini(t.text || '', 'categorize')
                              setShowGeminiModal(true)
                            }}
                            className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
                            title="Анализировать с Gemini"
                          >
                            <Sparkles size={18} className="text-purple-400" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedTranscription(t)
                            setShowLinkModal(true)
                          }}
                          className="p-2 hover:bg-dark-600 rounded-lg transition-colors"
                          title="Привязать к встрече/отделу"
                        >
                          <LinkIcon size={18} />
                        </button>
                        <Link
                          href={`/recordings/${t.id}`}
                          className="p-2 hover:bg-dark-600 rounded-lg transition-colors"
                          title="Открыть"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* New Recording Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">🎙️ Новая запись</h2>
              <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-dark-700 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Запланировать запись встречи */}
              <div className="p-4 bg-dark-700/50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Video className="text-blue-400" size={24} />
                  <div>
                    <h3 className="font-medium">Записать встречу</h3>
                    <p className="text-sm text-dark-400">Zoom, Google Meet, Microsoft Teams</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Вставьте ссылку на встречу..."
                  value={newMeetingUrl}
                  onChange={(e) => setNewMeetingUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg mb-3"
                />
                <button
                  onClick={() => createFromUrl(newMeetingUrl, 'meeting')}
                  disabled={!newMeetingUrl || syncing}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2"
                >
                  {syncing ? <Loader className="animate-spin" size={18} /> : <Video size={18} />}
                  Запланировать запись
                </button>
              </div>

              {/* Транскрибировать аудио/видео */}
              <div className="p-4 bg-dark-700/50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Mic className="text-green-400" size={24} />
                  <div>
                    <h3 className="font-medium">Транскрибировать файл</h3>
                    <p className="text-sm text-dark-400">По ссылке на аудио/видео</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="URL аудио или видео файла..."
                  value={newAudioUrl}
                  onChange={(e) => setNewAudioUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg mb-3"
                />
                <button
                  onClick={() => createFromUrl(newAudioUrl, 'audio')}
                  disabled={!newAudioUrl || syncing}
                  className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2"
                >
                  {syncing ? <Loader className="animate-spin" size={18} /> : <Upload size={18} />}
                  Транскрибировать
                </button>
              </div>

              <p className="text-center text-dark-400 text-sm">
                Или откройте <a href="https://app.transkriptor.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Transkriptor</a> для загрузки файла напрямую
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && selectedTranscription && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">🔗 Привязать транскрипцию</h2>
              <button onClick={() => setShowLinkModal(false)} className="p-2 hover:bg-dark-700 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <p className="text-dark-400 mb-4">
              Запись: <span className="text-white">{selectedTranscription.name}</span>
            </p>

            <div className="space-y-4">
              {/* Тип привязки */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setLinkType('meeting')}
                  className={`p-3 rounded-xl border transition-colors ${
                    linkType === 'meeting' 
                      ? 'bg-primary-500/20 border-primary-500' 
                      : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                  }`}
                >
                  <User className="mx-auto mb-1" size={24} />
                  <p className="text-sm">1:1 Встреча</p>
                </button>
                <button
                  onClick={() => setLinkType('department')}
                  className={`p-3 rounded-xl border transition-colors ${
                    linkType === 'department' 
                      ? 'bg-primary-500/20 border-primary-500' 
                      : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                  }`}
                >
                  <Building className="mx-auto mb-1" size={24} />
                  <p className="text-sm">Отдел</p>
                </button>
                <button
                  onClick={() => setLinkType('project')}
                  className={`p-3 rounded-xl border transition-colors ${
                    linkType === 'project' 
                      ? 'bg-primary-500/20 border-primary-500' 
                      : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                  }`}
                >
                  <Briefcase className="mx-auto mb-1" size={24} />
                  <p className="text-sm">Проект</p>
                </button>
              </div>

              {/* Выбор цели */}
              {linkType === 'meeting' && (
                <select
                  value={linkTargetName}
                  onChange={(e) => {
                    setLinkTargetName(e.target.value)
                    setLinkTargetId(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                  }}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg"
                >
                  <option value="">Выберите человека...</option>
                  {people.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              )}

              {linkType === 'department' && (
                <select
                  value={linkTargetId}
                  onChange={(e) => {
                    const dept = departments.find(d => d.id === e.target.value)
                    setLinkTargetId(e.target.value)
                    setLinkTargetName(dept?.name || '')
                  }}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg"
                >
                  <option value="">Выберите отдел...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              )}

              {linkType === 'project' && (
                <input
                  type="text"
                  placeholder="Название проекта..."
                  value={linkTargetName}
                  onChange={(e) => {
                    setLinkTargetName(e.target.value)
                    setLinkTargetId(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                  }}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg"
                />
              )}

              <button
                onClick={linkTranscription}
                disabled={!linkTargetName}
                className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium"
              >
                Привязать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gemini Analysis Modal */}
      {showGeminiModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-purple-400" size={24} />
                  Анализ с Gemini
                </h2>
                <p className="text-sm text-dark-400 mt-1">
                  {selectedTranscription?.name || 'Транскрипция'}
                </p>
              </div>
              <button onClick={() => setShowGeminiModal(false)} className="p-2 hover:bg-dark-700 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {analyzing ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-purple-400" size={32} />
                <span className="ml-3 text-dark-400">Gemini анализирует транскрипцию...</span>
              </div>
            ) : geminiAnalysis ? (
              <div className="space-y-4">
                {geminiAnalysis.goals && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <h3 className="font-semibold text-blue-400 mb-2">🎯 Цели / Планы</h3>
                    <p className="text-dark-200 whitespace-pre-wrap">{geminiAnalysis.goals}</p>
                  </div>
                )}
                {geminiAnalysis.planFact && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <h3 className="font-semibold text-green-400 mb-2">📊 План / Факт</h3>
                    <p className="text-dark-200 whitespace-pre-wrap">{geminiAnalysis.planFact}</p>
                  </div>
                )}
                {geminiAnalysis.risksProblems && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Риски / Проблемы</h3>
                    <p className="text-dark-200 whitespace-pre-wrap">{geminiAnalysis.risksProblems}</p>
                  </div>
                )}
                {geminiAnalysis.initiatives && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <h3 className="font-semibold text-purple-400 mb-2">💡 Инициативы</h3>
                    <p className="text-dark-200 whitespace-pre-wrap">{geminiAnalysis.initiatives}</p>
                  </div>
                )}
                {geminiAnalysis.personalPriorities && (
                  <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                    <h3 className="font-semibold text-pink-400 mb-2">👤 Личные приоритеты</h3>
                    <p className="text-dark-200 whitespace-pre-wrap">{geminiAnalysis.personalPriorities}</p>
                  </div>
                )}
                {geminiAnalysis.text && !geminiAnalysis.goals && (
                  <div className="p-4 bg-dark-700/50 rounded-xl">
                    <h3 className="font-semibold mb-2">📝 Резюме</h3>
                    <p className="text-dark-200 whitespace-pre-wrap">{geminiAnalysis.text}</p>
                  </div>
                )}
                {geminiAnalysis.decisions && (
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                    <h3 className="font-semibold text-indigo-400 mb-2">✅ Решения</h3>
                    <ul className="list-disc list-inside space-y-1 text-dark-200">
                      {Array.isArray(geminiAnalysis.decisions) ? 
                        geminiAnalysis.decisions.map((d: string, i: number) => (
                          <li key={i}>{d}</li>
                        )) : <li>{geminiAnalysis.decisions}</li>
                      }
                    </ul>
                  </div>
                )}
                {geminiAnalysis.actions && (
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                    <h3 className="font-semibold text-cyan-400 mb-2">📋 Действия</h3>
                    <ul className="list-disc list-inside space-y-1 text-dark-200">
                      {Array.isArray(geminiAnalysis.actions) ? 
                        geminiAnalysis.actions.map((a: string, i: number) => (
                          <li key={i}>{a}</li>
                        )) : <li>{geminiAnalysis.actions}</li>
                      }
                    </ul>
                  </div>
                )}
                {geminiAnalysis.problems && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <h3 className="font-semibold text-red-400 mb-2">🚨 Проблемы</h3>
                    <ul className="list-disc list-inside space-y-1 text-dark-200">
                      {Array.isArray(geminiAnalysis.problems) ? 
                        geminiAnalysis.problems.map((p: string, i: number) => (
                          <li key={i}>{p}</li>
                        )) : <li>{geminiAnalysis.problems}</li>
                      }
                    </ul>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      if (selectedTranscription && geminiAnalysis) {
                        // Можно сохранить анализ в базу или использовать для заполнения формы
                        alert('Анализ готов! Используйте кнопку "Импорт из Transkriptor" в разделе 1:1 для автоматического заполнения.')
                      }
                    }}
                    className="flex-1 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
                  >
                    Использовать для 1:1 встречи
                  </button>
                  <button
                    onClick={() => {
                      setGeminiAnalysis(null)
                      analyzeWithGemini(selectedTextForAnalysis, 'analyze')
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"
                  >
                    Детальный анализ
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-dark-400">
                <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                <p>Нажмите кнопку для анализа</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
