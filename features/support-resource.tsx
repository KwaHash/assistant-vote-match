'use client'

import ResourceItem from '@/components/list-item/resource-item'
import LoadingIndicator from '@/components/loading-indicator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { assistants } from '@/constants/assistants'
import { useAuth } from '@/providers/auth-provider'
import { ISupportResource } from '@/types/support-resource'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaSearch, FaUser } from 'react-icons/fa'
import { LuPlus } from 'react-icons/lu'

const SupportResourcesPage = () => {
  const { user_id } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAssistant, setFilterAssistant] = useState('全タイプ')
  const [allResources, setAllResources] = useState<ISupportResource[]>([])
  const [filteredResources, setFilteredResources] = useState<ISupportResource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data: { resources } } = await axios.get('/api/resources', { params: { user_id } })
        setAllResources(resources)
        setFilteredResources(resources)
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.data?.error) {
          console.error(err.response.data.error)
        }
      }
      setIsLoading(false)
    }

    void fetchResources()
  }, [user_id])

  const handleSearch = () => {
    let searchedResources = allResources
    if (searchQuery) {
      searchedResources = searchedResources.filter((resource) => {
        if (resource.provider_type.includes(searchQuery)) return true
        if (resource.provider_name.includes(searchQuery)) return true
        if (resource.contact_email.includes(searchQuery)) return true
        if (resource.contact_phone?.includes(searchQuery)) return true
        if (resource.prefecture.includes(searchQuery)) return true
        if (resource.municipality?.includes(searchQuery)) return true
        if (resource.price_type.includes(searchQuery)) return true
        if (resource.availability.includes(searchQuery)) return true
        if (resource.coverage_area?.includes(searchQuery)) return true
        if (resource.content.includes(searchQuery)) return true
        return false
      })
    }
    if (filterAssistant !== '全タイプ') {
      searchedResources = searchedResources.filter((resource) => resource.provider_type === filterAssistant)
    }
    setFilteredResources(searchedResources)
  }


  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='relative bg-white'>
        <div className='absolute inset-0 bg-gradient-to-r from-secondary to-secondary/85' />
        <div className='relative max-w-7xl mx-auto px-4 py-24'>
          <div className='text-center'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold leading-normal tracking-tight text-white'>支援リソース</h1>
            <p className='mt-6 text-base sm:text-lg md:text-xl text-gray-100'>ご提供可能なデータは、以下の通りです</p>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 right-0'>
          <svg
            className='w-full h-16 text-white transform rotate-180'
            fill='currentColor'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' />
          </svg>
        </div>
      </section>

      <section className='flex justify-between items-center mb-6 flex-wrap gap-3 w-full max-w-6xl mx-auto px-4 md:px-8 pt-12 bg-background/50 backdrop-blur-sm'>
        <div className='w-full flex justify-between items-center'>
          <h2 className='border-secondary border-l-[6px] text-2xl pl-4 mb-3 font-bold text-gray-700'>支援リソース一覧</h2>
          <Link href='/support-resource/register'
            className='flex items-center px-5 py-2.5 rounded-none bg-secondary text-white hover:bg-secondary/90 transition-all duration-500 gap-2'
          >
            <LuPlus className='w-6 h-6' />
            <span className='text-base'>新規リソース</span>
          </Link>
        </div>
      </section>

      <section className='w-full max-w-6xl mx-auto px-4 md:px-8 pb-12'>
        <div className='w-full flex flex-col sm:flex-row gap-2 md:gap-3 mb-6'>
          <div className='flex-1 relative flex'>
            <div className='relative flex-1'>
              <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='キーワードで検索'
                className='pl-10 rounded-none'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <Select value={filterAssistant} onValueChange={setFilterAssistant}>
              <SelectTrigger className='w-full sm:w-[200px] md:w-[250px] rounded-none flex items-center'>
                <FaUser className='h-4 w-4 mr-3 text-muted-foreground' />
                <SelectValue placeholder='タイプ' />
              </SelectTrigger>
              <SelectContent>
                {assistants.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.value}>
                    {assistant.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant='default'
            size='sm'
            className='rounded-none px-4 flex-shrink-0 h-10 bg-secondary hover:bg-secondary/90 transition-all duration-500'
            onClick={handleSearch}
          >
            <FaSearch className='h-4 w-4 mr-1' />
            <span>検索</span>
          </Button>
        </div>
        <div className='flex flex-col gap-3'>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <ResourceItem key={resource.id} resource={resource} />
            ))
          ) : (
            <p className='bg-[#fcf8e3] border-[#faebcc] text-gray-600 border-[1px] p-4 rounded-sm'>支援リソースがありません</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default SupportResourcesPage