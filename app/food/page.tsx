'use client'

import { useState } from 'react'
import { Utensils, Search, Globe, Heart, AlertTriangle, ChefHat, Clock, Users } from 'lucide-react'

const countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'India', 'Mexico', 'Italy', 'China', 'Japan', 'USA', 'Jamaica', 'Brazil']

const recipes = [
  {
    id: 1,
    name: 'Jollof Rice with Grilled Chicken',
    country: 'Nigeria',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop',
    calories: 450,
    time: '45 min',
    servings: 4,
    health: ['High Protein', 'Gluten Free'],
    avoid: ['Diabetes - reduce oil', 'Ulcer - avoid pepper'],
    ingredients: [
      '2 cups long grain rice',
      '3 tomatoes, blended',
      '1 onion, chopped',
      '2 bell peppers',
      'Chicken thighs (4)',
      'Thyme, curry, bay leaves',
      'Vegetable oil (3 tbsp)',
    ],
    steps: [
      'Blend tomatoes, peppers and half onion into smooth paste',
      'Fry remaining onion in oil until soft, add tomato paste',
      'Add spices and simmer for 10 minutes',
      'Add washed rice and stock, cook on low heat for 25 min',
      'Grill chicken separately with spices',
      'Serve rice with chicken on top',
    ],
    whereToBuy: 'Local markets: Mile 12 (Lagos), Ogbete (Enugu). Supermarkets: Shoprite, Spar',
  },
  {
    id: 2,
    name: 'Kenyan Ugali with Sukuma Wiki',
    country: 'Kenya',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    calories: 320,
    time: '30 min',
    servings: 3,
    health: ['High Fiber', 'Low Fat', 'Good for Ulcer'],
    avoid: ['None'],
    ingredients: [
      '2 cups maize flour',
      '4 cups water',
      '1 bunch kale (sukuma wiki)',
      '1 onion, diced',
      '2 tomatoes, chopped',
      'Cooking oil (2 tbsp)',
    ],
    steps: [
      'Boil water in a pot, slowly add maize flour while stirring',
      'Keep stirring until thick and smooth, about 10 min',
      'Cover and let steam for 5 min',
      'For sukuma wiki: fry onion, add tomatoes, then chopped kale',
      'Simmer for 10 min with salt',
      'Serve ugali with sukuma wiki on the side',
    ],
    whereToBuy: 'Markets: Gikomba (Nairobi). Stores: Naivas, Carrefour',
  },
  {
    id: 3,
    name: 'Avocado Toast with Poached Egg',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    calories: 380,
    time: '15 min',
    servings: 1,
    health: ['Healthy Fats', 'High Protein'],
    avoid: ['High Cholesterol - use egg white only'],
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '1 egg',
      'Lemon juice',
      'Chili flakes',
      'Salt & pepper',
    ],
    steps: [
      'Toast the bread until golden brown',
      'Mash avocado with lemon juice, salt and pepper',
      'Spread on toast',
      'Poach egg in simmering water for 3 minutes',
      'Place egg on top, sprinkle chili flakes',
    ],
    whereToBuy: 'Any grocery store: Walmart, Target, Whole Foods',
  },
  {
    id: 4,
    name: 'Vegetable Stir Fry',
    country: 'China',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    calories: 280,
    time: '20 min',
    servings: 2,
    health: ['Low Calorie', 'High Vitamins'],
    avoid: ['Ulcer - avoid too much soy sauce'],
    ingredients: [
      '2 cups mixed vegetables (broccoli, carrots, bell peppers)',
      '2 tbsp soy sauce',
      '1 tbsp sesame oil',
      '2 cloves garlic, minced',
      '1 tsp ginger, grated',
      'Rice or noodles',
    ],
    steps: [
      'Heat sesame oil in wok or large pan',
      'Add garlic and ginger, stir for 30 seconds',
      'Add vegetables, stir fry on high heat for 5-7 min',
      'Add soy sauce and toss',
      'Serve over rice or noodles',
    ],
    whereToBuy: 'Asian markets, Walmart, or local grocery stores',
  },
]

