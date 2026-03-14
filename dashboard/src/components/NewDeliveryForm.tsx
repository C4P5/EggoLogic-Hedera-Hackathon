import { useState } from 'react'

interface Props {
  token: string | null;
}

export default function NewDeliveryForm({ token }: Props) {
  const [provider, setProvider] = useState('')
  const [kgNetos, setKgNetos] = useState('')
  const [pctImpropios, setPctImpropios] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
        setMessage('Error: You must be logged in to submit a delivery.')
        return
    }

    setSubmitting(true)
    setMessage('Submitting to Guardian via KMS...')

    try {
      const payload = {
          provider,
          kg_netos: parseFloat(kgNetos),
          pct_impropios: parseFloat(pctImpropios),
          timestamp: new Date().toISOString()
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(`Success! Transaction ID: ${data.transactionId}`)
        setProvider('')
        setKgNetos('')
        setPctImpropios('')
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error(error)
      setMessage('Failed to connect to backend api.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-green-100 p-5 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Registrar Nueva Entrega</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <input 
                type="text" 
                placeholder="Provider Name"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                required
            />
            <input 
                type="number" 
                placeholder="Kg Netos"
                value={kgNetos}
                onChange={(e) => setKgNetos(e.target.value)}
                className="w-32 border border-gray-300 rounded px-3 py-2 text-sm"
                required
            />
            <input 
                type="number" 
                placeholder="% Impropios"
                value={pctImpropios}
                onChange={(e) => setPctImpropios(e.target.value)}
                className="w-32 border border-gray-300 rounded px-3 py-2 text-sm"
                required
            />
            <button 
                type="submit" 
                disabled={submitting || !token}
                className="bg-eggo-green text-white px-4 py-2 rounded text-sm font-medium hover:bg-eggo-green-dark disabled:opacity-50"
            >
                {submitting ? 'Signing...' : 'Submit to KMS'}
            </button>
        </div>
        {message && (
            <div className={`text-sm p-2 rounded ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message}
            </div>
        )}
      </form>
    </div>
  )
}
