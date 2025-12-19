import React from 'react'
import { User } from 'lucide-react'
function DashCard({title, value, change, Icon}) {
  return (
    <div className='w-70 p-5 bg-white rounded-lg shadow-md border border-gray-100'>
      <div className='flex justify-between items-center'>
        <h4 className='font-semibold text-gray-900'>{title}</h4>
        <Icon size={20} className="text-blue-600" />
      </div>
      <div className=' mt-3'>
        <h1 className='font-semibold text-2xl text-gray-900'>{value}</h1>
        <p className="text-gray-600"><span className='text-green-700 tracking-tighter'>{change}</span> from last month</p>
      </div>
    </div>
  )
}

export default DashCard
