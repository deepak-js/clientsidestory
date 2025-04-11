'use client'

import { useState, useEffect } from 'react'
import { Link, LinkAnalytics as LinkAnalyticsType, getLinkAnalytics } from '@/lib/utils/links'

interface LinkAnalyticsProps {
  link: Link
}

export default function LinkAnalytics({ link }: LinkAnalyticsProps) {
  const [analytics, setAnalytics] = useState<LinkAnalyticsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await getLinkAnalytics(link.id)
        setAnalytics(data)
      } catch (err) {
        console.error('Error fetching link analytics:', err)
        setError('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalytics()
  }, [link.id])
  
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-700">
        {error}
      </div>
    )
  }
  
  if (!analytics) {
    return (
      <div className="rounded-md bg-gray-50 p-4 text-gray-700">
        No analytics data available
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Overview</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">{analytics.total_clicks}</p>
            <p className="text-sm text-gray-500">Total Clicks</p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">
              {analytics.clicks_by_day.length > 0 ? analytics.clicks_by_day[analytics.clicks_by_day.length - 1].count : 0}
            </p>
            <p className="text-sm text-gray-500">Today's Clicks</p>
          </div>
          
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">
              {analytics.top_referrers.length > 0 ? analytics.top_referrers[0].count : 0}
            </p>
            <p className="text-sm text-gray-500">Top Referrer Clicks</p>
          </div>
        </div>
      </div>
      
      {analytics.top_referrers.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Top Referrers</h3>
          <div className="space-y-2">
            {analytics.top_referrers.map((referrer, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="font-medium">{referrer.referrer || 'Direct'}</span>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                  {referrer.count} clicks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {analytics.top_countries.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Top Countries</h3>
          <div className="space-y-2">
            {analytics.top_countries.map((country, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="font-medium">{country.country}</span>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                  {country.count} clicks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {analytics.clicks_by_day.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Clicks by Day</h3>
          <div className="h-64 overflow-x-auto">
            <div className="flex h-full items-end space-x-2">
              {analytics.clicks_by_day.map((day, index) => {
                const maxCount = Math.max(...analytics.clicks_by_day.map(d => d.count))
                const height = day.count > 0 ? (day.count / maxCount) * 100 : 5
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-10 rounded-t bg-indigo-500" 
                      style={{ height: `${height}%` }}
                    ></div>
                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
