import { useState } from "react";

interface PaymentMethod {
  issuer: string;
  masked_card_number: string;
  cardholder_name: string;
  expiration_date: string;
  cvv: number;
  billing_address: string;
  is_default: boolean;
}

interface PaymentFormProps {
  paymentMethods?: PaymentMethod[];
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentMethods }) => {

  return (
    <div className="rounded-lg bg-white p-6 text-gray-800 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">Payment Methods</h1>
      <button className="mb-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        Add Payment Method
      </button>
      {paymentMethods.length > 0 ? (
        paymentMethods.map((method, index) => (
          <div key={index} className="mb-4 rounded-md border p-4">
            <p>Issuer: {method.issuer}</p>
            <p>Card Number: {method.masked_card_number}</p>
            <p>Cardholder Name: {method.cardholder_name}</p>
            <p>Expiration Date: {method.expiration_date}</p>
            <p>Billing Address: {method.billing_address}</p>
            <div className="mt-2 flex justify-end">
              <button className="mr-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                Edit
              </button>
              <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No payment methods available at the moment.</p>
      )}
    </div>
  );
};

export default PaymentForm;