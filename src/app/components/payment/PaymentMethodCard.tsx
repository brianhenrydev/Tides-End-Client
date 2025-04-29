import apiRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from 'axios';
import { useState } from "react";

function PaymentMethodCard({ method }) {
    const queryClient = useQueryClient();
    const [paymentEdit, update] = useState({
      issuer: "",
      card_number: "",
      expiration_date: "",
      billing_address: "",
    });
   

  const {mutate: removePaymentMethodMutation, status: removeMethodStatus} = useMutation({
    mutationFn: async () => {
      apiRequest.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem("token")}`;
      const response = await apiRequest.post('auth/profile/removepaymentmethod', {payment_method_id:method.id});
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', localStorage.getItem("token")] });
      
    },
    onError: (error) => {
      console.error("Error adding payment method:", error);
    }
  });
  const removePaymentMethod = () => removePaymentMethodMutation
  
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      mutate();
    };
    return (
      <div className="mb-4 rounded-md border p-4">
        <p>Issuer: {method.issuer.charAt(0).toUpperCase() + method.issuer.slice(1)}</p>
        <p>Card Number: {method.masked_card_number}</p>
        <p>Cardholder Name: {method.cardholder_name}</p>
        <p>Expiration Date: {method.expiration_date}</p>
        <div className="mt-2 flex justify-end">
          <button
            onClick={removePaymentMethod}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            disabled={removeMethodStatus === "pending"}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  export default PaymentMethodCard;