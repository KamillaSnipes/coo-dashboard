// Централизованные финансовые данные для синхронизации между блоками
// Кварталы Headcorn: Q1 (март-май), Q2 (июнь-авг), Q3 (сент-нояб), Q4 (дек-фев)

export interface MonthData {
  month: string
  monthNum: number
  year: number
  revenueCompleted: number  // Сумма завершений
  revenueLaunched: number   // Сумма запусков
  expenses: number          // Расходы
  marginCoef: number        // Маржинальность (коэффициент)
}

// Месячные данные из отчёта
export const monthlyData: MonthData[] = [
  { month: 'Март', monthNum: 3, year: 2025, revenueCompleted: 48868118.16, revenueLaunched: 12381031.46, expenses: 6487383.75, marginCoef: 1.53 },
  { month: 'Апрель', monthNum: 4, year: 2025, revenueCompleted: 24950087.91, revenueLaunched: 38969370.55, expenses: 19318921.66, marginCoef: 1.66 },
  { month: 'Май', monthNum: 5, year: 2025, revenueCompleted: 15297689.10, revenueLaunched: 33204614.72, expenses: 20969412.39, marginCoef: 1.60 },
  { month: 'Июнь', monthNum: 6, year: 2025, revenueCompleted: 16599974.34, revenueLaunched: 9031102.36, expenses: 5365570.78, marginCoef: 1.88 },
  { month: 'Июль', monthNum: 7, year: 2025, revenueCompleted: 49972590.00, revenueLaunched: 70742050.53, expenses: 17314978.27, marginCoef: 1.36 },
  { month: 'Август', monthNum: 8, year: 2025, revenueCompleted: 28788934.07, revenueLaunched: 91157055.83, expenses: 49177169.52, marginCoef: 1.76 },
  { month: 'Сентябрь', monthNum: 9, year: 2025, revenueCompleted: 29027379.15, revenueLaunched: 69247846.88, expenses: 28090838.09, marginCoef: 1.57 },
  { month: 'Октябрь', monthNum: 10, year: 2025, revenueCompleted: 11446461.01, revenueLaunched: 80336471.37, expenses: 37731125.06, marginCoef: 1.85 },
  { month: 'Ноябрь', monthNum: 11, year: 2025, revenueCompleted: 7626154.86, revenueLaunched: 30618624.79, expenses: 6485473.26, marginCoef: 2.00 },
  { month: 'Декабрь', monthNum: 12, year: 2025, revenueCompleted: 58132096.79, revenueLaunched: 15385294.00, expenses: 726098.56, marginCoef: 1.82 },
  { month: 'Январь', monthNum: 1, year: 2026, revenueCompleted: 0, revenueLaunched: 5102831.24, expenses: 0, marginCoef: 0 },
  { month: 'Февраль', monthNum: 2, year: 2026, revenueCompleted: 0, revenueLaunched: 0, expenses: 0, marginCoef: 0 },
]

// Итоговые показатели
export const totals = {
  revenueCompleted: 290709485.39,  // Сумма завершений
  revenueLaunched: 456176293.73,   // Сумма запусков
  expenses: 191666971.34,          // Расходы
  avgMargin: 1.62,                 // Средняя маржинальность
}

// Квартальные данные (Headcorn quarters)
export const quarterlyData = {
  Q1_FY2025: {
    name: 'Q1 FY2025 (март-май)',
    months: ['Март 2025', 'Апрель 2025', 'Май 2025'],
    revenueCompleted: 89115895.17,
    revenueLaunched: 84555016.73,
    expenses: 46775717.80,
    avgMargin: 1.60,
  },
  Q2_FY2025: {
    name: 'Q2 FY2025 (июнь-август)',
    months: ['Июнь 2025', 'Июль 2025', 'Август 2025'],
    revenueCompleted: 95361498.41,
    revenueLaunched: 170930208.72,
    expenses: 71857718.57,
    avgMargin: 1.67,
  },
  Q3_FY2025: {
    name: 'Q3 FY2025 (сент-нояб)',
    months: ['Сентябрь 2025', 'Октябрь 2025', 'Ноябрь 2025'],
    revenueCompleted: 48099995.02,
    revenueLaunched: 180202943.04,
    expenses: 72307436.41,
    avgMargin: 1.81,
  },
  Q4_FY2026: {
    name: 'Q4 FY2026 (дек-фев)',
    months: ['Декабрь 2025', 'Январь 2026', 'Февраль 2026'],
    revenueCompleted: 58132096.79,
    revenueLaunched: 20488125.24,
    expenses: 726098.56,
    avgMargin: 1.82,
  },
}

// Форматирование денег
export function formatMoney(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)} млрд ₽`
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)} млн ₽`
  if (value >= 1000) return `${Math.round(value / 1000)} тыс ₽`
  return `${value.toFixed(0)} ₽`
}

// Текущий квартал (Q4 - декабрь-февраль)
export const currentQuarter = quarterlyData.Q4_FY2026

// Метрики для главной страницы
export const dashboardMetrics = {
  // Выручка MTD (текущий квартал)
  revenueMTD: currentQuarter.revenueLaunched,
  revenuePlan: 500000000, // План на квартал
  
  // Маржинальность
  marginCurrent: totals.avgMargin,
  marginTarget: 1.7,
  
  // Производительность (будет рассчитываться с ФОТ)
  productivityTarget: 1.0,
}

