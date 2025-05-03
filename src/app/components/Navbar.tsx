"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import { SetStateAction, Dispatch } from "react";
import { Waves } from "lucide-react";

interface AppContext {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
}
export default function Navbar() {
  const {token, setToken, profile } = useAppContext() as AppContext;
  const router = useRouter();

  const logout = () => {
            setToken(null);
            localStorage.removeItem("token");
            document.cookie = 'token=; Max-Age=0;'
    
            router.push("/login");
          }  
  const loggedInButtons = () => {
    return (
      <div className="flex flex-row gap-4">
      { profile.is_admin ?

        <Link 
        href="/admin"
        className="rounded-md bg-blue-600 px-8 py-2 text-white hover:bg-red-500">
            Admin Dashboard
        </Link>
        : ""
      }
        <Link
          href="/profile"
          className="rounded-md bg-blue-600 px-8 py-2 text-white hover:bg-red-500"
        >
          Profile
        </Link>
        <button
          onClick={logout}
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
    <div className="fixed top-0 left-0 z-10 w-full mb-2 flex items-center justify-between bg-gray-800/95 px-4 py-4 text-white font-serif">
      {/* Site Title */}
      <div className="text-xl font-bold rounded-lg p-3 bg-gray-800/10 hover:bg-gray-800/40">
        <Link href="/"><div className="flex items-center"><div>Tide&apos;s End</div><Waves /></div></Link>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-row gap-4">
        {token ? loggedInButtons() : loggedOutButtons()}
      </div>
    </div>
  );
}
