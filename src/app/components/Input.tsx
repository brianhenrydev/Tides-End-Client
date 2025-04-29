import React from 'react';

interface FormInputProps {
  id: string;
  label: string;
  name?: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  styleClass?: string;
  labelStyle: string;
}

const FormInput: React.FC<FormInputProps> = ({ id, label, type, value, name, onChange, styleClass, labelStyle }) => (
  <div className="mb-4">
    <label htmlFor={id} className={`${labelStyle}`}>{label}</label>
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`${styleClass}`}
      required
    />
  </div>
);

export default FormInput;
