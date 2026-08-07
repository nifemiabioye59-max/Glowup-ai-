import Link from 'next/link'
import { Sparkles, Camera, Heart, Shirt, ShoppingBag, Calendar, Dumbbell, Star, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-glow-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-glow-400 to-lavender-500"><Sparkles className="h-4 w-4 text-white" /></div>
            <span className="text-lg font-bold text-gray-900">GLOWUP<span className="text-glow-500">.AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-glow-600">Sign in</Link>
            <Link href="/login" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-glow-200/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-lavender-200/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-glow-50 px-4 py-1.5 text-sm font-medium text-glow-700 ring-1 ring-glow-200 mb-8"><Star className="h-3.5 w-3.5 fill-glow-500" /> Now live in Nigeria</div>
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">Snap. Style. <span className="bg-gradient-to-r from-glow-500 to-lavender-500 bg-clip-text text-transparent">Glow.</span> Repeat.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">Your personal AI stylist, skin consultant, beauty advisor, and wellness coach. Built for melanin, African hair, and Nigerian budgets.</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="btn-primary gap-2 w-full sm:w-auto">Start Your Glow Up <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/login" className="btn-secondary w-full sm:w-auto">See How It Works</Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to glow</h2>
            <p className="mt-4 text-gray-600">AI-powered tools for your entire glow-up journey</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: Camera, title: 'Outfit Stylist', desc: 'Upload any outfit. Get styling tips and shop similar looks.' },
              { icon: Heart, title: 'Skin Analysis', desc: 'Know your skin type and get personalized routines.' },
              { icon: Shirt, title: 'Hair Advisor', desc: 'Face shape analysis + budget-based recommendations.' },
              { icon: ShoppingBag, title: 'Food Scanner', desc: 'Snap your meal. Get calories, macros, healthier swaps.' },
              { icon: ShoppingBag, title: 'Beauty Shop', desc: 'Buy skincare, hair, and wellness products.' },
              { icon: Calendar, title: 'Period Tracker', desc: 'Track your cycle and predict your next period.' },
              { icon: Dumbbell, title: 'Fitness Plans', desc: 'Get workout plans tailored to your goals.' },
              { icon: Star, title: 'AI Coach', desc: 'Chat with your personal beauty and wellness advisor.' },
            ].map((f) => (
              <div key={f.title} className="group relative rounded-3xl bg-gray-50 p-6 hover:bg-white hover:shadow-xl transition-all">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-glow-100 text-glow-600 mb-4"><f.icon className="h-5 w-5" /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-glow-50 to-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Invest in your glow</h2>
            <p className="mt-4 text-gray-600">Less than one bad wig purchase</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'GLOW Basic', price: '₦9,900', features: ['Unlimited style scans', 'Skin & hair analysis', 'Food scanner', 'Basic shop access'], popular: false },
              { name: 'GLOW Pro', price: '₦18,000', features: ['Everything in Basic', 'Period tracker', 'Workout plans', '10% shop discount', 'Priority support'], popular: true },
              { name: 'GLOW Elite', price: '₦35,000', features: ['Everything in Pro', 'Monthly video call', 'Personal shopper', 'VIP product drops', 'Priority delivery'], popular: false },
            ].map((plan) => (
              <div key={plan.name} className={`relative rounded-3xl p-8 ${plan.popular ? 'bg-gray-900 text-white shadow-2xl scale-105' : 'bg-white text-gray-900 shadow-lg'}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-glow-500 px-4 py-1 text-xs font-semibold text-white">Most Popular</div>}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-6 flex items-baseline gap-1"><span className="text-4xl font-bold">{plan.price}</span><span className="text-sm opacity-70">/month</span></div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((f) => <li key={f} className="flex items-start gap-3"><Star className={`h-5 w-5 shrink-0 ${plan.popular ? 'text-glow-400' : 'text-glow-500'}`} /><span className="text-sm">{f}</span></li>)}
                </ul>
                <Link href="/login" className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${plan.popular ? 'bg-glow-500 text-white hover:bg-glow-400' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>Choose {plan.name}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4"><Sparkles className="h-5 w-5 text-glow-500" /><span className="font-bold text-gray-900">GLOWUP.AI</span></div>
        <p className="text-sm text-gray-500">Built with love for African women everywhere.</p>
      </footer>
    </main>
  )
}
