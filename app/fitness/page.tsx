'use client'

import { useState, useEffect } from 'react'
import { Dumbbell, Clock, Flame, Trophy, Lock, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'

const fitnessPlan = {
  1: {
    title: 'Week 1 - Foundation',
    days: [
      {
        day: 1,
        title: 'Full Body Starter',
        exercises: [
          { name: 'Jumping Jacks', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=150&fit=crop' },
          { name: 'Bodyweight Squats', minutes: 4, rest: 45, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop' },
          { name: 'Push-ups (Knee if needed)', minutes: 3, rest: 45, image: 'https://images.unsplash.com/photo-1598971639058-9b196488868b?w=200&h=150&fit=crop' },
          { name: 'Plank Hold', minutes: 2, rest: 30, image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=200&h=150&fit=crop' },
          { name: 'Lunges', minutes: 3, rest: 45, image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=200&h=150&fit=crop' },
          { name: 'Glute Bridges', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=150&fit=crop' },
        ],
        focus: 'Full Body',
        calories: 250,
      },
      {
        day: 2,
        title: 'Flat Tummy Focus',
        exercises: [
          { name: 'Crunches', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=150&fit=crop' },
          { name: 'Leg Raises', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=150&fit=crop' },
          { name: 'Russian Twists', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=200&h=150&fit=crop' },
          { name: 'Mountain Climbers', minutes: 3, rest: 45, image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=200&h=150&fit=crop' },
          { name: 'Bicycle Crunches', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop' },
          { name: 'Plank with Hip Dips', minutes: 2, rest: 30, image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=200&h=150&fit=crop' },
        ],
        focus: 'Core & Abs',
        calories: 200,
      },
      {
        day: 3,
        title: 'Big Butt & Thighs',
        exercises: [
          { name: 'Sumo Squats', minutes: 4, rest: 45, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop' },
          { name: 'Donkey Kicks', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=150&fit=crop' },
          { name: 'Fire Hydrants', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=150&fit=crop' },
          { name: 'Step-ups', minutes: 3, rest: 45, image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=200&h=150&fit=crop' },
          { name: 'Side Lunges', minutes: 3, rest: 45, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop' },
          { name: 'Glute Kickbacks', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=150&fit=crop' },
        ],
        focus: 'Lower Body',
        calories: 280,
      },
      {
        day: 4,
        title: 'Active Recovery',
        exercises: [
          { name: 'Light Walking', minutes: 20, rest: 0, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&h=150&fit=crop' },
          { name: 'Stretching', minutes: 10, rest: 0, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop' },
        ],
        focus: 'Recovery',
        calories: 100,
      },
      {
        day: 5,
        title: 'Upper Body Tone',
        exercises: [
          { name: 'Arm Circles', minutes: 2, rest: 20, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=150&fit=crop' },
          { name: 'Tricep Dips', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1598971639058-9b196488868b?w=200&h=150&fit=crop' },
          { name: 'Wall Push-ups', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1598971639058-9b196488868b?w=200&h=150&fit=crop' },
          { name: 'Arm Raises', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=150&fit=crop' },
          { name: 'Shoulder Taps', minutes: 2, rest: 30, image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=200&h=150&fit=crop' },
        ],
        focus: 'Arms & Shoulders',
        calories: 180,
      },
      {
        day: 6,
        title: 'HIIT Cardio',
        exercises: [
          { name: 'High Knees', minutes: 3, rest: 60, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=150&fit=crop' },
          { name: 'Burpees', minutes: 2, rest: 60, image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=200&h=150&fit=crop' },
          { name: 'Jump Squats', minutes: 3, rest: 60, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop' },
          { name: 'Butt Kicks', minutes: 3, rest: 45, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=150&fit=crop' },
          { name: 'Skaters', minutes: 3, rest: 45, image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=200&h=150&fit=crop' },
        ],
        focus: 'Cardio & Fat Burn',
        calories: 350,
      },
      {
        day: 7,
        title: 'Rest & Reflect',
        exercises: [
          { name: 'Gentle Yoga', minutes: 15, rest: 0, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop' },
          { name: 'Meditation', minutes: 10, rest: 0, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=150&fit=crop' },
        ],
        focus: 'Mind & Body',
        calories: 50,
      },
    ],
  },
  2: {
    title: 'Week 2 - Building Strength',
    days: [
      { day: 8, title: 'Strength Builder', exercises: [{ name: 'Advanced Squats', minutes: 5, rest: 45, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop' }], focus: 'Strength', calories: 300 },
      { day: 9, title: 'Core Crusher', exercises: [{ name: 'V-Ups', minutes: 4, rest: 30, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=150&fit=crop' }], focus: 'Core', calories: 250 },
      { day: 10, title: 'Glute Focus', exercises: [{ name: 'Weighted Glute Bridges', minutes: 5, rest: 45, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=150&fit=crop' }], focus: 'Glutes', calories: 320 },
      { day: 11, title: 'Active Recovery', exercises: [{ name: 'Swimming or Walking', minutes: 25, rest: 0, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&h=150&fit=crop' }], focus: 'Recovery', calories: 120 },
      { day: 12, title: 'Total Body Burn', exercises: [{ name: 'Circuit Training', minutes: 30, rest: 60, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=150&fit=crop' }], focus: 'Full Body', calories: 400 },
      { day: 13, title: 'Arms & Back', exercises: [{ name: 'Superman Holds', minutes: 3, rest: 30, image: 'https://images.unsplash.com/photo-1598971639058-9b196488868b?w=200&h=150&fit=crop' }], focus: 'Back', calories: 200 },
      { day: 14, title: 'Rest Day', exercises: [{ name: 'Stretch & Foam Roll', minutes: 20, rest: 0, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop' }], focus: 'Recovery', calories: 60 },
    ],
  },
  3: {
    title: 'Week 3 - Power Phase',
    days: [
      { day: 15, title: 'Power Legs', exercises: [{ name: 'Jump Lunges', minutes: 4, rest: 60, image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=200&h=150&fit=crop' }], focus: 'Legs', calories: 350 },
      { day: 16, title: 'Abs Definition', exercises: [{ name: 'Hanging Leg Raises', minutes: 4, rest: 45, image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=150&fit=crop' }], focus: 'Abs', calories: 280 },
      { day: 17, title: 'Booty Builder', exercises: [{ name: 'Bulgarian Split Squats', minutes: 5, rest: 60, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop' }], focus: 'Glutes', calories: 380 },
      { day: 18, title: 'Recovery', exercises: [{ name: 'Pilates', minutes: 30, rest: 0, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop' }], focus: 'Flexibility', calories: 150 },
      { day: 19, title: 'Cardio Blast', exercises: [{ name: 'Sprint Intervals', minutes: 20, rest: 90, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=150&fit=crop' }], focus: 'Cardio', calories: 450 },
      { day: 20, title: 'Upper Power', exercises: [{ name: 'Push-up Variations', minutes: 5, rest: 45, image: 'https://images.unsplash.com/photo-1598971639058-9b196488868b?w=200&h=150&fit=crop' }], focus: 'Upper Body', calories: 250 },
      { day: 21, title: 'Final Rest', exercises: [{ name: 'Full Body Stretch', minutes: 25, rest: 0, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=150&fit=crop' }], focus: 'Recovery', calories: 70 },
    ],
  },
}

export default function FitnessPage() {
  const [currentWeek, setCurrentWeek] = useState(1)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [currentWeight, setCurrentWeight] = useState('')
  const [showWeekComplete, setShowWeekComplete] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [fitnessDays, setFitnessDays] = useState(0)
  const [loginStreak, setLoginStreak] = useState(0)

  useEffect(() => {
    setCompletedDays(JSON.parse(localStorage.getItem('completedDays') || '[]'))
    setSubscribed(localStorage.getItem('subscribed') === 'true')
    setFitnessDays(Number(localStorage.getItem('fitnessDays') || '0'))
    setLoginStreak(Number(localStorage.getItem('loginStreak') || '0'))
  }, [])

  const weekData = fitnessPlan[currentWeek as keyof typeof fitnessPlan]
  const weekCompleted = weekData.days.every(d => completedDays.includes(d.day))
  const prevWeekCompleted = currentWeek === 1 || fitnessPlan[(currentWeek - 1) as keyof typeof fitnessPlan]?.days.every(d => completedDays.includes(d.day))

  const completeDay = (day: number) => {
    if (!subscribed && fitnessDays >= 3) {
      alert('Subscribe to Premium to continue your fitness journey!')
      return
    }
    const newCompleted = [...completedDays, day]
    setCompletedDays(newCompleted)
    localStorage.setItem('completedDays', JSON.stringify(newCompleted))
    
    const newDays = fitnessDays + 1
    setFitnessDays(newDays)
    localStorage.setItem('fitnessDays', String(newDays))
    
    const newStreak = loginStreak + 1
    setLoginStreak(newStreak)
    localStorage.setItem('loginStreak', String(newStreak))

    const dayData = weekData.days.find(d => d.day === day)
    if (dayData && day === weekData.days[weekData.days.length - 1].day) {
      setShowWeekComplete(true)
    }
  }

  const handleWeekComplete = () => {
    setShowWeekComplete(false)
    setCurrentWeight('')
  }

  if (!subscribed && fitnessDays >= 3) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Lock size={64} className="mx-auto text-pink-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Free Trial Ended</h2>
        <p className="text-gray-600 mb-8">You've completed 3 days of fitness training. Subscribe to Premium to unlock the full 3-month program!</p>
        <button className="pink-gradient text-white px-8 py-3 rounded-full font-semibold">
          Upgrade to Premium - ₦5,000/month
        </button>
        <p className="mt-4 text-sm text-gray-500">Includes: Full 3-month plan, AI coaching, progress tracking & more</p>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <Dumbbell size={32} /> 3-Month Fitness Plan
        </h1>
        <p className="text-gray-600">Transform your body with guided workouts, pictures & rest timers</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 text-center border border-pink-100">
          <p className="text-2xl font-bold text-pink-600">{loginStreak}</p>
          <p className="text-xs text-gray-600">Day Streak</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-pink-100">
          <p className="text-2xl font-bold text-orange-600">{completedDays.length}</p>
          <p className="text-xs text-gray-600">Workouts Done</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-pink-100">
          <p className="text-2xl font-bold text-green-600">{currentWeek}/12</p>
          <p className="text-xs text-gray-600">Week Progress</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-8 border border-pink-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Flame size={20} className="text-orange-500" /> Health Calculator
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input type="number" placeholder="Weight (kg)" className="p-3 border rounded-xl text-sm" />
          <input type="number" placeholder="Height (cm)" className="p-3 border rounded-xl text-sm" />
          <input type="number" placeholder="Sugar Level" className="p-3 border rounded-xl text-sm" />
          <input type="number" placeholder="Age (years)" className="p-3 border rounded-xl text-sm" />
        </div>
        <button className="mt-4 w-full md:w-auto pink-gradient text-white px-6 py-2 rounded-xl text-sm font-semibold">
          Calculate BMI & Health Score
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-pink-50"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">{weekData.title}</h2>
        <button
          onClick={() => {
            if (!prevWeekCompleted && currentWeek > 1) {
              alert('Complete Week ' + (currentWeek - 1) + ' first!')
              return
            }
            setCurrentWeek(Math.min(3, currentWeek + 1))
          }}
          className="p-2 rounded-lg bg-white border border-pink-200 hover:bg-pink-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {weekData.days.map((day) => {
          const isCompleted = completedDays.includes(day.day)
          const isLocked = currentWeek > 1 && !prevWeekCompleted && !isCompleted

          return (
            <div key={day.day} className={`bg-white rounded-2xl p-6 border ${isCompleted ? 'border-green-200 bg-green-50' : 'border-pink-100'} card-hover`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {isCompleted ? <CheckCircle size={24} className="text-green-500" /> : <Dumbbell size={24} className="text-pink-500" />}
                  <div>
                    <h3 className="font-bold text-gray-800">Day {day.day} - {day.title}</h3>
                    <p className="text-sm text-gray-500">{day.focus} • {day.calories} cal</p>
                  </div>
                </div>
                {isLocked ? (
                  <Lock size={20} className="text-gray-400" />
                ) : (
                  <button
                    onClick={() => completeDay(day.day)}
                    disabled={isCompleted}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'pink-gradient text-white hover:opacity-90'
                    }`}
                  >
                    {isCompleted ? 'Done' : 'Complete'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {day.exercises.map((ex, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <img src={ex.image} alt={ex.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                    <p className="font-medium text-sm text-gray-800">{ex.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Clock size={12} /> {ex.minutes} min
                      {ex.rest > 0 && <span>• Rest {ex.rest}s</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {showWeekComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <Trophy size={64} className="mx-auto text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Week {currentWeek} Complete!</h3>
            <p className="text-gray-600 mb-4">Amazing work! How do you feel?</p>
            <div className="flex gap-2 justify-center mb-4">
              {['Great!', 'Tired', 'Stronger'].map(f => (
                <button key={f} className="px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                  {f}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-2">What's your current weight? (kg)</p>
            <input
              type="number"
              className="w-full p-3 border rounded-xl mb-4 text-center"
              placeholder="e.g. 65"
              value={currentWeight}
              onChange={e => setCurrentWeight(e.target.value)}
            />
            <button
              onClick={handleWeekComplete}
              className="w-full pink-gradient text-white py-3 rounded-xl font-semibold"
            >
              Continue to Week {currentWeek + 1}
            </button>
          </div>
        </div>
      )}
    </main>
  )
      }
    
