"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import FormInput from '../app/components/FormInput';
import apiRequest from '../lib/axios';
import { useAppContext } from '../context/AppContext';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import Link from 'next/link';

interface AppContextType {
  profile: any;
  token: string;
  setToken: (token: string) => void;
  setProfile: (profile: any) => void;
}



const LoginPage: React.FC = () => {
  const {setToken } = useAppContext() as AppContextType;
  const router = useRouter();
  const [user, setUser] = useState({
    user: '',
    password: ''
  });

  

  const login = async (): Promise<AxiosResponse<any>> => {
    const response = await apiRequest.post('auth/login', {
      username: user.user,
      password: user.password
    });

    return response;
  };

  const { mutate, isLoading, error } = useMutation<AxiosResponse<any>, Error, void>({
    mutationFn: login,
    onSuccess: (data) => {
      const { token } = data.data;
      localStorage.setItem('token', token);
      setToken(token);
      apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
      router.push('/'); // Redirect to home page after successful login
    },
    onError: (error: Error) => {
      console.error("Login failed:", error);
      window.alert("Login failed. Please check your credentials.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="Login to your account" />
      </Head>
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-white">
        <form
          onSubmit={handleSubmit}
          className="w-96 rounded-xl bg-white p-8 shadow-lg"
        >
          <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-800">Login</h2>
          <FormInput
            id="username"
            label="Username"
            type="username"
            value={user.user}
            onChange={({ target: { value: username } }) => setUser({ ...user, user: username })}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={user.password}
            onChange={({ target: { value: password } }) => setUser({ ...user, password })}
          />
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-indigo-600 py-3 font-bold text-white transition duration-300 hover:bg-indigo-700"
            disabled={isLoading}
          >
            Log in
          </button>
          <div className='text-red-300'>Don't have an account?</div>
        <Link href="/register" className="mt-4 text-center text-gray-600 hover:text-gray-800">
        <div className="text-indigo-600 transition duration-300 hover:text-indigo-800">
          Sign Up
          </div>
          </Link>
        </form>
        </div>
        
    </>
  );
};

export default LoginPage;

