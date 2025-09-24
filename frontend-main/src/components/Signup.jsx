import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import PersonIcon from '../icons/PersonIcon'
import EmailIcon from '../icons/EmailIcon'
import PhoneIcon from '../icons/PhoneIcon'
import PasswordIcon from '../icons/PasswordIcon'
import EyeIcon from '../icons/EyeIcon'
import EyeOffIcon from '../icons/EyeOffIcon'

function Signup() {
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [number, setnumber] = useState("")
  const [role, setrole] = useState('student')
  const [errors, seterrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const generatepassword=() =>{
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let newPass = "";
    for(let i=0; i<6; i++){
        newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setpassword(newPass);
  }
    
  const { login } = useAuth();
    
  const handlesubmit = async (e) => {
    e.preventDefault()

    let newerrors = {}
    if(!name) newerrors.name = "Name is Required!"
    if(!email) newerrors.email = "Email is required!"
    if(!number) {
      newerrors.number = "Phone Number is required!";
    } else if (!/^\d{10}$/.test(number)) {
      newerrors.number = "Phone Number must be exactly 10 digits!";
    }
    if(!password) newerrors.password = "Password is required!"
    if(!role || !['student','instructor'].includes(role)) newerrors.role = "Role is required!"

    seterrors(newerrors)

    if(Object.keys(newerrors).length > 0) return;

    try {
      // Log the data being sent
      console.log('Sending registration data:', { name, email, number, password, role });

      const response = await api.post('/register', {
        name,
        email,
        number,
        password,
        role
      });

      console.log('Registration response:', response.data);

      if (response.data.token) {
        login(response.data.token, response.data.user);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);

      if (error.response?.data?.errors) {
        seterrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        seterrors({ general: error.response.data.message });
      } else {
        seterrors({ general: 'Registration failed. Please try again.' });
      }
    }
    }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-2xl p-8 space-y-6'>
        <h2 className='text-3xl font-bold text-center text-gray-800 tracking-wide'>
          Welcome to Learnify
        </h2>
        <form className='space-y-5' onSubmit={handlesubmit}>
          <div className='space-y-2'>
            <label htmlFor="name" className='block text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PersonIcon className="h-5 w-5 text-gray-400" />
              </div>
            <input 
              type="text" 
              id="name"
              name='name'
              placeholder='Enter your name'
              value={name}
              className={`w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1B3C53] focus:border-[#1B3C53] outline-none transition duration-150'
                ${errors.name ? 'border-red-600' : 'border-gray-400'}`}
              onChange={(e)=>setname(e.target.value)}
              onFocus={() => seterrors(prev => ({...prev, name: ""}))}
            />
            </div>
            {errors.name && <p className='text-red-500 text-sm !pt-0'>{errors.name}</p>}
          </div>

          <div className='space-y-2'>
            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EmailIcon className="h-5 w-5 text-gray-400" />
              </div>
            <input 
              type="email" 
              id="email"
              name='email'
              placeholder='Enter your email'
              value={email}
              className={`w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1B3C53] focus:border-[#1B3C53] outline-none transition duration-150'
                ${errors.email ? 'border-red-600' : 'border-gray-400'}`}
              onChange={(e)=>setemail(e.target.value)}
              onFocus={() => seterrors(prev => ({...prev, email: ""}))}
            />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className='space-y-2'>
            <label htmlFor="number" className='block text-sm font-medium text-gray-700'>
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
            <input 
              type="number"
              id='number'
              name='number'
              placeholder='Enter your phone number'
              value={number === undefined ? '' : number}
              className={`w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#1B3C53] outline-none transition duration-150 
                    ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
              onChange={(e)=>setnumber(e.target.value)}
              onFocus={() => seterrors(prev => ({...prev, number: ""}))}
            />
              </div>
              {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
            </div>

          <div className='space-y-2'>
            <label htmlFor="password" className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PasswordIcon className="h-5 w-5 text-gray-400" />
              </div>
            <input 
              type={showPassword ? "text" : "password"}
              id="password" 
              name='password'
              placeholder='Enter your password'
              value={password}
              className={`w-full pl-10 pr-12 px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#1B3C53] outline-none transition duration-150 
                    ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              onChange={(e)=>setpassword(e.target.value)}
              onFocus={() => seterrors(prev => ({...prev, password: ""}))}
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
              </div>
            </div>
            
            <button type='button' className='mt-0 text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-500' onClick={generatepassword}>Generate password</button>
           
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

          <div className='space-y-2'>
            <label htmlFor="role" className='block text-sm font-medium text-gray-700'>
              Sign up as
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={e => setrole(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1B3C53] focus:border-[#1B3C53] outline-none transition duration-150'
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          <button 
            type='submit' 
            className='w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:ring-offset-2 transition duration-150 font-medium'
          >
            Sign Up
          </button>
          {errors.general && (
            <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>
          )}
        </form>
        <hr className='border-gray-400' />

        <p className='text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:text-blue-700 font-medium'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
