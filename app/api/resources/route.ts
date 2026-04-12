import { withDatabase } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userIdParam = request.nextUrl.searchParams.get('user_id')
    if (!userIdParam) {
      return NextResponse.json({ error: 'assistant_idが必要です。' }, { status: 400 })
    }

    const assistantId = Number(userIdParam)
    const rows = await withDatabase(async (db) => {
      const [result] = await db.query(
        'SELECT * FROM resources WHERE assistant_id = ? ORDER BY created_at DESC', [assistantId]
      )
      return result as Record<string, unknown>[]
    })
    const resources = rows.map((row) => ({
      id: row.id,
      assistant_id: row.assistant_id,
      provider_type: row.provider_type,
      provider_name: row.provider_name,
      contact_email: row.contact_email,
      contact_phone: row.contact_phone,
      prefecture: row.prefecture,
      municipality: row.municipality,
      content: row.content,
      price_type: row.price_type,
      availability: row.availability,
      coverage_area: row.coverage_area ? JSON.parse(row.coverage_area as string) : null,
      created_at: row.created_at,
    }))
    return NextResponse.json({ resources })
  } catch {
    return NextResponse.json(
      { error: '取得に失敗しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    )
  }
}
