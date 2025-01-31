import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosInstance from '../config/axios';
import { signup, login } from '../store/authSlice';
import {useDispatch, useSelector} from 'react-redux'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  // const {user} = useSelector((state)=> state.auth)

  const onSubmit = async (data) => {
    try {
      // Wait for the async thunk to complete and unwrap the result
      await dispatch(login(data)).unwrap();
      // Navigate to the dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please check your credentials.');
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required', pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address"} })}
            />
             {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              {...register('password', { required: true })} // Register password field with validation
            />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <div>
          dont have an account? <Link to={'/signup'} className='text-blue-500'> sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;