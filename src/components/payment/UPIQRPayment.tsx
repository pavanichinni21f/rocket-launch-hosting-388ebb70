import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, RefreshCw, Smartphone, Copy, QrCode } from 'lucide-react';
import { checkPaymentStatus } from '@/services/indianPaymentService';
import { toast } from 'sonner';

interface UPIQRPaymentProps {
  orderId: string;
  amount: number;
  upiId?: string;
  qrData: string;
  upiUrl?: string;
  onSuccess: (orderId: string, txnId: string) => void;
  onFailure: (error: string) => void;
  onCancel: () => void;
}

type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired';

export function UPIQRPayment({
  orderId,
  amount,
  upiId,
  qrData,
  upiUrl,
  onSuccess,
  onFailure,
  onCancel,
}: UPIQRPaymentProps) {
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [isPolling, setIsPolling] = useState(true);
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Generate QR code image
  useEffect(() => {
    const generateQR = async () => {
      if (!qrData) return;
      
      try {
        // Use dynamic import for QR code library
        const QRCode = await import('qrcode');
        const url = await QRCode.toDataURL(qrData, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('QR generation failed:', err);
        // Fallback to a placeholder
        setQrCodeUrl('');
      }
    };

    generateQR();
  }, [qrData]);

  // Poll for payment status
  const pollPaymentStatus = useCallback(async () => {
    if (status !== 'pending' || !isPolling) return;

    try {
      const result = await checkPaymentStatus(orderId);
      
      if (result.success && result.paid) {
        setStatus('success');
        setIsPolling(false);
        onSuccess(orderId, orderId);
      } else if (result.status === 'failed') {
        setStatus('failed');
        setIsPolling(false);
        onFailure('Payment failed');
      }
    } catch (err) {
      console.warn('Status check failed, retrying...', err);
    }
  }, [orderId, status, isPolling, onSuccess, onFailure]);

  // Polling interval
  useEffect(() => {
    if (!isPolling || status !== 'pending') return;

    const interval = setInterval(pollPaymentStatus, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [isPolling, status, pollPaymentStatus]);

  // Countdown timer
  useEffect(() => {
    if (status !== 'pending' || countdown <= 0) {
      if (countdown <= 0) {
        setStatus('expired');
        setIsPolling(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyUPIId = () => {
    if (upiId) {
      navigator.clipboard.writeText(upiId);
      toast.success('UPI ID copied to clipboard');
    }
  };

  const openUPIApp = () => {
    if (upiUrl) {
      window.location.href = upiUrl;
    }
  };

  const handleRetry = () => {
    setStatus('pending');
    setCountdown(600);
    setIsPolling(true);
  };

  const renderStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case 'failed':
        return <XCircle className="h-12 w-12 text-destructive" />;
      case 'expired':
        return <RefreshCw className="h-12 w-12 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode className="h-6 w-6 text-primary" />
          <CardTitle>UPI Payment</CardTitle>
        </div>
        <CardDescription>
          Scan QR code or use UPI app to pay
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Amount to Pay</p>
          <p className="text-3xl font-bold text-primary">₹{amount.toLocaleString('en-IN')}</p>
          <Badge variant="outline" className="mt-2">Order ID: {orderId}</Badge>
        </div>

        {/* Status Display */}
        {status !== 'pending' && (
          <div className="text-center p-6 space-y-4">
            {renderStatusIcon()}
            {status === 'success' && (
              <div>
                <p className="text-lg font-semibold text-green-600">Payment Successful!</p>
                <p className="text-sm text-muted-foreground">Your subscription is now active</p>
              </div>
            )}
            {status === 'failed' && (
              <div>
                <p className="text-lg font-semibold text-destructive">Payment Failed</p>
                <p className="text-sm text-muted-foreground">Please try again</p>
                <Button onClick={handleRetry} className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Payment
                </Button>
              </div>
            )}
            {status === 'expired' && (
              <div>
                <p className="text-lg font-semibold text-muted-foreground">Session Expired</p>
                <p className="text-sm text-muted-foreground">QR code has expired</p>
                <Button onClick={handleRetry} className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New QR
                </Button>
              </div>
            )}
          </div>
        )}

        {/* QR Code Display - Only show when pending */}
        {status === 'pending' && (
          <>
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-inner border-2 border-dashed border-muted">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="UPI QR Code" 
                    className="w-56 h-56"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-muted rounded">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* UPI ID Display */}
            {upiId && (
              <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                <span className="text-sm font-mono">{upiId}</span>
                <Button size="sm" variant="ghost" onClick={copyUPIId}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Open UPI App Button */}
            {upiUrl && (
              <Button onClick={openUPIApp} className="w-full" variant="outline">
                <Smartphone className="h-4 w-4 mr-2" />
                Open UPI App
              </Button>
            )}

            {/* Countdown Timer */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                {renderStatusIcon()}
                <span className="text-sm text-muted-foreground">
                  Waiting for payment...
                </span>
              </div>
              <p className="text-sm">
                Time remaining: <span className="font-mono font-bold">{formatTime(countdown)}</span>
              </p>
            </div>

            {/* Instructions */}
            <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
              <p className="font-semibold">How to pay:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open any UPI app (GPay, PhonePe, Paytm, etc.)</li>
                <li>Scan the QR code above</li>
                <li>Verify the amount and pay</li>
                <li>Payment will be confirmed automatically</li>
              </ol>
            </div>

            {/* Cancel Button */}
            <Button variant="ghost" className="w-full" onClick={onCancel}>
              Cancel Payment
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default UPIQRPayment;
