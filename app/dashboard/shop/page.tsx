'use client'
import { useState } from 'react'
import { ShoppingBag, Star, Filter } from 'lucide-react'

const PRODUCTS = [
  { id: 1, name: 'Glow Serum', category: 'skincare', price: 8500, rating: 4.8, image: '🧴', description: 'Vitamin C brightening serum for melanin-rich skin' },
  { id: 2, name: 'Silk Press Kit', category: 'hair', price: 12000, rating: 4.6, image: '💇‍♀️', description: 'Complete silk press kit with heat protectant' },
  { id: 3, name: 'Braiding Hair', category: 'hair', price: 3500, rating: 4.5, image: '✨', description: 'Premium synthetic braiding hair, 24 inches' },
  { id: 4, name: 'Face Moisturizer', category: 'skincare', price: 5500, rating: 4.7, image: '🧴', description: 'Shea butter based daily moisturizer' },
  { id: 5, name: 'Wig Cap', category: 'hair', price: 1500, rating: 4.3, image: '🎀', description: 'Breathable mesh wig cap, 2 pack' },
  { id: 6, name: 'Lip Gloss Set', category: 'makeup', price: 4000, rating: 4.9, image: '💄', description: '3-piece nude lip gloss collection' },
  { id: 7, name: 'Edge Control', category: 'hair', price: 2500, rating: 4.4, image: '✨', description: 'Strong hold edge control gel' },
  { id: 8, name: 'Body Scrub', category: 'skincare', price: 4500, rating: 4.6, image: '🧴', description: 'Exfoliating coffee body scrub' },
]

const CATEGORIES = ['all', 'skincare', 'hair', 'makeup']

export default function ShopPage() {
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState<number[]>([])

  const filtered = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category)

  const toggleCart = (id: number) => {
    setCart(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Beauty Shop</h1><p className="mt-1 text-gray-600">Curated products for your glow up</p></div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm">
          <ShoppingBag className="h-5 w-5 text-glow-500" />
          <span className="text-sm font-semibold">{cart.length} items</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-gray-400 shrink-0" />
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${category === c ? 'bg-glow-500 text-white' : 'bg-white text-gray-600 hover:bg-glow-50 ring-1 ring-gray-200'}`}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="card p-4 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">{product.image}</div>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-600">{product.rating}</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="font-bold text-glow-600">₦{product.price.toLocaleString()}</span>
              <button onClick={() => toggleCart(product.id)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${cart.includes(product.id) ? 'bg-glow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-glow-50'}`}>
                {cart.includes(product.id) ? 'Added' : 'Add'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-[calc(50%+9rem)] z-50">
          <button className="btn-primary shadow-2xl gap-2">
            <ShoppingBag className="h-4 w-4" />
            Checkout ({cart.length} items) — ₦{cart.reduce((sum, id) => sum + (PRODUCTS.find(p => p.id === id)?.price || 0), 0).toLocaleString()}
          </button>
        </div>
      )}
    </div>
  )
}
