import React from 'react'
import { User } from 'lucide-react'
function DashCard({ title, value, change, Icon }) {
  return (
    <div className='w-full p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
      <div className='flex justify-between items-start'>
        <div>
          <h4 className='font-medium text-gray-500 text-sm mb-1 uppercase tracking-wide'>{title}</h4>
          <h1 className='font-bold text-3xl text-gray-900 mt-2'>{value}</h1>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <Icon size={24} />
        </div>
      </div>
      <div className='mt-4 flex items-center text-sm'>
        <span className={`font-semibold ${change.includes('+') || change === 'Active' ? 'text-green-600' : 'text-blue-600'} bg-gray-50 px-2 py-1 rounded-lg`}>
          {change}
        </span>
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    </div>
  )
}

export default DashCard
