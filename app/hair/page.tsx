'use client'

import { useState } from 'react'
import { Scissors, Search, Camera, Sparkles, DollarSign } from 'lucide-react'

const hairstyles = [
  { id: 1, name: 'Box Braids', image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=300&h=400&fit=crop', price: '₦5,000 - ₦15,000', time: '4-6 hours', face: 'Oval, Round' },
  { id: 2, name: 'Knotless Braids', image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=300&h=400&fit=crop', price: '₦8,000 - ₦20,000', time: '5-8 hours', face: 'All' },
  { id: 3, name: 'Cornrows', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=400&fit=crop', price: '₦2,000 - ₦5,000', time: '1-2 hours', face: 'All' },
  { id: 4, name: 'Fulani Braids', image: 'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=300&h=400&fit=crop', price: '₦6,000 - ₦18,000', time: '4-7 hours', face: 'Oval, Heart' },
  { id: 5, name: 'Ghana Weaving', image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=300&h=400&fit=crop', price: '₦3,000 - ₦8,000', time: '2-4 hours', face: 'Round, Square' },
  { id: 6, name: 'Locs', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=300&h=400&fit=crop', price: '₦10,000 - ₦30,000', time: '6-10 hours', face: 'All' },
  { id: 7, name: 'Afro Puff', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=300&h=400&fit=crop', price: '₦1,000 - ₦3,000', time: '30 min', face: 'All' },
  { id: 8, name: 'Twist Out', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=400&fit=crop', price: '₦2,000 - ₦5,000', time: '2-3 hours', face: 'Oval, Long' },
]

export default function HairPage() {
  const [search, setSearch] = useState('')
  const [budget, setBudget] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<any>(null)
  const [showAI, setShowAI] = useState(false)

  const filtered = hairstyles.filter((h: any) => h.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <Scissors size={32} /> Hair Styles
        </h1>
        <p className="text-gray-600">Browse styles like Pinterest, scan your face & get AI matches</p>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-8 border border-pink-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-yellow-500" /> AI Hair Match
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-pink-200 rounded-xl hover:bg-pink-50 transition">
            <Camera size={24} className="text-pink-500" />
            <span className="text-sm font-medium text-gray-700">Upload Face Photo</span>
          </button>
          <input
            type="number"
            placeholder="Your budget (₦)"
            className="p-4 border rounded-xl"
            value={budget}
            onChange={e => setBudget(e.target.value)}
          />
          <button
            onClick={() => setShowAI(true)}
            className="pink-gradient text-white py-4 rounded-xl font-semibold hover:opacity-90"
          >
            Find My Perfect Style
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search hairstyles..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map((style: any) => (
          <div
            key={style.id}
            onClick={() => setSelectedStyle(style)}
            className="break-inside-avoid bg-white rounded-2xl overflow-hidden border border-pink-100 card-hover cursor-pointer"
          >
            <img src={style.image} alt={style.name} className="w-full object-cover" />
            <div className="p-3">
              <h3 className="font-bold text-gray-800 text-sm">{style.name}</h3>
              <p className="text-xs text-gray-500">{style.time}</p>
              <p className="text-xs text-pink-600 font-medium mt-1">{style.price}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
            <img src={selectedStyle.image} alt={selectedStyle.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedStyle.name}</h2>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 flex items-center gap-2"><DollarSign size={16} className="text-green-500" /> {selectedStyle.price}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2"><Scissors size={16} className="text-pink-500" /> Duration: {selectedStyle.time}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2"><Sparkles size={16} className="text-yellow-500" /> Best for: {selectedStyle.face} faces</p>
              </div>
              <button
                onClick={() => setShowAI(true)}
                className="w-full pink-gradient text-white py-3 rounded-xl font-semibold mb-3"
              >
                Ask AI How to Make This
              </button>
              <button
                onClick={() => setSelectedStyle(null)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="font-bold text-gray-800 mb-3">AI Recommendation</h3>
            <div className="bg-pink-50 rounded-xl p-4 text-sm text-gray-700 space-y-2">
              <p><strong>Style:</strong> {selectedStyle?.name || 'Based on your face shape'}</p>
              <p><strong>Budget Match:</strong> {budget ? `Styles under ₦${budget}` : 'All ranges'}</p>
              <p><strong>How to make:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Wash and detangle hair thoroughly</li>
                <li>Section hair into parts</li>
                <li>Use quality extensions if needed</li>
                <li>Follow video tutorials for technique</li>
                <li>Moisturize scalp daily after installation</li>
              </ol>
              <p className="text-pink-600 font-medium mt-2">Recommended salons near you will be added soon!</p>
            </div>
            <button
              onClick={() => setShowAI(false)}
              className="w-full mt-4 pink-gradient text-white py-2 rounded-xl font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  )
            }
                                                                               
