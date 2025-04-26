import React from 'react';

interface ButtonProps {
  id: string;
  label: string;
  type: "submit" | "reset" | "button" | undefined;
  name: string; // Add the name property to the interface
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style: string;
}

const Button: React.FC<ButtonProps> = ({ id, label, type, name, onClick, style }) => (
  <div className="mb-4">
    <button
      id={id}
      type={type}
      name={name}
      onClick={onClick}
      className={style? style : "w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"}
    >
      {label}
    </button>
  </div>
);

export default Button;

