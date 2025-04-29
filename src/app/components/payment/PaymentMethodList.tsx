import PaymentMethodAddForm from "./PaymentAddModal";
import PaymentMethodCard from "./PaymentMethodCard"

export interface PaymentMethod {
  issuer: string;
  masked_card_number?: string;
  card_number?: string; 
  cardholder_name: string;
  expiration_date: string;
  cvv: number;
  billing_address: string;
  is_default: boolean;
}

interface PaymentFormProps {
  paymentMethods: PaymentMethod[];
}

const PaymentMethodList: React.FC<PaymentFormProps> = ({ paymentMethods }) => {
  return (
    <div className="rounded-lg bg-white p-6 text-gray-800 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
        Payment Methods
      </h1>
      <PaymentMethodAddForm />
      {paymentMethods?.length > 0 ? (
        paymentMethods?.map((method, index) => (
          <PaymentMethodCard key={index} method={method} index={index} />
        ))
      ) : (
        <p className="text-center text-gray-600">
          No payment methods available at the moment.
        </p>
      )}
    </div>
  );
};




export default PaymentMethodList;
