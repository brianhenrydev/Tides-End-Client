import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Waves } from "lucide-react";
import FormInput from "@/app/components/Input"
import Link from "next/link";
import apiRequest from "@/lib/axios";


const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        age: "",
        phone_number: "",
    });

    const [error, setError] = useState<string | null>(null);
    const route = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await apiRequest.post("/auth/register", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                // Redirect to login or home page after successful registration
                route.push("/login");
            }
        } catch (err: any) {
            if (err.response && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="register-page">
    <div className="bg-image flex min-h-screen items-center justify-center bg-cover bg-center" >
      <div className="register-form">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Waves className="text-blue-400" size={28} />
          <h1 className="text-3xl font-bold text-blue-200">Tide's End</h1>
        </div>
        <h2 className="mb-6 text-center text-2xl font-semibold text-blue-400">Camper Registration</h2>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              id="first_name"
              labelStyle="mb-2 block text-sm font-medium text-slate-200"
              name="first_name"
              label="First Name"
              styleClass="auth-form-input"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
            />
            <FormInput
              id="last_name"
              labelStyle="mb-2 block text-sm font-medium text-slate-200"
              name="last_name"
              styleClass="auth-form-input"
              label="Last Name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          
          <FormInput
            id="username"
              labelStyle="mb-2 block text-sm font-medium text-slate-200"
              name="username"
            styleClass="auth-form-input"
            label="Username"
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          
          <FormInput
            id="email"
              labelStyle="mb-2 block text-sm font-medium text-slate-200"
            name="email"
            label="Email"
            styleClass="auth-form-input"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          
          <FormInput
            id="password"
              labelStyle="mb-2 block text-sm font-medium text-slate-200"
            name="password"
            styleClass="auth-form-input"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              labelStyle="mb-2 block text-sm font-medium text-slate-200"
              id="age"
              name="age"
              styleClass="auth-form-input"
              label="Age"
              type="number"
              value={formData.age}
              onChange={handleChange}
            />
            <FormInput
              id="phone_number"
              labelStyle="mb-2 block text-sm font-medium text-slate-200"
              name="phone_number"
              label="Phone Number"
              type="tel"
              styleClass="auth-form-input"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-blue-500 py-3 font-medium text-white transition duration-200 hover:bg-blue-600"
          >
            Complete Registration
          </button>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-white">Already have an account? </span>
            <Link href="/login">
              <span className="rounded-2xl p-2 font-medium text-blue-300 shadow-lg transition duration-200 hover:text-red-500">
                Log In
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
                
            
        </div>
    );
};

export default Register;
