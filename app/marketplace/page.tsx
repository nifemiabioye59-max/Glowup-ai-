'use client'

import { useState } from 'react'
import { ShoppingBag, Plus, Search, Star, AlertCircle, X } from 'lucide-react'

const products = [
  { id: 1, name: 'Glow Skin Serum', price: 8500, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop', rating: 4.8, seller: 'GlowBeauty', approved: true, category: 'Skin' },
  { id: 2, name: 'Hair Growth Oil', price: 6000, image: 'https://images.unsplash.com/photo-1608248543802-640c2de311b2?w=300&h=300&fit=crop', rating: 4.5, seller: 'NaturalHair', approved: true, category: 'Hair' },
  { id: 3, name: 'Waist Trainer', price: 12000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', rating: 4.2, seller: 'FitBody', approved: true, category: 'Body' },
  { id: 4, name: 'Vitamin C Face Cream', price: 4500, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop', rating: 4.7, seller: 'SkinGlow', approved: true, category: 'Skin' },
  { id: 5, name: 'Butt Enhancement Pills', price: 15000, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop', rating: 3.9, seller: 'CurvyPlus', approved: false, category: 'Body' },
  { id: 6, name: 'Organic Shea Butter', price: 3500, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop', rating: 4.9, seller: 'PureAfrica', approved: true, category: 'Skin' },
]

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showSell, setShowSell] = useState(false)
  const [cart, setCart] = useState<number[]>([])
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Skin', image: '' })

  const filtered = products.filter((p: any) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || p.category === category
    const matchApproved = p.approved
    return matchSearch && matchCat && matchApproved
  })

  const addToCart = (id: number) => {
    setCart([...cart, id])
    alert('Added to cart! Checkout with Paystack coming soon.')
  }

  const submitProduct = () => {
    alert('Product submitted for admin approval! You will be notified once approved.')
    setShowSell(false)
    setNewProduct({ name: '', price: '', category: 'Skin', image: '' })
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <ShoppingBag size={32} /> Marketplace
        </h1>
        <p className="text-gray-600">Buy beauty & body enhancement products. Sell your own too!</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-pink-100">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="outline-none text-sm w-48 md:w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowSell(true)}
          className="flex items-center gap-2 pink-gradient text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          <Plus size={18} /> Sell Product
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
        {['All', 'Skin', 'Hair', 'Body', 'Makeup'].map((c: string) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              category === c ? 'pink-gradient text-white' : 'bg-white border border-pink-200 text-gray-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product: any) => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-pink-100 card-hover">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2">by {product.seller}</p>
              <div className="flex items-center gap-1 mb-2">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-600">{product.rating}</span>
              </div>
              <p className="text-lg font-bold text-pink-600 mb-3">₦{product.price.toLocaleString()}</p>
              <button
                onClick={() => addToCart(product.id)}
                className="w-full pink-gradient text-white py-2 rounded-xl text-sm font-semibold hover:opacity-90"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {showSell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Sell Your Product</h3>
              <button onClick={() => setShowSell(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-xl"
                  placeholder="e.g. Organic Hair Cream"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Price (₦)</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-xl"
                  placeholder="e.g. 5000"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                <select
                  className="w-full p-3 border rounded-xl"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option>Skin</option>
                  <option>Hair</option>
                  <option>Body</option>
                  <option>Makeup</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Product Image URL</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-xl"
                  placeholder="Paste image URL"
                  value={newProduct.image}
                  onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                />
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 text-sm text-yellow-700 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>Your product will be reviewed by admin before going live. You'll use our Paystack for payments.</p>
              </div>
              <button
                onClick={submitProduct}
                className="w-full pink-gradient text-white py-3 rounded-xl font-semibold"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
