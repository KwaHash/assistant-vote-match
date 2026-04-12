import SupportResourceEditPage from '@/features/support-resource-edit'

export default function page({ params }: { params: { id: string } }) {
  const { id } = params
  return <SupportResourceEditPage id={id} />
}
