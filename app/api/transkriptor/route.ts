import { NextRequest, NextResponse } from 'next/server'

const TRANSKRIPTOR_API_KEY = process.env.TRANSKRIPTOR_API_KEY || '9254f95d5da965c7ba7a884023acb60e273c362ac819c9d51e0fd7e4a4400ad34561fdac57cb4f78031c22ac2ef842266655ee03f9bcbdd8a670f3d62aa22917'
const TRANSKRIPTOR_API_URL = 'https://api.transkriptor.com/v1'

interface TranscriptionFile {
  id: string
  name: string
  status: 'completed' | 'processing' | 'failed' | 'pending'
  created_at: string
  duration?: number
  language?: string
  text?: string
  speakers?: Array<{
    name: string
    segments: Array<{
      start: number
      end: number
      text: string
    }>
  }>
}

// GET - Получить список транскрипций или одну транскрипцию по ID
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')
  const action = searchParams.get('action')
  
  try {
    // Получить одну транскрипцию
    if (id) {
      const response = await fetch(`${TRANSKRIPTOR_API_URL}/transcriptions/${id}`, {
        headers: {
          'Authorization': `Bearer ${TRANSKRIPTOR_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        // Попробуем альтернативный endpoint
        const altResponse = await fetch(`https://api.transkriptor.com/transcriptions/${id}?api_key=${TRANSKRIPTOR_API_KEY}`)
        if (!altResponse.ok) {
          throw new Error(`Transkriptor API error: ${response.status}`)
        }
        const data = await altResponse.json()
        return NextResponse.json(data)
      }
      
      const data = await response.json()
      return NextResponse.json(data)
    }
    
    // Получить список всех транскрипций
    const response = await fetch(`${TRANSKRIPTOR_API_URL}/transcriptions`, {
      headers: {
        'Authorization': `Bearer ${TRANSKRIPTOR_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      // Попробуем альтернативные endpoints
      const endpoints = [
        `https://api.transkriptor.com/transcriptions?api_key=${TRANSKRIPTOR_API_KEY}`,
        `https://api.transkriptor.com/v2/transcriptions?api_key=${TRANSKRIPTOR_API_KEY}`,
        `https://api.transkriptor.com/files?api_key=${TRANSKRIPTOR_API_KEY}`,
      ]
      
      for (const endpoint of endpoints) {
        try {
          const altResponse = await fetch(endpoint)
          if (altResponse.ok) {
            const data = await altResponse.json()
            return NextResponse.json(data)
          }
        } catch (e) {
          continue
        }
      }
      
      // Если ничего не работает, вернём пустой список для тестирования
      return NextResponse.json({ 
        files: [],
        message: 'Проверьте формат API ключа и права доступа в Transkriptor',
        apiKeyPrefix: TRANSKRIPTOR_API_KEY.substring(0, 20) + '...'
      })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Transkriptor API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch from Transkriptor', 
      details: error instanceof Error ? error.message : 'Unknown error',
      files: []
    }, { status: 500 })
  }
}

// POST - Создать новую транскрипцию из URL или подключить к встрече
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, url, meetingUrl, language = 'ru' } = body
    
    if (action === 'transcribe_url' && url) {
      // Создать транскрипцию из URL аудио/видео
      const response = await fetch(`${TRANSKRIPTOR_API_URL}/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TRANSKRIPTOR_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          language,
        }),
      })
      
      if (!response.ok) {
        // Попробуем альтернативный формат
        const altResponse = await fetch(`https://api.transkriptor.com/transcriptions?api_key=${TRANSKRIPTOR_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, language }),
        })
        
        if (!altResponse.ok) {
          throw new Error(`Failed to create transcription: ${response.status}`)
        }
        const data = await altResponse.json()
        return NextResponse.json(data)
      }
      
      const data = await response.json()
      return NextResponse.json(data)
    }
    
    if (action === 'schedule_meeting' && meetingUrl) {
      // Запланировать запись встречи (Zoom/Google Meet/Teams)
      const response = await fetch(`${TRANSKRIPTOR_API_URL}/meetings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TRANSKRIPTOR_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meeting_url: meetingUrl,
          language,
          auto_transcribe: true,
        }),
      })
      
      if (!response.ok) {
        // Попробуем альтернативный формат для meetingassistant
        const altResponse = await fetch(`https://api.transkriptor.com/schedule?api_key=${TRANSKRIPTOR_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            meeting_url: meetingUrl, 
            language,
            bot_name: 'Headcorn Recorder'
          }),
        })
        
        if (!altResponse.ok) {
          return NextResponse.json({ 
            error: 'Для записи встреч может потребоваться Meetingtor интеграция',
            suggestion: 'Используйте Meetingtor для записи Zoom/Meet/Teams встреч'
          }, { status: 400 })
        }
        const data = await altResponse.json()
        return NextResponse.json(data)
      }
      
      const data = await response.json()
      return NextResponse.json(data)
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Transkriptor API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
