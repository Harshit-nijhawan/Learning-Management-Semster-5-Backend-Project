import React from 'react'
import { User } from 'lucide-react'
function DashCard({title, value, change, Icon}) {
  return (
    <div className='w-70 p-5 bg-white rounded-lg shadow-md'>
      <div className='flex justify-between items-center'>
        <h4 className='font-semibold'>{title}</h4>
        <Icon size={20} />
      </div>
      <div className=' mt-3'>
        <h1 className='font-semibold text-2xl'>{value}</h1>
        <p><span className='text-green-700 tracking-tighter'>{change}</span> from last month</p>
      </div>
    </div>
  )
}

export default DashCard
