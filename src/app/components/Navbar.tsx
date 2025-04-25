"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";

export default function Navbar() {
  const {token, setToken } = useAppContext();
  const router = useRouter();
  
  const loggedInButtons = () => {
    return (
      <div className="flex flex-row gap-4">
        <Link
          href="/profile"
          className="rounded-md bg-blue-600 px-8 py-2 text-white hover:bg-red-500"
        >
          Profile
        </Link>
        <button
          onClick={() => {
            setToken(null);
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="rounded-md bg-red-600 px-8 py-2 text-white hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    );
  }
  const loggedOutButtons = () => {
    return (
      <div className="flex flex-row gap-4">
        <Link
          href="/login"
          className="rounded-md bg-red-600 px-8 py-2 text-white hover:bg-red-500"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-red-600 px-8 py-2 text-white hover:bg-red-500"
        >
          Register
        </Link>
      </div>
    );
  };

  return (
    <div className="mb-2 flex items-center justify-between bg-gray-800 px-4 py-2 text-white">
      {/* Site Title */}
      <div className="text-xl font-bold">
        <Link href="/">Tide's End</Link>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-row gap-4">
        {token ? loggedInButtons() : loggedOutButtons()}
      </div>
    </div>
  );
}
