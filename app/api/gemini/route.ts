import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

interface GeminiRequest {
  action: 'analyze' | 'summarize' | 'categorize' | 'extract'
  text: string
  context?: string
}

// POST - Использовать Gemini для анализа текста
export async function POST(request: NextRequest) {
  try {
    const body: GeminiRequest = await request.json()
    const { action, text, context } = body

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'GEMINI_API_KEY не настроен',
        hint: 'Добавьте GEMINI_API_KEY в переменные окружения Railway'
      }, { status: 400 })
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Текст не предоставлен' }, { status: 400 })
    }

    let prompt = ''

    switch (action) {
      case 'analyze':
        prompt = `Проанализируй следующий текст встречи и выдели:
1. Ключевые решения
2. Действия (action items)
3. Проблемы и риски
4. Следующие шаги

Текст:
${text}

${context ? `Контекст: ${context}` : ''}

Верни ответ в формате JSON:
{
  "decisions": ["решение 1", "решение 2"],
  "actions": ["действие 1", "действие 2"],
  "problems": ["проблема 1", "проблема 2"],
  "nextSteps": ["шаг 1", "шаг 2"]
}`
        break

      case 'summarize':
        prompt = `Создай краткое резюме следующей встречи (2-3 предложения):
${text}

${context ? `Контекст: ${context}` : ''}

Верни только резюме без дополнительных комментариев.`
        break

      case 'categorize':
        prompt = `Распредели следующий текст встречи по категориям:
- Цели/Планы
- План/Факт
- Риски/Проблемы
- Инициативы
- Личные приоритеты

Текст:
${text}

Верни ответ в формате JSON:
{
  "goals": "текст для целей",
  "planFact": "текст для плана/факта",
  "risksProblems": "текст для рисков",
  "initiatives": "текст для инициатив",
  "personalPriorities": "текст для личного"
}`
        break

      case 'extract':
        prompt = `Извлеки из следующего текста:
1. Имена участников
2. Упомянутые проекты
3. Даты и дедлайны
4. Числа и метрики

Текст:
${text}

Верни ответ в формате JSON:
{
  "participants": ["имя 1", "имя 2"],
  "projects": ["проект 1", "проект 2"],
  "dates": ["дата 1", "дата 2"],
  "metrics": ["метрика 1", "метрика 2"]
}`
        break

      default:
        return NextResponse.json({ error: 'Неизвестное действие' }, { status: 400 })
    }

    // Вызов Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API error:', errorData)
      return NextResponse.json({ 
        error: 'Ошибка Gemini API',
        details: errorData.substring(0, 200)
      }, { status: response.status })
    }

    const data = await response.json()
    
    // Извлекаем текст ответа
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    if (!generatedText) {
      return NextResponse.json({ 
        error: 'Gemini не вернул ответ',
        raw: JSON.stringify(data, null, 2)
      }, { status: 500 })
    }

    // Пытаемся распарсить JSON если это JSON ответ
    let parsed: any = generatedText
    try {
      // Ищем JSON в тексте (может быть обёрнут в markdown код блоки)
      const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       generatedText.match(/```\s*([\s\S]*?)\s*```/) ||
                       generatedText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else if (generatedText.trim().startsWith('{')) {
        parsed = JSON.parse(generatedText)
      }
    } catch (e) {
      // Если не JSON, возвращаем как текст
      parsed = { text: generatedText }
    }

    return NextResponse.json({
      success: true,
      result: parsed,
      raw: generatedText
    })

  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ 
      error: 'Ошибка при обработке запроса',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET - Проверка доступности API
export async function GET() {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ 
      available: false,
      message: 'GEMINI_API_KEY не настроен'
    })
  }
  
  return NextResponse.json({ 
    available: true,
    message: 'Gemini API готов к использованию'
  })
}
