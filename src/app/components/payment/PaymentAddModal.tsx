import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";
import { PaymentMethod } from "./PaymentMethodList";
import { useAppContext } from "@/context/AppContext";

interface ValidationErrors {
  [key: string]: string;
}

interface BillingAddressFields {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const PaymentMethodAddForm: React.FC = () => {
  const { token } = useAppContext();
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const queryClient = useQueryClient();

  const [newMethod, setNewMethod] = useState<PaymentMethod>({
    issuer: "",
    card_number: "",
    cardholder_name: "",
    expiration_date: "",
    cvv: 0,
    billing_address: "",
    is_default: false
  });

  const [addressFields, setAddressFields] = useState<BillingAddressFields>({
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: ""
  });

  const addPaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethod: PaymentMethod) => {
      apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
      const response = await apiRequest.post('auth/profile/addpaymentmethod', paymentMethod);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', token] });
      // Close modal and reset form
      setModalIsOpen(false);
      setNewMethod({
        issuer: "",
        card_number: "",
        cardholder_name: "",
        expiration_date: "",
        cvv: 0,
        billing_address: "",
        is_default: false
      });
      setAddressFields({
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: ""
      });
      setErrors({});
    },
    onError: (error) => {
      console.error("Error adding payment method:", error);
      setErrors({ general: "Failed to add payment method. Please try again." });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setNewMethod({
      ...newMethod,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setAddressFields({
      ...addressFields,
      [name]: value
    });
    
    // Clear related error when user starts typing
    if (errors[name] || errors.billing_address) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      delete updatedErrors.billing_address;
      setErrors(updatedErrors);
    }
  };

  const validatePaymentMethod = (method: PaymentMethod, address: BillingAddressFields): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    if (!method.issuer) {
      errors.issuer = "Issuer is required.";
    }
    if (!method.card_number || !/^\d{16}$/.test(method.card_number)) {
      errors.card_number = "Card number must be 16 digits.";
    }
    if (!method.cardholder_name) {
      errors.cardholder_name = "Cardholder name is required.";
    }
    if (!method.expiration_date || !/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(method.expiration_date)) {
      errors.expiration_date = "Expiration date must be in MM/YY format.";
    }
    if (!method.cvv || !/^\d{3,4}$/.test(method.cvv.toString())) {
      errors.cvv = "CVV must be 3 or 4 digits.";
    }
    
    // Validate address fields
    if (!address.street) {
      errors.street = "Street address is required.";
    }
    if (!address.city) {
      errors.city = "City is required.";
    }
    if (!address.state) {
      errors.state = "State is required.";
    }
    if (!address.postal_code) {
      errors.postal_code = "Postal code is required.";
    }
    if (!address.country) {
      errors.country = "Country is required.";
    }

    return errors;
  };

  const addPaymentMethod = async (): Promise<void> => {
    // Concatenate address fields into billing_address
    const formattedAddress = `${addressFields.street}, ${addressFields.city}, ${addressFields.state} ${addressFields.postal_code}, ${addressFields.country}`;
    
    const paymentMethodWithAddress = {
      ...newMethod,
      billing_address: formattedAddress
    };
    
    const validationErrors = validatePaymentMethod(paymentMethodWithAddress, addressFields);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addPaymentMethodMutation.mutate(paymentMethodWithAddress);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    // Reset form and errors when closing modal
    setErrors({});
  };

  return (
    <div className="relative">
      <button
        onClick={openModal}
        className="mb-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Add New Payment Method
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          {/* Modal Content */}
          <div className="relative text-white bg-black/70 border border-gray-300 w-full max-w-md rounded-lg p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Add Payment Method</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {errors.general && (
              <div className="mb-4 rounded bg-red-100 p-2 text-red-700">
                {errors.general}
              </div>
            )}

            {addPaymentMethodMutation.isPending && (
              <div className="mb-4 rounded bg-blue-100 p-2 text-blue-700">
                Processing your request...
              </div>
            )}

            <form className="space-y-4">
              {/* Card Issuer */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Card Issuer
                </label>
                <select
                  name="issuer"
                  value={newMethod.issuer}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border ${errors.issuer ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                >
                  <option value="">Select an issuer</option>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                  <option value="discover">Discover</option>
                </select>
                {errors.issuer && <p className="mt-1 text-sm text-red-500">{errors.issuer}</p>}
              </div>

              {/* Card Number */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Card Number
                </label>
                <input
                  type="text"
                  name="card_number"
                  value={newMethod.card_number}
                  onChange={handleInputChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={16}
                  className={`w-full rounded-md border ${errors.card_number ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                />
                {errors.card_number && <p className="mt-1 text-sm text-red-500">{errors.card_number}</p>}
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholder_name"
                  value={newMethod.cardholder_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full rounded-md border ${errors.cardholder_name ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                />
                {errors.cardholder_name && <p className="mt-1 text-sm text-red-500">{errors.cardholder_name}</p>}
              </div>

              {/* Expiration Date and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    name="expiration_date"
                    value={newMethod.expiration_date}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full rounded-md border ${errors.expiration_date ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                  />
                  {errors.expiration_date && <p className="mt-1 text-sm text-red-500">{errors.expiration_date}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={newMethod.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full rounded-md border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                  />
                  {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
                </div>
              </div>

              {/* Billing Address Fields */}
              <div className="space-y-4">
                <h4 className="text-md font-medium">Billing Address</h4>
                
                {/* Street Address */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={addressFields.street}
                    onChange={handleAddressChange}
                    placeholder="123 Main St"
                    className={`w-full rounded-md border ${errors.street ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                  />
                  {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street}</p>}
                </div>
                
                {/* City */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressFields.city}
                    onChange={handleAddressChange}
                    placeholder="Anytown"
                    className={`w-full rounded-md border ${errors.city ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
                
                {/* State and Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={addressFields.state}
                      onChange={handleAddressChange}
                      placeholder="CA"
                      className={`w-full rounded-md border ${errors.state ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={addressFields.postal_code}
                      onChange={handleAddressChange}
                      placeholder="12345"
                      className={`w-full rounded-md border ${errors.postal_code ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                    />
                    {errors.postal_code && <p className="mt-1 text-sm text-red-500">{errors.postal_code}</p>}
                  </div>
                </div>
                
                {/* Country */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Country
                  </label>
                  <select
                    name="country"
                    value={addressFields.country}
                    onChange={handleAddressChange}
                    className={`w-full rounded-md border ${errors.country ? 'border-red-500' : 'border-gray-300'} p-2 focus:border-blue-500 focus:outline-none`}
                  >
                    <option value="">Select a country</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    {/* Add more countries as needed */}
                  </select>
                  {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                </div>
              </div>

              {/* Default Payment Method */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  name="is_default"
                  checked={newMethod.is_default}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm">
                  Set as default payment method
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addPaymentMethod}
                  disabled={addPaymentMethodMutation.isPending}
                  className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {addPaymentMethodMutation.isPending ? "Adding..." : "Add Payment Method"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodAddForm;
