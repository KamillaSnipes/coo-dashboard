'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Building2, User, Calendar, Tag, Phone, Mail, Globe, Edit2, Trash2, Save, X, RefreshCw, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '@/components/Card'

interface Client {
  id: string
  name: string
  company: string
  industry: string
  segment: 'enterprise' | 'mid' | 'small' // Крупный, Средний, Малый бизнес
  contactPerson: string
  phone: string
  email: string
  website: string
  needs: string // Потребности
  orderFrequency: string // Когда заказывают
  averageOrder: string // Средний чек
  lastOrder: string // Последний заказ
  notes: string
  assignedTo: string // Ответственный менеджер
  status: 'active' | 'potential' | 'inactive'
  createdAt: string
  updatedAt: string
}

const industries = [
  'IT и технологии',
  'Финансы и банки',
  'Ритейл',
  'FMCG',
  'Фарма',
  'Автопром',
  'Недвижимость',
  'Телеком',
  'Медиа и реклама',
  'Производство',
  'Рекламное агентство',
  'Логистика',
  'Другое'
]

const segments: { value: Client['segment']; label: string; color: string }[] = [
  { value: 'enterprise', label: 'Enterprise', color: 'bg-purple-500' },
  { value: 'mid', label: 'Средний бизнес', color: 'bg-blue-500' },
  { value: 'small', label: 'Малый бизнес', color: 'bg-green-500' },
]

const statuses: { value: Client['status']; label: string; color: string }[] = [
  { value: 'active', label: 'Активный', color: 'bg-green-500' },
  { value: 'potential', label: 'Потенциальный', color: 'bg-yellow-500' },
  { value: 'inactive', label: 'Неактивный', color: 'bg-gray-500' },
]

const salesTeam = [
  'Алина Титова',
  'Наталья Лактистова',
  'Полина Коник',
  'Максим Можкин',
  'Елизавета Барабаш',
  'Ирина Ветера',
  'Сизиков Тимур',
  'Диёр Дадаев',
]

