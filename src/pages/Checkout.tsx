import { useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import UPICheckout from '@/components/payment/UPICheckout';

export default function Checkout() {
  const [params] = useSearchParams();
  const amount = Number(params.get('amount') ?? 999);
  const product = params.get('product') ?? 'KSFoundation Hosting — Starter (Monthly)';

  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Payment</h1>
        <UPICheckout amount={amount} productInfo={product} />
      </div>
    </AppLayout>
  );
}
