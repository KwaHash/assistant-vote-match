import { withDatabase } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET( request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userIdParam = request.nextUrl.searchParams.get('user_id')
    if (!userIdParam) {
      return NextResponse.json({ error: 'assistant_idが必要です。' }, { status: 400 })
    }

    const resourceId = Number(params.id)
    const assistantId = Number(userIdParam)
    if (!Number.isFinite(resourceId) || resourceId <= 0) {
      return NextResponse.json({ error: '無効なIDです。' }, { status: 400 })
    }
    if (!Number.isFinite(assistantId) || assistantId <= 0) {
      return NextResponse.json({ error: '無効なassistant_idです。' }, { status: 400 })
    }

    const row = await withDatabase(async (db) => {
      const [result] = await db.query(
        'SELECT * FROM resources WHERE id = ? AND assistant_id = ? LIMIT 1',
        [resourceId, assistantId]
      )
      const rows = result as Record<string, unknown>[]
      return rows[0] ?? null
    })

    if (!row) {
      return NextResponse.json({ error: 'リソースが見つかりません。' }, { status: 404 })
    }

    const resource = {
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
      coverage_area: row.coverage_area == null ? null : typeof row.coverage_area === 'string' ? JSON.parse(row.coverage_area as string) : row.coverage_area,
      created_at: row.created_at,
    }

    return NextResponse.json({ resource })
  } catch {
    return NextResponse.json(
      { error: '取得に失敗しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    )
  }
}
