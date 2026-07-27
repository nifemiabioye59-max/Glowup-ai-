'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    if (!reference) { setStatus('error'); setMessage('No reference found'); return }
    fetch(`/api/payment/verify?reference=${reference}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) { setStatus('success'); setMessage('Payment successful! Your glow up starts now.') }
        else { setStatus('error'); setMessage(data.error || 'Verification failed') }
      })
      .catch(() => { setStatus('error'); setMessage('Something went wrong') })
  }, [reference])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-glow-500 mx-auto mb-4" />}
        {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />}
        {status === 'error' && <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />}
        <h2 className="text-xl font-semibold text-gray-900">{status === 'loading' ? 'Processing...' : status === 'success' ? 'Welcome to GLOWUP Pro!' : 'Payment Failed'}</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        {status === 'success' && <a href="/dashboard" className="btn-primary mt-6 inline-block">Go to Dashboard</a>}
      </div>
    </div>
  )
}