export default function FoodPage() {
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [healthIssue, setHealthIssue] = useState('')
  const [showAI, setShowAI] = useState(false)

  const filtered = recipes.filter((r: any) => {
    const matchCountry = selectedCountry === 'All' || r.country === selectedCountry
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
    return matchCountry && matchSearch
  })

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <Utensils size={32} /> Food & Recipes
        </h1>
        <p className="text-gray-600">Country-based recipes with health filters & step-by-step guides</p>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6 border border-pink-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-500" /> Health Concerns
        </h3>
        <p className="text-sm text-gray-600 mb-3">Tell us your health issues so we filter safe foods for you:</p>
        <div className="flex flex-wrap gap-2">
          {['Ulcer', 'Diabetes', 'High Blood Pressure', 'Chest Pain', 'Acid Reflux', 'None'].map((h: string) => (
            <button
              key={h}
              onClick={() => setHealthIssue(h)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                healthIssue === h ? 'pink-gradient text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <Globe size={18} className="text-pink-500 shrink-0" />
          {['All', ...countries.slice(0, 6)].map((c: string) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                selectedCountry === c ? 'pink-gradient text-white' : 'bg-white border border-pink-200 text-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((recipe: any) => (
          <div key={recipe.id} className="bg-white rounded-2xl overflow-hidden border border-pink-100 card-hover">
            <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-pink-600 bg-pink-50 px-3 py-1 rounded-full">{recipe.country}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">{recipe.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Flame size={14} className="text-orange-500" /> {recipe.calories} cal</span>
                <span className="flex items-center gap-1"><Users size={14} /> {recipe.servings} servings</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {recipe.health.map((h: string) => (
                  <span key={h} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">{h}</span>
                ))}
              </div>
              {healthIssue && recipe.avoid.some((a: string) => a.toLowerCase().includes(healthIssue.toLowerCase())) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle size={12} /> {recipe.avoid.find((a: string) => a.toLowerCase().includes(healthIssue.toLowerCase()))}
                  </p>
                </div>
              )}
              <button
                onClick={() => setSelectedRecipe(recipe)}
                className="w-full pink-gradient text-white py-2 rounded-xl text-sm font-semibold hover:opacity-90"
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedRecipe.name}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Globe size={14} /> {selectedRecipe.country}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {selectedRecipe.time}</span>
                <span className="flex items-center gap-1"><Flame size={14} /> {selectedRecipe.calories} cal</span>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <ChefHat size={18} className="text-pink-500" /> Ingredients
                </h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ing: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-pink-400 rounded-full" /> {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Step-by-Step Instructions</h3>
                <div className="space-y-3">
                  {selectedRecipe.steps.map((step: string, i: number) => (
                    <div key={i} className="flex gap-3">
                      <span className="w-8 h-8 shrink-0 pink-gradient text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-pink-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-pink-700 mb-1">Where to Find Ingredients</h4>
                <p className="text-sm text-gray-600">{selectedRecipe.whereToBuy}</p>
              </div>

              <button
                onClick={() => setShowAI(true)}
                className="w-full border-2 border-pink-200 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-50 mb-3"
              >
                Ask AI: How to get ingredients from scratch?
              </button>

              <button
                onClick={() => setSelectedRecipe(null)}
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
            <h3 className="font-bold text-gray-800 mb-3">AI Ingredient Guide</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you can't find {selectedRecipe?.ingredients[0]} in your country, here's how to make/get it from scratch:
            </p>
            <div className="bg-pink-50 rounded-xl p-4 text-sm text-gray-700 space-y-2">
              <p>1. Check local ethnic markets or online stores like Amazon, Jumia, or Konga</p>
              <p>2. Ask at restaurants serving {selectedRecipe?.country} food - they may sell ingredients</p>
              <p>3. Join Facebook groups for {selectedRecipe?.country} expats in your area</p>
              <p>4. Use substitutes: Research local alternatives with similar nutritional value</p>
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
