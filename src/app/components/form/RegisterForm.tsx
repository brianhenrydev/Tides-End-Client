import FormInput from "../Input";
import Link from "next/link";

const RegisterForm = ({ handleSubmit, handleChange, formData, error }) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-400 to-red-400">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-6 text-center text-3xl font-bold">Register</h1>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <FormInput
                        id="username"
                        label="Username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="first_name"
                        label="First Name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="last_name"
                        label="Last Name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="age"
                        label="Age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="phone_number"
                        label="Phone Number"
                        type="text"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="address"
                        label="Address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="city"
                        label="City"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="state"
                        label="State"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="zip_code"
                        label="Zip Code"
                        type="text"
                        value={formData.zip_code}
                        onChange={handleChange}
                    />
                    <FormInput
                        id="country"
                        label="Country"
                        type="text"
                        value={formData.country}
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
                    >
                        Register
                    </button>
                    <div className='text-red-300'>Have have an account?</div>
        <Link href="/login" className="mt-4 text-center text-gray-600 hover:text-gray-800">
        <div className="text-indigo-600 transition duration-300 hover:text-indigo-800">
          Log In
          </div>
          </Link>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
