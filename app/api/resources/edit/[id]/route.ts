import { withDatabase } from '@/lib/db'
import type { CreateSupportResourceBody } from '@/types/support-resource'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as CreateSupportResourceBody

    const {
      user_id,
      provider_type,
      provider_name,
      contact_email,
      contact_phone,
      prefecture,
      municipality,
      content,
      price_type,
      availability,
      coverage_area,
    } = body

    if (
      user_id == null ||
      !provider_type ||
      !provider_name ||
      !contact_email ||
      !prefecture ||
      !content ||
      !price_type ||
      !availability
    ) {
      return NextResponse.json({ error: '必須項目が不足しています。' }, { status: 400 })
    }

    const resourceId = Number(params.id)
    const assistantId = Number(user_id)
    if (!Number.isFinite(resourceId) || resourceId <= 0) {
      return NextResponse.json({ error: '無効なIDです。' }, { status: 400 })
    }
    if (!Number.isFinite(assistantId) || assistantId <= 0) {
      return NextResponse.json({ error: '無効なassistant_idです。' }, { status: 400 })
    }

    const header = await withDatabase(async (db) => {
      const [result] = await db.query(
        `UPDATE resources SET
          provider_type = ?, provider_name = ?, contact_email = ?, contact_phone = ?,
          prefecture = ?, municipality = ?, content = ?, price_type = ?, availability = ?, coverage_area = ?
        WHERE id = ? AND assistant_id = ?`,
        [
          provider_type,
          provider_name,
          contact_email,
          contact_phone ?? '',
          prefecture,
          municipality ?? '',
          content,
          price_type,
          availability,
          coverage_area?.length ? JSON.stringify(coverage_area) : null,
          resourceId,
          assistantId,
        ]
      )
      return result as { affectedRows: number }
    })

    if (header.affectedRows === 0) {
      return NextResponse.json({ error: 'リソースが見つかりません。' }, { status: 404 })
    }

    return NextResponse.json({ resource_id: resourceId })
  } catch {
    return NextResponse.json(
      { error: '更新に失敗しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    )
  }
}
