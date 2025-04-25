import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import RegisterForm from "@/app/components/form/RegisterForm";


const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        age: "",
        phone_number: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
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
            const response = await axios.post("/api/register", formData, {
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
            <RegisterForm
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                formData={formData}
                error={error}
                
                />
                
            
        </div>
    );
};

export default Register;
