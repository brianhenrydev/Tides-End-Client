"use client"
import "../app/globals.css"
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import FormInput from '../app/components/Input';
import apiRequest from '../lib/axios';
import { useAppContext } from '../context/AppContext';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import Link from 'next/link';
import { Waves } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { ProfileI } from "@/app/Interfaces";


type AppContextType = {
  profile: ProfileI;
  token: string;
  setToken: (token: string) => void;
  setProfile: (profile: ProfileI) => void;
}

const LoginPage: React.FC = () => {
  const { setToken, setProfile } = useAppContext() as AppContextType;
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
      setProfile(data.data)
      document.cookie = `token=${token}`
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
        <title>Login - Tide's End Beach Campground</title>
        <meta name="description" content="Login to your Tide&apos;s End account" />
      </Head>
      <div className="bg-image flex min-h-screen items-center justify-center bg-cover bg-center" >
        <div className="login-form">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Waves className="text-blue-200" size={28} />
            <h1 className="text-3xl font-bold text-blue-400">Tide&apos;s End</h1>
          </div>
          <h2 className="mb-6 text-center text-2xl font-semibold text-blue-200">Welcome Back</h2>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              Invalid username or password. Please try again.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="username"
              label="Username"
              styleClass="auth-form-input"
              labelStyle="mb-2 block text-sm font-medium text-slate-200"
              type="text"
              value={user.user}
              onChange={({ target: { value: username } }) => setUser({ ...user, user: username })}
            />
            <FormInput
              id="password"
              styleClass="auth-form-input"
              labelStyle="mb-2 block text-sm font-medium text-slate-200"
              label="Password"
              type="password"
              value={user.password}
              onChange={({ target: { value: password } }) => setUser({ ...user, password })}
            />
            
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-500 py-3 font-medium text-white transition duration-200 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-white">Don&apos;t have an account? </span>
              <Link href="/register">
                <span className="rounded-2xl p-2 font-medium text-blue-300 shadow-lg transition duration-200 hover:text-red-500">
                  Sign Up
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

LoginPage.getLayout = function getLayout(page) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className='flex-grow'>{page}</main>
    </div>
  );
};

export default LoginPage;