// Initial clients from sales reports
const initialClients: Client[] = [
  {
    id: 'client-s7', name: 'S7 Airlines', company: 'АО «Авиакомпания «Сибирь»',
    industry: 'Другое', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.s7.ru',
    needs: 'Тендеры: кроссовки, детские наборы, органайзеры, шнурки, сумки машиниста, косметички, полотенца',
    orderFrequency: 'Тендеры периодически', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Активные тендеры по нескольким позициям', assignedTo: 'Алина Титова', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-tbank', name: 'Т-Банк', company: 'АО «Тинькофф Банк»',
    industry: 'Финансы и банки', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.tbank.ru',
    needs: 'Бомберы, мерч питомцы, одежда, рюкзаки, детские подарки, кармашки, ланъярды, кликеры, веер',
    orderFrequency: 'Регулярно', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Крупный клиент с множеством направлений', assignedTo: 'Полина Коник', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-illan', name: 'Иллан', company: 'ООО «Иллан»',
    industry: 'Рекламное агентство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Сумки Тедди, тех карты, фарфор ДомКлик, Тиффани, варежки ВТБ, рюкзаки, бутылки ГПБ, шнурки, вазы, ежики, сквиш, значки',
    orderFrequency: 'Постоянно', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Работает с множеством брендов: ВТБ, ГПБ, ДомКлик, МТС, ЛДПР, Лемана про', assignedTo: 'Полина Коник', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-alfabank', name: 'Альфа-Банк', company: 'АО «Альфа-Банк»',
    industry: 'Финансы и банки', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://alfabank.ru',
    needs: 'Образцы: пуш, НСК, ВиТ, поверы, каталог, текстиль',
    orderFrequency: 'Регулярно', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Ожидаем даты образцов', assignedTo: 'Наталья Лактистова', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-yandexpay', name: 'Яндекс Пэй', company: 'ООО «Яндекс»',
    industry: 'IT и технологии', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://pay.yandex.ru',
    needs: 'Рюкзаки, кроссовки, просчеты',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Новый запрос на просчет', assignedTo: 'Наталья Лактистова', status: 'potential',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-zeits', name: 'Зейтс', company: 'ООО «Зейтс»',
    industry: 'Рекламное агентство', segment: 'mid', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Коробки, тираж Весны, Ростикс отгрузки, КП по Лету, зеркала, ручки Янго, холодовые пады, лампы',
    orderFrequency: 'Регулярно', averageOrder: '', lastOrder: 'Январь 2026',
    notes: '', assignedTo: 'Полина Коник', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-konfest', name: 'Конфест', company: 'ООО «Конфест»',
    industry: 'Рекламное агентство', segment: 'mid', contactPerson: '', phone: '', email: '', website: '',
    needs: 'ВК, Игла, ОДК позиции, полароиды',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Работа с ОДК, ОАК', assignedTo: 'Полина Коник', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-tochkabank', name: 'Точка Банк', company: 'АО «Точка»',
    industry: 'Финансы и банки', segment: 'mid', contactPerson: '', phone: '', email: '', website: 'https://tochka.com',
    needs: 'Брелоки, калькуляторы, подарки',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Ждём решения по брелоку и калькулятору', assignedTo: 'Алина Титова', status: 'potential',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-tsum', name: 'ЦУМ', company: 'ЦУМ',
    industry: 'Ритейл', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.tsum.ru',
    needs: 'Ракетки, гендерные подарки, развитие линейки мерча',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Дожать подписание договора', assignedTo: 'Ирина Ветера', status: 'potential',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-ozon', name: 'Ozon', company: 'ООО «Озон»',
    industry: 'IT и технологии', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://ozon.ru',
    needs: 'Тендер: награды, рюкзаки, статуэтки',
    orderFrequency: 'Тендеры', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Делаем образцы для тендера, нужны кейсы без НДА', assignedTo: 'Ирина Ветера', status: 'potential',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-megafon', name: 'МегаФон', company: 'ПАО «МегаФон»',
    industry: 'Телеком', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://megafon.ru',
    needs: '', orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: 'Назначить встречу', assignedTo: 'Ирина Ветера', status: 'potential',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-skolkovo', name: 'Сколково', company: 'Фонд «Сколково»',
    industry: 'IT и технологии', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://sk.ru',
    needs: 'Брелоки, исходящие предложения',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: '13.01 отгрузка готовой партии брелоков', assignedTo: 'Ирина Ветера', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-vodokhod', name: 'ВодоходЪ', company: 'ООО «ВодоходЪ»',
    industry: 'Другое', segment: 'mid', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Монеты, обувь',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Производство завершено, отгрузка в Иркутск. Ждем ОС от начальницы после 25 января', assignedTo: 'Елизавета Барабаш', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-molecule', name: 'Molecule', company: 'Molecule',
    industry: 'Другое', segment: 'mid', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Косметички, гипсовые арома-саше, образцы тканей',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'КП на стадии принятия решения, новый запрос на гипсовые ароматизаторы', assignedTo: 'Елизавета Барабаш', status: 'potential',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-perekrestok', name: 'Перекресток Селект', company: 'X5 Group',
    industry: 'Ритейл', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Производство тиража через предтиражники',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: '', assignedTo: 'Алина Титова', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-sdmbank', name: 'СДМ-Банк', company: 'ПАО «СДМ-Банк»',
    industry: 'Финансы и банки', segment: 'mid', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Лампы',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Ждем в Москве', assignedTo: 'Максим Можкин', status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-ostrovok', name: 'Островок', company: 'Ostrovok.ru',
    industry: 'IT и технологии', segment: 'mid', contactPerson: '', phone: '', email: '', website: 'https://ostrovok.ru',
    needs: 'Согласование запуска',
    orderFrequency: '', averageOrder: '', lastOrder: 'Январь 2026',
    notes: 'Ждем согласование от клиента', assignedTo: 'Ирина Ветера', status: 'potential',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'client-kfs', name: 'КФС', company: 'KFC Russia',
    industry: 'FMCG', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Игрушки',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: 'Расчет', assignedTo: 'Наталья Лактистова', status: 'potential',
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-12T00:00:00.000Z'
  },

  // =============================================
  // ЮБИЛЕИ 2026 - ПОТЕНЦИАЛЬНЫЕ КЛИЕНТЫ
  // =============================================

  // === АВТО-ЮБИЛЕИ (Государственный масштаб) ===
  {
    id: 'client-kamaz', name: 'КАМАЗ', company: 'ПАО «КАМАЗ»',
    industry: 'Автопром', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://kamaz.ru',
    needs: 'Сувениры для сотрудников, VIP-подарки партнерам, юбилейная коллекция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 50 лет (16 февраля). Празднование закреплено указом Президента РФ. Масштабные мероприятия!', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-avtovaz', name: 'АВТОВАЗ', company: 'ПАО «АВТОВАЗ»',
    industry: 'Автопром', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.lada.ru',
    needs: 'Юбилейный мерч, подарки для сотрудников и дилеров',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 60 лет со дня основания. Завод в Тольятти планирует масштабное обновление и празднование', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-lada-izhevsk', name: 'Lada Ижевский автозавод', company: 'Ижевский автомобильный завод',
    industry: 'Автопром', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Юбилейная продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 60 лет (12 декабря) со дня выпуска первого авто', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },

  // === ДОБЫЧА, ПРОМЫШЛЕННОСТЬ И ЭНЕРГЕТИКА ===
  // 35 лет (1991)
  {
    id: 'client-lukoil', name: 'ЛУКОЙЛ', company: 'ПАО «ЛУКОЙЛ»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://lukoil.ru',
    needs: 'Корпоративные подарки, мерч для сотрудников',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 35 лет (ноябрь 1991). Крупнейшая частная нефтяная компания', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-gazprom-export', name: 'Газпром экспорт', company: 'ООО «Газпром экспорт»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: '',
    needs: 'VIP-подарки, корпоративная продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 35 лет. Дочерняя структура Газпрома', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 30 лет (1996)
  {
    id: 'client-tvel', name: 'ТВЭЛ', company: 'АО «ТВЭЛ»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.tvel.ru',
    needs: 'Корпоративные подарки',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 30 лет. Топливная компания Росатома (ядерное топливо)', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-gazprom-mezhregiongaz', name: 'Газпром межрегионгаз', company: 'ООО «Газпром межрегионгаз»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Мерч для сотрудников по всей РФ',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 30 лет. Поставки газа по всей РФ', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-metall-profil', name: 'Металл Профиль', company: 'Компания «Металл Профиль»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://metallprofil.ru',
    needs: 'Корпоративная продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 30 лет. Лидер рынка кровельных и стеновых материалов', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-traktornye-zavody', name: 'Тракторные заводы', company: 'Концерн «Тракторные заводы»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Корпоративные подарки',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 30 лет. Крупный машиностроительный холдинг', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 25 лет (2001)
  {
    id: 'client-suek', name: 'СУЭК', company: 'АО «СУЭК»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.suek.ru',
    needs: 'Корпоративная продукция для тысяч сотрудников',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 25 лет. Сибирская угольная энергетическая компания - мировой лидер отрасли', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-tmk', name: 'ТМК', company: 'ПАО «ТМК»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.tmk-group.ru',
    needs: 'Корпоративные подарки',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 25 лет. Трубная металлургическая компания', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-eurohim', name: 'ЕвроХим', company: 'АО «МХК «ЕвроХим»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.eurochemgroup.com',
    needs: 'Корпоративная продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 25 лет. Крупнейший в РФ производитель минеральных удобрений', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 20 лет (2006)
  {
    id: 'client-oak', name: 'ОАК', company: 'ПАО «ОАК»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.uacrussia.ru',
    needs: 'Корпоративные подарки, VIP-продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 20 лет. Объединённая авиастроительная корпорация - весь авиапром страны. Уже работаем через Конфест', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-metalloinvest', name: 'Металлоинвест', company: 'УК «Металлоинвест»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.metalloinvest.com',
    needs: 'Корпоративная продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 20 лет. Крупнейший горно-металлургический холдинг', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-atomenergomash', name: 'Атомэнергомаш', company: 'АО «Атомэнергомаш»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.aem-group.ru',
    needs: 'Корпоративные подарки',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 20 лет. Машиностроительный дивизион Росатома', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },

  // === IT, ТЕЛЕКОМ И ТЕХНОЛОГИИ ===
  // 35 лет (1991)
  {
    id: 'client-1c', name: '1С', company: 'Фирма «1С»',
    industry: 'IT и технологии', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://1c.ru',
    needs: 'Кастомный мерч, гаджеты, инновационные материалы',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 35 лет. Лидер софтверного рынка РФ', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-gs-group', name: 'GS Group', company: 'GS Group',
    industry: 'IT и технологии', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.gs-group.com',
    needs: 'Технологичный мерч',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 35 лет. Инвестиционно-промышленный холдинг (микроэлектроника)', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 25 лет (2001)
  {
    id: 'client-1c-rarus', name: '1С-Рарус', company: '1С-Рарус',
    industry: 'IT и технологии', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://rarus.ru',
    needs: 'Корпоративный мерч',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 25 лет. Крупнейший ИТ-интегратор', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-r-pharm', name: 'Р-Фарм', company: 'АО «Р-Фарм»',
    industry: 'Фарма', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://r-pharm.com',
    needs: 'Корпоративная продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 25 лет. Высокотехнологичная фармацевтическая компания', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-geropharm', name: 'Герофарм', company: 'АО «Герофарм»',
    industry: 'Фарма', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://geropharm.ru',
    needs: 'Корпоративные подарки',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 25 лет. Биотехнологическая компания', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 20 лет (2006)
  {
    id: 'client-vk', name: 'ВКонтакте (VK)', company: 'ООО «ВКонтакте»',
    industry: 'IT и технологии', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://vk.com',
    needs: 'Имиджевый мерч, коллекции к юбилею, гаджеты',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 20 лет (октябрь). Огромный потенциал для выпуска юбилейных коллекций мерча!', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-regru', name: 'Reg.ru', company: 'АО «Рег.ру»',
    industry: 'IT и технологии', segment: 'mid', contactPerson: '', phone: '', email: '', website: 'https://www.reg.ru',
    needs: 'Корпоративный мерч',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 20 лет. Крупнейший регистратор доменов и хостинг-провайдер', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 15 лет (2011)
  {
    id: 'client-okko', name: 'Okko', company: 'Okko',
    industry: 'IT и технологии', segment: 'mid', contactPerson: '', phone: '', email: '', website: 'https://okko.tv',
    needs: 'Мерч, промо-продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 15 лет. Мультимедийный сервис', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-onetwotrip', name: 'OneTwoTrip', company: 'OneTwoTrip',
    industry: 'IT и технологии', segment: 'mid', contactPerson: '', phone: '', email: '', website: 'https://www.onetwotrip.com',
    needs: 'Тревел-мерч',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 15 лет. Лидер онлайн-тревела', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-dodo', name: 'Dodo Pizza', company: 'Dodo Pizza',
    industry: 'FMCG', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://dodopizza.ru',
    needs: 'Промо-продукция, мерч для сотрудников',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 15 лет. Международная сеть пиццерий', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },

  // === РИТЕЙЛ И FMCG ===
  // 30 лет (1996)
  {
    id: 'client-rusproduct', name: 'Русский Продукт', company: 'ООО «Русский Продукт»',
    industry: 'FMCG', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: '',
    needs: 'Промо-продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 30 лет. Крупнейший производитель бакалеи', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-medsi', name: 'МЕДСИ', company: 'АО «Группа компаний «МЕДСИ»',
    industry: 'Другое', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://medsi.ru',
    needs: 'Welcome Packs для новых сотрудников',
    orderFrequency: 'Регулярно (активный найм)', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 30 лет. Сеть частных клиник', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 20 лет (2006)
  {
    id: 'client-krasnoeibeloe', name: 'Красное & Белое', company: '«Красное & Белое»',
    industry: 'Ритейл', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.krasnoeibeloe.ru',
    needs: 'Массовые тиражи мерча для огромной сети филиалов',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 20 лет. Гигант ритейла', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-fixprice', name: 'Fix Price', company: 'Fix Price',
    industry: 'Ритейл', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://fix-price.com',
    needs: 'Массовые промо-товары',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 20 лет. Международная сеть магазинов', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-mothernchild', name: 'Мать и дитя', company: 'ГК «Мать и дитя»',
    industry: 'Другое', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://mamadeti.ru',
    needs: 'Корпоративная продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 20 лет. Сеть клиник', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 15 лет (2011)
  {
    id: 'client-vkusvill', name: 'ВкусВилл', company: '«ВкусВилл»',
    industry: 'Ритейл', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://vkusvill.ru',
    needs: 'Эко-мерч, промо-продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 15 лет. Сеть магазинов здорового питания', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-lamoda', name: 'Lamoda', company: 'Lamoda',
    industry: 'Ритейл', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.lamoda.ru',
    needs: 'Fashion-мерч, коллаборации',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 15 лет. Крупнейший маркетплейс одежды', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },

  // === ЛОГИСТИКА И ФИНАНСЫ ===
  // 35 лет (1991)
  {
    id: 'client-rolf', name: 'Рольф', company: 'ГК «Рольф»',
    industry: 'Автопром', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://rolf.ru',
    needs: 'Корпоративные подарки для клиентов и сотрудников',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 35 лет. Крупнейший автодилер', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 30 лет (1996)
  {
    id: 'client-maks', name: 'МАКС', company: 'САО «МАКС»',
    industry: 'Финансы и банки', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://makc.ru',
    needs: 'Корпоративная продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 30 лет. Страховая группа', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-rusklimat', name: 'Русклимат', company: 'ТПХ «Русклимат»',
    industry: 'Производство', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://rusklimat.ru',
    needs: 'Корпоративные подарки',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 30 лет', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 25 лет (2001)
  {
    id: 'client-dellin', name: 'Деловые Линии', company: 'ГК «Деловые Линии»',
    industry: 'Другое', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.dellin.ru',
    needs: 'Мерч для тысяч сотрудников',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 25 лет. Лидер рынка грузоперевозок - огромный штат!', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'client-rosagrolizing', name: 'Росагролизинг', company: 'АО «Росагролизинг»',
    industry: 'Финансы и банки', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://www.rosagroleasing.ru',
    needs: 'Корпоративная продукция',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 25 лет', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
  // 20 лет (2006)
  {
    id: 'client-transcontainer', name: 'ТрансКонтейнер', company: 'ПАО «ТрансКонтейнер»',
    industry: 'Другое', segment: 'enterprise', contactPerson: '', phone: '', email: '', website: 'https://trcont.ru',
    needs: 'Корпоративные подарки',
    orderFrequency: '', averageOrder: '', lastOrder: '',
    notes: '🎉 ЮБИЛЕЙ 2026: 20 лет. Крупнейший контейнерный оператор', assignedTo: '', status: 'potential',
    createdAt: '2026-01-16T00:00:00.000Z', updatedAt: '2026-01-16T00:00:00.000Z'
  },
]

const emptyClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  company: '',
  industry: '',
  segment: 'mid',
  contactPerson: '',
  phone: '',
  email: '',
  website: '',
  needs: '',
  orderFrequency: '',
  averageOrder: '',
  lastOrder: '',
  notes: '',
  assignedTo: '',
  status: 'potential'
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterIndustry, setFilterIndustry] = useState<string>('')
  const [filterSegment, setFilterSegment] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterManager, setFilterManager] = useState<string>('')
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/clients')
        if (response.ok) {
          const data = await response.json()
          if (data.clients && data.clients.length > 0) {
            setClients(data.clients)
          } else {
            // No saved clients - use initial data and save
            setClients(initialClients)
            await fetch('/api/clients', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ clients: initialClients })
            })
          }
        }
      } catch (error) {
        console.error('Error loading:', error)
        setClients(initialClients)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Save data
  const saveClients = async (updatedClients: Client[]) => {
    setSaving(true)
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clients: updatedClients })
      })
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  // Create client
  const createClient = () => {
    setEditingClient({
      ...emptyClient,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Client)
    setIsCreating(true)
  }

  // Save client
  const saveClient = async () => {
    if (!editingClient) return

    const updatedClient = { ...editingClient, updatedAt: new Date().toISOString() }
    let updatedClients: Client[]

    if (isCreating) {
      updatedClients = [...clients, updatedClient]
    } else {
      updatedClients = clients.map(c => c.id === updatedClient.id ? updatedClient : c)
    }

    setClients(updatedClients)
    await saveClients(updatedClients)
    setEditingClient(null)
    setIsCreating(false)
  }

  // Delete client
  const deleteClient = async (id: string) => {
    if (!confirm('Удалить клиента?')) return
    
    const updatedClients = clients.filter(c => c.id !== id)
    setClients(updatedClients)
    await saveClients(updatedClients)
  }

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesIndustry = !filterIndustry || client.industry === filterIndustry
    const matchesSegment = !filterSegment || client.segment === filterSegment
    const matchesStatus = !filterStatus || client.status === filterStatus
    const matchesManager = !filterManager || client.assignedTo === filterManager

    return matchesSearch && matchesIndustry && matchesSegment && matchesStatus && matchesManager
  })

  // Stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    potential: clients.filter(c => c.status === 'potential').length,
    enterprise: clients.filter(c => c.segment === 'enterprise').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-primary-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-dark-700 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">База клиентов</h1>
            <p className="text-dark-400 mt-1">Информация о клиентах и их потребностях</p>
          </div>
        </div>
        <button
          onClick={createClient}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
        >
          <Plus size={18} />
          Добавить клиента
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-400">{stats.total}</div>
          <div className="text-sm text-dark-400">Всего клиентов</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-400">{stats.active}</div>
          <div className="text-sm text-dark-400">Активных</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.potential}</div>
          <div className="text-sm text-dark-400">Потенциальных</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-400">{stats.enterprise}</div>
          <div className="text-sm text-dark-400">Enterprise</div>
        </Card>
      </div>

      {/* Search and filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по названию, компании, контакту..."
              className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${showFilters ? 'bg-primary-600' : 'bg-dark-700'}`}
          >
            <Filter size={18} />
            Фильтры
            {(filterIndustry || filterSegment || filterStatus || filterManager) && (
              <span className="w-2 h-2 bg-primary-400 rounded-full" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-dark-700 grid md:grid-cols-4 gap-4">
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
            >
              <option value="">Все отрасли</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <select
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
            >
              <option value="">Все сегменты</option>
              {segments.map(seg => (
                <option key={seg.value} value={seg.value}>{seg.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
            >
              <option value="">Все статусы</option>
              {statuses.map(st => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
            <select
              value={filterManager}
              onChange={(e) => setFilterManager(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
            >
              <option value="">Все менеджеры</option>
              {salesTeam.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}
      </Card>

      {/* Edit modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {isCreating ? 'Новый клиент' : 'Редактировать клиента'}
              </h3>
              <button onClick={() => { setEditingClient(null); setIsCreating(false) }} className="p-2 hover:bg-dark-700 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название / Имя</label>
                <input
                  type="text"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="Название клиента"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Компания</label>
                <input
                  type="text"
                  value={editingClient.company}
                  onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="ООО Компания"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Отрасль</label>
                <select
                  value={editingClient.industry}
                  onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                >
                  <option value="">Выберите отрасль</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Сегмент</label>
                <select
                  value={editingClient.segment}
                  onChange={(e) => setEditingClient({ ...editingClient, segment: e.target.value as Client['segment'] })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                >
                  {segments.map(seg => (
                    <option key={seg.value} value={seg.value}>{seg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Контактное лицо</label>
                <input
                  type="text"
                  value={editingClient.contactPerson}
                  onChange={(e) => setEditingClient({ ...editingClient, contactPerson: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Телефон</label>
                <input
                  type="text"
                  value={editingClient.phone}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="+7 999 123 45 67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editingClient.email}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="client@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Сайт</label>
                <input
                  type="text"
                  value={editingClient.website}
                  onChange={(e) => setEditingClient({ ...editingClient, website: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="https://company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ответственный менеджер</label>
                <select
                  value={editingClient.assignedTo}
                  onChange={(e) => setEditingClient({ ...editingClient, assignedTo: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                >
                  <option value="">Выберите менеджера</option>
                  {salesTeam.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Статус</label>
                <select
                  value={editingClient.status}
                  onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value as Client['status'] })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                >
                  {statuses.map(st => (
                    <option key={st.value} value={st.value}>{st.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Когда заказывают</label>
                <input
                  type="text"
                  value={editingClient.orderFrequency}
                  onChange={(e) => setEditingClient({ ...editingClient, orderFrequency: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="Ежеквартально, к праздникам..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Средний чек</label>
                <input
                  type="text"
                  value={editingClient.averageOrder}
                  onChange={(e) => setEditingClient({ ...editingClient, averageOrder: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="500 000 ₽"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Последний заказ</label>
                <input
                  type="text"
                  value={editingClient.lastOrder}
                  onChange={(e) => setEditingClient({ ...editingClient, lastOrder: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
                  placeholder="Декабрь 2025"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Потребности</label>
                <textarea
                  value={editingClient.needs}
                  onChange={(e) => setEditingClient({ ...editingClient, needs: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  placeholder="Какие товары/услуги интересуют, особые требования..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Заметки</label>
                <textarea
                  value={editingClient.notes}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  placeholder="Дополнительная информация..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setEditingClient(null); setIsCreating(false) }}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={saveClient}
                disabled={saving || !editingClient.name}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 rounded-lg"
              >
                {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clients list */}
      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <Card className="text-center py-12">
            <Building2 className="mx-auto text-dark-500 mb-4" size={48} />
            <p className="text-dark-400">
              {clients.length === 0 ? 'Клиенты ещё не добавлены' : 'Клиенты не найдены'}
            </p>
            {clients.length === 0 && (
              <button
                onClick={createClient}
                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg"
              >
                <Plus size={18} />
                Добавить первого клиента
              </button>
            )}
          </Card>
        ) : (
          filteredClients.map(client => {
            const isExpanded = expandedClient === client.id
            const statusInfo = statuses.find(s => s.value === client.status)
            const segmentInfo = segments.find(s => s.value === client.segment)

            return (
              <Card key={client.id} className="overflow-hidden">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${statusInfo?.color || 'bg-gray-500'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{client.name}</span>
                        {client.company && (
                          <span className="text-dark-400">• {client.company}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-dark-400 mt-1">
                        {client.industry && (
                          <span className="flex items-center gap-1">
                            <Tag size={12} />
                            {client.industry}
                          </span>
                        )}
                        {segmentInfo && (
                          <span className={`px-2 py-0.5 rounded text-xs ${segmentInfo.color}/20 text-white`}>
                            {segmentInfo.label}
                          </span>
                        )}
                        {client.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {client.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingClient(client); setIsCreating(false) }}
                      className="p-2 hover:bg-dark-700 rounded-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteClient(client.id) }}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-dark-700 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {client.contactPerson && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Контакт</div>
                        <div className="flex items-center gap-2 text-sm">
                          <User size={14} className="text-primary-400" />
                          {client.contactPerson}
                        </div>
                      </div>
                    )}
                    {client.phone && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Телефон</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-green-400" />
                          {client.phone}
                        </div>
                      </div>
                    )}
                    {client.email && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Email</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-blue-400" />
                          {client.email}
                        </div>
                      </div>
                    )}
                    {client.website && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Сайт</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe size={14} className="text-purple-400" />
                          <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                            {client.website}
                          </a>
                        </div>
                      </div>
                    )}
                    {client.orderFrequency && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Когда заказывают</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-yellow-400" />
                          {client.orderFrequency}
                        </div>
                      </div>
                    )}
                    {client.averageOrder && (
                      <div>
                        <div className="text-xs text-dark-400 mb-1">Средний чек</div>
                        <div className="text-sm font-medium text-green-400">{client.averageOrder}</div>
                      </div>
                    )}
                    {client.needs && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <div className="text-xs text-dark-400 mb-1">Потребности</div>
                        <p className="text-sm text-dark-300">{client.needs}</p>
                      </div>
                    )}
                    {client.notes && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <div className="text-xs text-dark-400 mb-1">Заметки</div>
                        <p className="text-sm text-dark-300">{client.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

