import React from 'react';
import Link from 'next/link';

const NotFound: React.FC = () => {
  return (
      <div className="bg-404">
    <div className="flex h-screen flex-col items-center justify-center">
      <div
        className="w-full max-w-lg rounded-lg bg-cover bg-center p-10 shadow-lg"
      >
        <h1 className="mb-4 text-center text-5xl font-extrabold text-white drop-shadow-lg">404</h1>
        <p className="mb-6 text-center text-xl text-white drop-shadow-lg">
          Oops! It looks like you’ve wandered off to a deserted island.
        </p>
        <Link href="/">
          <button className="inline-block rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 hover:bg-orange-600">
            Go Back
          </button>
        </Link>
      </div>
    </div>
    </div>
  );
};

export default NotFound;

