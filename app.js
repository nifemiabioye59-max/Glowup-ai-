// ===== GLOW UP AI - COMPLETE APP =====
// Supabase Configuration - REPLACE WITH YOURS
const SUPABASE_URL = 'https://heycetkerfqyskkmmwafa.supabase.co
  ';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleWNldGtlcmZxeXNra213YWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTU1MDcsImV4cCI6MjEwMTMzMTUwN30.-IQLcezimH4ohoKW62mIWLXs7kQG4rC4SlwH6tiSIek';

// Paystack Configuration - REPLACE WITH YOURS
const PAYSTACK_PUBLIC_KEY = 'pk_test_e3447d249720f1f9ddad59b85e311d3c0c60dd8b';

// Initialize Supabase (fallback to localStorage if not configured)
let supabase = null;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch(e) {
    console.log('Supabase not configured, using localStorage mode');
}

// ===== STATE =====
let currentUser = JSON.parse(localStorage.getItem('glowup_user')) || null;
let userProfile = JSON.parse(localStorage.getItem('glowup_profile')) || {};
let fitnessProgress = JSON.parse(localStorage.getItem('glowup_fitness')) || {};
let mealStatus = JSON.parse(localStorage.getItem('glowup_meals')) || { breakfast: false, lunch: false, dinner: false };
let periodData = JSON.parse(localStorage.getItem('glowup_period')) || {};
let periodScansUsed = parseInt(localStorage.getItem('glowup_period_scans')) || 0;
let fitnessDaysUsed = parseInt(localStorage.getItem('glowup_fitness_days')) || 0;
let isPremium = localStorage.getItem('glowup_premium') === 'true';
let loginStreak = parseInt(localStorage.getItem('glowup_streak')) || 0;
let lastLoginDate = localStorage.getItem('glowup_last_login');
let currentSection = 'home';
let currentFitnessGoal = 'full-body';
let selectedGoals = [];
let workoutFeel = '';
let currentProduct = null;
let currentFood = null;
let currentHair = null;
let adminAuthenticated = false;

// ===== PRODUCTS DATA =====
let products = JSON.parse(localStorage.getItem('glowup_products')) || [
    { id: 1, name: 'Glow Skin Serum', price: 8500, category: 'skincare', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop', desc: 'Vitamin C brightening serum for glowing skin', seller: 'Glow Beauty', approved: true },
    { id: 2, name: 'Hair Growth Oil', price: 6000, category: 'haircare', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop', desc: 'Natural oils for faster hair growth', seller: 'Hair Magic', approved: true },
    { id: 3, name: 'Butt Enhancement Cream', price: 12000, category: 'body', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop', desc: 'Firming cream for a lifted look', seller: 'Body Goals', approved: true },
    { id: 4, name: 'Waist Trainer', price: 15000, category: 'body', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&h=300&fit=crop', desc: 'Latex waist trainer for flat tummy', seller: 'Shape Up', approved: true },
    { id: 5, name: 'Collagen Supplements', price: 18000, category: 'supplements', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop', desc: 'Marine collagen for skin elasticity', seller: 'Wellness Co', approved: true },
    { id: 6, name: 'Matte Lipstick Set', price: 4500, category: 'makeup', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop', desc: 'Long-lasting matte lipstick collection', seller: 'Beauty Bar', approved: true }
];

// ===== FITNESS PROGRAM DATA (3 MONTHS) =====
const fitnessPrograms = {
    'flat-tummy': {
        name: 'Flat Tummy Challenge',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
        weeks: generateFitnessWeeks('flat-tummy')
    },
    'big-butt': {
        name: 'Big Butt Builder',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
        weeks: generateFitnessWeeks('big-butt')
    },
    'weight-gain': {
        name: 'Healthy Weight Gain',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&h=300&fit=crop',
        weeks: generateFitnessWeeks('weight-gain')
    },
    'full-body': {
        name: 'Full Body Glow',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
        weeks: generateFitnessWeeks('full-body')
    }
};

function generateFitnessWeeks(goal) {
    const weeks = [];
    const exerciseImages = {
        'crunches': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
        'plank': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=200&h=200&fit=crop',
        'squats': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop',
        'lunges': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
        'jumping-jacks': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop',
        'pushups': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        'burpees': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
        'leg-raises': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
        'glute-bridge': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
        'donkey-kicks': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop',
        'fire-hydrant': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop',
        'russian-twist': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
        'bicycle-crunch': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=200&h=200&fit=crop',
        'mountain-climber': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
        'high-knees': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        'side-plank': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=200&h=200&fit=crop',
        'flutter-kicks': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
        'deadlift': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
        'hip-thrust': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
        'sumo-squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop'
    };

    const plans = {
        'flat-tummy': [
            // Week 1 - Foundation
            [
                { day: 1, exercises: [
                    { name: 'Jumping Jacks', duration: 2, rest: 1, image: exerciseImages['jumping-jacks'] },
                    { name: 'Crunches', duration: 3, rest: 1, image: exerciseImages['crunches'] },
                    { name: 'Plank', duration: 2, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Leg Raises', duration: 2, rest: 1, image: exerciseImages['leg-raises'] },
                    { name: 'Russian Twist', duration: 2, rest: 1, image: exerciseImages['russian-twist'] }
                ]},
                { day: 2, exercises: [
                    { name: 'High Knees', duration: 2, rest: 1, image: exerciseImages['high-knees'] },
                    { name: 'Bicycle Crunch', duration: 3, rest: 1, image: exerciseImages['bicycle-crunch'] },
                    { name: 'Side Plank', duration: 2, rest: 1, image: exerciseImages['side-plank'] },
                    { name: 'Flutter Kicks', duration: 2, rest: 1, image: exerciseImages['flutter-kicks'] },
                    { name: 'Mountain Climber', duration: 2, rest: 1, image: exerciseImages['mountain-climber'] }
                ]},
                { day: 3, exercises: [
                    { name: 'Jumping Jacks', duration: 3, rest: 1, image: exerciseImages['jumping-jacks'] },
                    { name: 'Crunches', duration: 3, rest: 1, image: exerciseImages['crunches'] },
                    { name: 'Plank', duration: 3, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Leg Raises', duration: 3, rest: 1, image: exerciseImages['leg-raises'] },
                    { name: 'Russian Twist', duration: 3, rest: 1, image: exerciseImages['russian-twist'] }
                ]},
                { day: 4, rest: true, message: 'Rest Day! 💆‍♀️ Take a warm bath, stretch gently, and drink lots of water!' },
                { day: 5, exercises: [
                    { name: 'Burpees', duration: 2, rest: 1, image: exerciseImages['burpees'] },
                    { name: 'Bicycle Crunch', duration: 3, rest: 1, image: exerciseImages['bicycle-crunch'] },
                    { name: 'Side Plank', duration: 3, rest: 1, image: exerciseImages['side-plank'] },
                    { name: 'Flutter Kicks', duration: 3, rest: 1, image: exerciseImages['flutter-kicks'] },
                    { name: 'High Knees', duration: 3, rest: 1, image: exerciseImages['high-knees'] }
                ]},
                { day: 6, exercises: [
                    { name: 'Mountain Climber', duration: 3, rest: 1, image: exerciseImages['mountain-climber'] },
                    { name: 'Crunches', duration: 4, rest: 1, image: exerciseImages['crunches'] },
                    { name: 'Plank', duration: 3, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Leg Raises', duration: 3, rest: 1, image: exerciseImages['leg-raises'] },
                    { name: 'Russian Twist', duration: 3, rest: 1, image: exerciseImages['russian-twist'] }
                ]},
                { day: 7, rest: true, message: 'Sunday Rest! 🌸 You did amazing this week! Reflect on how you feel.' }
            ],
            // Week 2 - Building
            [
                { day: 1, exercises: [
                    { name: 'Jumping Jacks', duration: 3, rest: 1, image: exerciseImages['jumping-jacks'] },
                    { name: 'Crunches', duration: 4, rest: 1, image: exerciseImages['crunches'] },
                    { name: 'Plank', duration: 3, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Leg Raises', duration: 3, rest: 1, image: exerciseImages['leg-raises'] },
                    { name: 'Russian Twist', duration: 3, rest: 1, image: exerciseImages['russian-twist'] },
                    { name: 'Bicycle Crunch', duration: 3, rest: 1, image: exerciseImages['bicycle-crunch'] }
                ]},
                { day: 2, exercises: [
                    { name: 'High Knees', duration: 3, rest: 1, image: exerciseImages['high-knees'] },
                    { name: 'Side Plank', duration: 3, rest: 1, image: exerciseImages['side-plank'] },
                    { name: 'Flutter Kicks', duration: 3, rest: 1, image: exerciseImages['flutter-kicks'] },
                    { name: 'Mountain Climber', duration: 3, rest: 1, image: exerciseImages['mountain-climber'] },
                    { name: 'Burpees', duration: 2, rest: 1, image: exerciseImages['burpees'] },
                    { name: 'Plank', duration: 3, rest: 1, image: exerciseImages['plank'] }
                ]},
                { day: 3, exercises: [
                    { name: 'Jumping Jacks', duration: 3, rest: 1, image: exerciseImages['jumping-jacks'] },
                    { name: 'Crunches', duration: 4, rest: 1, image: exerciseImages['crunches'] },
                    { name: 'Leg Raises', duration: 4, rest: 1, image: exerciseImages['leg-raises'] },
                    { name: 'Russian Twist', duration: 4, rest: 1, image: exerciseImages['russian-twist'] },
                    { name: 'Bicycle Crunch', duration: 4, rest: 1, image: exerciseImages['bicycle-crunch'] }
                ]},
                { day: 4, rest: true, message: 'Rest Day! 🧘‍♀️ Do some light yoga stretches. Your body is getting stronger!' },
                { day: 5, exercises: [
                    { name: 'Burpees', duration: 3, rest: 1, image: exerciseImages['burpees'] },
                    { name: 'Side Plank', duration: 4, rest: 1, image: exerciseImages['side-plank'] },
                    { name: 'Flutter Kicks', duration: 4, rest: 1, image: exerciseImages['flutter-kicks'] },
                    { name: 'High Knees', duration: 4, rest: 1, image: exerciseImages['high-knees'] },
                    { name: 'Mountain Climber', duration: 4, rest: 1, image: exerciseImages['mountain-climber'] }
                ]},
                { day: 6, exercises: [
                    { name: 'Crunches', duration: 5, rest: 1, image: exerciseImages['crunches'] },
                    { name: 'Plank', duration: 4, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Leg Raises', duration: 4, rest: 1, image: exerciseImages['leg-raises'] },
                    { name: 'Russian Twist', duration: 4, rest: 1, image: exerciseImages['russian-twist'] },
                    { name: 'Bicycle Crunch', duration: 4, rest: 1, image: exerciseImages['bicycle-crunch'] },
                    { name: 'Flutter Kicks', duration: 3, rest: 1, image: exerciseImages['flutter-kicks'] }
                ]},
                { day: 7, rest: true, message: 'Sunday Rest! 🎉 Week 2 complete! Your core is getting stronger!' }
            ]
        ],
        'big-butt': [
            // Week 1
            [
                { day: 1, exercises: [
                    { name: 'Squats', duration: 3, rest: 1, image: exerciseImages['squats'] },
                    { name: 'Glute Bridge', duration: 3, rest: 1, image: exerciseImages['glute-bridge'] },
                    { name: 'Donkey Kicks', duration: 2, rest: 1, image: exerciseImages['donkey-kicks'] },
                    { name: 'Lunges', duration: 3, rest: 1, image: exerciseImages['lunges'] },
                    { name: 'Fire Hydrant', duration: 2, rest: 1, image: exerciseImages['fire-hydrant'] }
                ]},
                { day: 2, exercises: [
                    { name: 'Jumping Jacks', duration: 2, rest: 1, image: exerciseImages['jumping-jacks'] },
                    { name: 'Squats', duration: 3, rest: 1, image: exerciseImages['squats'] },
                    { name: 'Glute Bridge', duration: 3, rest: 1, image: exerciseImages['glute-bridge'] },
                    { name: 'Donkey Kicks', duration: 3, rest: 1, image: exerciseImages['donkey-kicks'] },
                    { name: 'Lunges', duration: 3, rest: 1, image: exerciseImages['lunges'] }
                ]},
                { day: 3, exercises: [
                    { name: 'Sumo Squat', duration: 3, rest: 1, image: exerciseImages['sumo-squat'] },
                    { name: 'Hip Thrust', duration: 3, rest: 1, image: exerciseImages['hip-thrust'] },
                    { name: 'Fire Hydrant', duration: 3, rest: rust'] },
                    { name: 'Fire Hydrant', duration: 3, rest: 1, image: exerciseImages['fire-hydrant'] },
                    { name: 'Glute Bridge', duration: 3, rest: 1, image: exerciseImages['glute-bridge'] },
                    { name: 'Donkey Kicks', duration: 3, rest: 1, image: exerciseImages['donkey-kicks'] }
                ]},
                { day: 4, rest: true, message: 'Rest Day! 💆‍♀️ Massage your glutes and stretch your hips!' },
                { day: 5, exercises: [
                    { name: 'Squats', duration: 4, rest: 1, image: exerciseImages['squats'] },
                    { name: 'Lunges', duration: 4, rest: 1, image: exerciseImages['lunges'] },
                    { name: 'Glute Bridge', duration: 4, rest: 1, image: exerciseImages['glute-bridge'] },
                    { name: 'Hip Thrust', duration: 3, rest: 1, image: exerciseImages['hip-thrust'] },
                    { name: 'Fire Hydrant', duration: 3, rest: 1, image: exerciseImages['fire-hydrant'] }
                ]},
                { day: 6, exercises: [
                    { name: 'Sumo Squat', duration: 4, rest: 1, image: exerciseImages['sumo-squat'] },
                    { name: 'Donkey Kicks', duration: 4, rest: 1, image: exerciseImages['donkey-kicks'] },
                    { name: 'Glute Bridge', duration: 4, rest: 1, image: exerciseImages['glute-bridge'] },
                    { name: 'Lunges', duration: 4, rest: 1, image: exerciseImages['lunges'] },
                    { name: 'Hip Thrust', duration: 3, rest: 1, image: exerciseImages['hip-thrust'] }
                ]},
                { day: 7, rest: true, message: 'Sunday Rest! 🍑 Your glutes are growing! Keep it up!' }
            ]
        ],
        'weight-gain': [
            // Week 1
            [
                { day: 1, exercises: [
                    { name: 'Push-ups', duration: 3, rest: 2, image: exerciseImages['pushups'] },
                    { name: 'Squats', duration: 3, rest: 2, image: exerciseImages['squats'] },
                    { name: 'Lunges', duration: 3, rest: 2, image: exerciseImages['lunges'] },
                    { name: 'Plank', duration: 2, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Glute Bridge', duration: 3, rest: 2, image: exerciseImages['glute-bridge'] }
                ]},
                { day: 2, exercises: [
                    { name: 'Burpees', duration: 2, rest: 2, image: exerciseImages['burpees'] },
                    { name: 'Push-ups', duration: 3, rest: 2, image: exerciseImages['pushups'] },
                    { name: 'Squats', duration: 3, rest: 2, image: exerciseImages['squats'] },
                    { name: 'Mountain Climber', duration: 2, rest: 1, image: exerciseImages['mountain-climber'] },
                    { name: 'Lunges', duration: 3, rest: 2, image: exerciseImages['lunges'] }
                ]},
                { day: 3, exercises: [
                    { name: 'Deadlift (no weight)', duration: 3, rest: 2, image: exerciseImages['deadlift'] },
                    { name: 'Push-ups', duration: 4, rest: 2, image: exerciseImages['pushups'] },
                    { name: 'Squats', duration: 4, rest: 2, image: exerciseImages['squats'] },
                    { name: 'Plank', duration: 3, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Glute Bridge', duration: 3, rest: 2, image: exerciseImages['glute-bridge'] }
                ]},
                { day: 4, rest: true, message: 'Rest Day! 🥗 Eat protein-rich foods today - eggs, beans, chicken!' },
                { day: 5, exercises: [
                    { name: 'Burpees', duration: 3, rest: 2, image: exerciseImages['burpees'] },
                    { name: 'Push-ups', duration: 4, rest: 2, image: exerciseImages['pushups'] },
                    { name: 'Squats', duration: 4, rest: 2, image: exerciseImages['squats'] },
                    { name: 'Lunges', duration: 4, rest: 2, image: exerciseImages['lunges'] },
                    { name: 'Deadlift', duration: 3, rest: 2, image: exerciseImages['deadlift'] }
                ]},
                { day: 6, exercises: [
                    { name: 'Push-ups', duration: 5, rest: 2, image: exerciseImages['pushups'] },
                    { name: 'Squats', duration: 5, rest: 2, image: exerciseImages['squats'] },
                    { name: 'Glute Bridge', duration: 4, rest: 2, image: exerciseImages['glute-bridge'] },
                    { name: 'Plank', duration: 4, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Lunges', duration: 4, rest: 2, image: exerciseImages['lunges'] }
                ]},
                { day: 7, rest: true, message: 'Sunday Rest! 💪 You are building strength! Eat well and sleep 8 hours!' }
            ]
        ],
        'full-body': [
            // Week 1
            [
                { day: 1, exercises: [
                    { name: 'Jumping Jacks', duration: 2, rest: 1, image: exerciseImages['jumping-jacks'] },
                    { name: 'Push-ups', duration: 2, rest: 1, image: exerciseImages['pushups'] },
                    { name: 'Squats', duration: 3, rest: 1, image: exerciseImages['squats'] },
                    { name: 'Plank', duration: 2, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Lunges', duration: 2, rest: 1, image: exerciseImages['lunges'] }
                ]},
                { day: 2, exercises: [
                    { name: 'High Knees', duration: 2, rest: 1, image: exerciseImages['high-knees'] },
                    { name: 'Crunches', duration: 3, rest: 1, image: exerciseImages['crunches'] },
                    { name: 'Glute Bridge', duration: 3, rest: 1, image: exerciseImages['glute-bridge'] },
                    { name: 'Mountain Climber', duration: 2, rest: 1, image: exerciseImages['mountain-climber'] },
                    { name: 'Side Plank', duration: 2, rest: 1, image: exerciseImages['side-plank'] }
                ]},
                { day: 3, exercises: [
                    { name: 'Burpees', duration: 2, rest: 1, image: exerciseImages['burpees'] },
                    { name: 'Push-ups', duration: 3, rest: 1, image: exerciseImages['pushups'] },
                    { name: 'Squats', duration: 3, rest: 1, image: exerciseImages['squats'] },
                    { name: 'Leg Raises', duration: 2, rest: 1, image: exerciseImages['leg-raises'] },
                    { name: 'Donkey Kicks', duration: 2, rest: 1, image: exerciseImages['donkey-kicks'] }
                ]},
                { day: 4, rest: true, message: 'Rest Day! 🧘‍♀️ Stretch your whole body and drink green tea!' },
                { day: 5, exercises: [
                    { name: 'Jumping Jacks', duration: 3, rest: 1, image: exerciseImages['jumping-jacks'] },
                    { name: 'Crunches', duration: 3, rest: 1, image: exerciseImages['crunches'] },
                    { name: 'Lunges', duration: 3, rest: 1, image: exerciseImages['lunges'] },
                    { name: 'Plank', duration: 3, rest: 1, image: exerciseImages['plank'] },
                    { name: 'Flutter Kicks', duration: 2, rest: 1, image: exerciseImages['flutter-kicks'] }
                ]},
                { day: 6, exercises: [
                    { name: 'High Knees', duration: 3, rest: 1, image: exerciseImages['high-knees'] },
                    { name: 'Push-ups', duration: 3, rest: 1, image: exerciseImages['pushups'] },
                    { name: 'Glute Bridge', duration: 3, rest: 1, image: exerciseImages['glute-bridge'] },
                    { name: 'Russian Twist', duration: 3, rest: 1, image: exerciseImages['russian-twist'] },
                    { name: 'Fire Hydrant', duration: 2, rest: 1, image: exerciseImages['fire-hydrant'] }
                ]},
                { day: 7, rest: true, message: 'Sunday Rest! 🌟 You are glowing from the inside out!' }
            ]
        ]
    };

    // Generate weeks 3-12 by repeating and intensifying patterns
    const baseWeeks = plans[goal] || plans['full-body'];
    for (let w = 0; w < 12; w++) {
        if (w < baseWeeks.length) {
            weeks.push(baseWeeks[w]);
        } else {
            // Clone and intensify last available week
            const sourceWeek = baseWeeks[baseWeeks.length - 1];
            const newWeek = sourceWeek.map(day => {
                if (day.rest) return { ...day, message: day.message.replace(/Week \\d+/, 'Week ' + (w + 1)) };
                return {
                    ...day,
                    exercises: day.exercises.map(ex => ({
                        ...ex,
                        duration: Math.min(ex.duration + 1, 8),
                        rest: Math.max(ex.rest - 0, 1)
                    }))
                };
            });
            weeks.push(newWeek);
        }
    }
    return weeks;
}

// ===== FOOD/RECIPE DATA =====
const recipes = [
    {
        id: 1, name: 'Jollof Rice', country: 'nigeria',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop',
        time: '45 min', calories: '450 kcal',
        health: ['ulcer-safe', 'weight-gain'],
        ingredients: ['2 cups rice', 'Tomato paste', 'Onions', 'Pepper', 'Vegetable oil', 'Chicken stock', 'Thyme', 'Curry', 'Salt'],
        steps: [
            'Blend tomatoes, peppers, and onions into a smooth paste',
            'Heat oil and fry the paste for 10 minutes until thick',
            'Add chicken stock, thyme, curry, and salt',
            'Wash rice and add to the pot',
            'Cook on low heat for 25-30 minutes until soft'
        ],
        healthBenefits: 'Rich in carbs for energy. Use less pepper if you have ulcer. Great for weight gain when paired with protein.',
        ingredientSources: {
            'nigeria': 'Local markets: Mile 12 (Lagos), Ogbete (Enugu). Supermarkets: Shoprite, Spar.',
            'ghana': 'Makola Market (Accra), A&C Mall. Supermarkets: Melcom, Shoprite.',
            'usa': 'Walmart, Target, African stores in Houston/Atlanta. Try "African Food Market" apps.',
            'uk': 'Peckham (London), African Caribbean shops. Online: Afrocenchix, Oja.',
            'canada': 'Scarborough (Toronto), African stores in Calgary. Online: Afrikmart.',
            'default': 'Check local African/Caribbean grocery stores or order online from ethnic food retailers.'
        }
    },
    {
        id: 2, name: 'Egusi Soup', country: 'nigeria',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
        time: '60 min', calories: '380 kcal',
        health: ['weight-gain', 'diabetes-friendly'],
        ingredients: ['Ground egusi', 'Palm oil', 'Spinach/ugu', 'Stock fish', 'Crayfish', 'Pepper', 'Onions', 'Seasoning'],
        steps: [
            'Fry ground egusi in palm oil until it forms lumps',
            'Add stock fish, crayfish, and seasoning',
            'Pour in meat stock and let it boil',
            'Add chopped vegetables and simmer for 10 minutes',
            'Serve with pounded yam or eba'
        ],
        healthBenefits: 'High in protein and healthy fats. Good for weight gain. Low glycemic index makes it diabetes-friendly.',
        ingredientSources: {
            'nigeria': 'Any local market. Egusi is sold in bags or already ground.',
            'ghana': 'Agbogbloshie Market, Kaneshie Market.',
            'usa': 'African stores in Brooklyn, Houston. Online: Amazon (African section).',
            'uk': 'Brixton Market, Dalston. Online: Oja, Market Porter.',
            'default': 'Search for "African food store near me" or buy egusi powder online.'
        }
    },
    {
        id: 3, name: 'Banku & Tilapia', country: 'ghana',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
        time: '50 min', calories: '520 kcal',
        health: ['ulcer-safe', 'weight-gain'],
        ingredients: ['Corn dough', 'Cassava dough', 'Fresh tilapia', 'Tomatoes', 'Onions', 'Pepper', 'Vegetable oil', 'Ginger'],
        steps: [
            'Mix corn and cassava dough with water to form a smooth paste',
            'Cook in a pot, stirring continuously until thick (banku)',
            'Season tilapia with ginger, garlic, and spices',
            'Grill or fry the tilapia until golden',
            'Blend pepper, tomatoes, and onions for the sauce',
            'Serve banku with tilapia and pepper sauce'
        ],
        healthBenefits: 'Banku provides complex carbs. Fish gives omega-3. Mild pepper makes it ulcer-safe.',
        ingredientSources: {
            'ghana': 'Makola Market for dough, any fish market for tilapia.',
            'nigeria': 'African stores in Lagos, Abuja. Cassava dough may be labeled "fufu flour".',
            'usa': 'Ghanaian stores in Bronx, DC. Online: Afrobuy.',
            'default': 'Corn dough can be made by fermenting corn flour. Cassava dough = fufu flour.'
        }
    },
    {
        id: 4, name: 'Avocado Toast', country: 'usa',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
        time: '10 min', calories: '320 kcal',
        health: ['weight-gain', 'heart-healthy'],
        ingredients: ['Ripe avocado', 'Whole grain bread', 'Lemon juice', 'Salt', 'Pepper', 'Olive oil', 'Optional: egg, tomatoes'],
        steps: [
            'Toast the bread until golden and crispy',
            'Mash avocado with lemon juice, salt, and pepper',
            'Spread generously on the toast',
            'Drizzle with olive oil',
            'Top with poached egg or sliced tomatoes if desired'
        ],
        healthBenefits: 'Healthy fats from avocado. Whole grains for fiber. Heart-healthy and great for weight gain.',
        ingredientSources: {
            'nigeria': 'Shoprite, Spar, or local supermarkets. Avocados are seasonal.',
            'ghana': 'Melcom, Shoprite, or fruit vendors.',
            'usa': 'Any grocery store: Walmart, Whole Foods, Trader Joe\'s.',
            'uk': 'Tesco, Sainsbury\'s, Marks & Spencer.',
            'default': 'Available in most supermarkets worldwide.'
        }
    },
    {
        id: 5, name: 'Pasta Carbonara', country: 'italy',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
        time: '25 min', calories: '580 kcal',
        health: ['weight-gain', 'ulcer-safe'],
        ingredients: ['Spaghetti', 'Eggs', 'Parmesan cheese', 'Bacon/pancetta', 'Black pepper', 'Garlic', 'Olive oil'],
        steps: [
            'Boil spaghetti in salted water until al dente',
            'Fry bacon/pancetta until crispy, add minced garlic',
            'Whisk eggs with grated parmesan and black pepper',
            'Drain pasta (save some water) and add to the pan',
            'Remove from heat and quickly mix in the egg mixture',
            'The residual heat cooks the eggs into a creamy sauce'
        ],
        healthBenefits: 'High calorie for weight gain. No acidic tomatoes so ulcer-safe. Protein from eggs and bacon.',
        ingredientSources: {
            'nigeria': 'Shoprite, Spar. Parmesan may be found in the cheese section.',
            'ghana': 'Melcom, Game. Pancetta can be replaced with local bacon.',
            'usa': 'Any grocery store. Whole Foods for authentic pancetta.',
            'italy': 'Any supermarket or deli. Parmigiano-Reggiano is the authentic choice.',
            'default': 'Pancetta can be substituted with bacon. Parmesan is available in most supermarkets.'
        }
    },
    {
        id: 6, name: 'Chicken Tikka Masala', country: 'india',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        time: '50 min', calories: '480 kcal',
        health: ['weight-gain', 'heart-healthy'],
        ingredients: ['Chicken breast', 'Yogurt', 'Tomato puree', 'Cream', 'Garam masala', 'Turmeric', 'Ginger', 'Garlic', 'Naan bread'],
        steps: [
            'Marinate chicken in yogurt and spices for 30 minutes',
            'Grill or pan-fry the chicken until cooked',
            'In a pan, cook tomato puree with spices and cream',
            'Add the cooked chicken to the sauce and simmer',
            'Serve hot with naan bread or rice'
        ],
        healthBenefits: 'High protein for muscle building. Yogurt aids digestion. Use less cream for heart health.',
        ingredientSources: {
            'nigeria': 'Indian stores in Lagos (Ikoyi). Spices at any supermarket.',
            'ghana': 'Indian shops in Osu (Accra).',
            'usa': 'Indian grocery stores (Patel Brothers). Walmart has basic spices.',
            'uk': 'Southall (London), Bradford. Tesco has a world foods section.',
            'india': 'Available everywhere! Buy fresh spices from local markets.',
            'default': 'Indian spices are available online (Amazon) or at ethnic grocery stores.'
        }
    },
    {
        id: 7, name: 'Tacos Al Pastor', country: 'mexico',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop',
        time: '40 min', calories: '420 kcal',
        health: ['weight-gain', 'ulcer-safe'],
        ingredients: ['Corn tortillas', 'Pork/chicken', 'Pineapple', 'Onions', 'Cilantro', 'Lime', 'Chili powder', 'Cumin'],
        steps: [
            'Marinate meat with chili, cumin, and pineapple juice',
            'Cook the meat until caramelized and tender',
            'Warm the corn tortillas on a dry pan',
            'Chop onions, cilantro, and pineapple',
            'Assemble tacos with meat, toppings, and lime squeeze'
        ],
        healthBenefits: 'Balanced macros. Pineapple aids digestion. Corn tortillas are gluten-free.',
        ingredientSources: {
            'nigeria': 'Corn tortillas may need to be made from masa harina (order online).',
            'usa': 'Walmart, Target, Mexican grocery stores (La Michoacana).',
            'mexico': 'Any tortilleria or supermarket. Fresh is best!',
            'default': 'Corn tortillas can be made at home with masa harina + water + salt.'
        }
    },
    {
        id: 8, name: 'Kimchi Fried Rice', country: 'korea',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
        time: '20 min', calories: '380 kcal',
        health: ['weight-loss', 'probiotic'],
        ingredients: ['Cooked rice', 'Kimchi', 'Eggs', 'Sesame oil', 'Soy sauce', 'Green onions', 'Gochujang (optional)'],
        steps: [
            'Heat sesame oil in a pan',
            'Add chopped kimchi and stir-fry for 2 minutes',
            'Add cooked rice and break up clumps',
            'Add soy sauce and gochujang, mix well',
            'Push rice to side, fry an egg in the empty space',
            'Top with sliced green onions and serve'
        ],
        healthBenefits: 'Kimchi is probiotic for gut health. Low calorie for weight loss. Skip gochujang if you have ulcer.',
        ingredientSources: {
            'nigeria': 'Order kimchi online or make it at home (cabbage + chili + fish sauce).',
            'usa': 'H Mart, Korean grocery stores. Walmart sometimes stocks kimchi.',
            'korea': 'Available at every corner store and market!',
            'default': 'Kimchi can be found in Asian grocery stores or made at home.'
        }
    },
    {
        id: 9, name: 'Oatmeal with Fruits', country: 'usa',
        image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop',
        time: '10 min', calories: '280 kcal',
        health: ['ulcer-safe', 'heart-healthy', 'diabetes-friendly'],
        ingredients: ['Rolled oats', 'Milk or water', 'Banana', 'Berries', 'Honey', 'Cinnamon', 'Chia seeds'],
        steps: [
            'Cook oats in milk or water for 5 minutes',
            'Stir constantly to avoid lumps',
            'Pour into a bowl',
            'Top with sliced banana, berries, and chia seeds',
            'Drizzle honey and sprinkle cinnamon'
        ],
        healthBenefits: 'Soothes stomach lining (ulcer-safe). Low glycemic index. Heart-healthy fiber.',
        ingredientSources: {
            'nigeria': 'Shoprite, Spar, local supermarkets. Quaker oats is common.',
            'ghana': 'Melcom, Shoprite.',
            'usa': 'Any grocery store. Quaker, Bob\'s Red Mill.',
            'default': 'Oats are available in virtually every supermarket globally.'
        }
    },
    {
        id: 10, name: 'Grilled Salmon', country: 'usa',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
        time: '25 min', calories: '350 kcal',
        health: ['heart-healthy', 'weight-loss', 'ulcer-safe'],
        ingredients: ['Salmon fillet', 'Lemon', 'Olive oil', 'Garlic', 'Dill', 'Salt', 'Pepper', 'Asparagus'],
        steps: [
            'Marinate salmon with lemon, olive oil, garlic, and dill',
            'Preheat grill or oven to 200°C',
            'Grill salmon for 12-15 minutes until flaky',
            'Season asparagus and grill alongside',
            'Serve with lemon wedges'
        ],
        healthBenefits: 'Omega-3 for heart health. Lean protein for weight loss. Gentle on stomach.',
        ingredientSources: {
            'nigeria': 'Shoprite, Ebeano. Fresh fish markets may have salmon.',
            'ghana': 'Osu fish market, Shoprite.',
            'usa': 'Whole Foods, Costco, Walmart seafood section.',
            'uk': 'Tesco, Sainsbury\'s, fishmongers.',
            'default': 'Frozen salmon is widely available. Fresh from fish markets.'
        }
    }
];

// ===== HAIRSTYLES DATA =====
const hairstyles = [
    { id: 1, name: 'Box Braids', type: 'braids', length: 'long', image: 'https://images.unsplash.com/photo-1592321675774-3de57f3ee0dc?w=300&h=400&fit=crop', time: '4-6 hours', cost: '₦8,000 - ₦25,000', maintenance: 'Lasts 4-8 weeks. Wash every 2 weeks. Oil scalp regularly.', steps: ['Section hair into boxes', 'Attach braiding hair extensions', 'Braid down to desired length', 'Seal ends with hot water', 'Style as desired'] },
    { id: 2, name: 'Knotless Braids', type: 'braids', length: 'long', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=400&fit=crop', time: '5-8 hours', cost: '₦10,000 - ₦30,000', maintenance: 'Lasts 6-10 weeks. Very gentle on edges. Light weight.', steps: ['Start with clean, stretched hair', 'Feed in braiding hair gradually', 'Braid without knots at the root', 'Continue to desired length', 'Seal ends and style'] },
    { id: 3, name: 'Cornrows', type: 'braids', length: 'short', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=400&fit=crop', time: '1-3 hours', cost: '₦3,000 - ₦10,000', maintenance: 'Lasts 2-4 weeks. Easy to maintain. Great protective style.', steps: ['Part hair into sections', 'Braid close to the scalp', 'Create patterns or straight backs', 'Secure ends with rubber bands', 'Add beads or accessories if desired'] },
    { id: 4, name: 'Ghana Weaving', type: 'weaves', length: 'long', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300&h=400&fit=crop', time: '3-5 hours', cost: '₦7,000 - ₦20,000', maintenance: 'Lasts 4-6 weeks. Very neat and elegant.', steps: ['Create a base with cornrows', 'Sew in weave extensions', 'Style into bumps or straight', 'Trim and shape', 'Set with mousse'] },
    { id: 5, name: 'Curly Wig', type: 'wigs', length: 'long', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=400&fit=crop', time: 'Instant wear', cost: '₦15,000 - ₦80,000', maintenance: 'Wash monthly. Deep condition. Store on wig stand.', steps: ['Braid natural hair flat', 'Put on wig cap', 'Adjust wig to fit', 'Style curls with water and leave-in', 'Fluff and arrange'] },
    { id: 6, name: 'Bob Wig', type: 'wigs', length: 'short', image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=300&h=400&fit=crop', time: 'Instant wear', cost: '₦12,000 - ₦50,000', maintenance: 'Wash every 2 weeks. Trim split ends.', steps: ['Prep natural hair under cap', 'Wear the bob wig', 'Adjust straps for snug fit', 'Style with flat iron if needed', 'Apply edge control'] },
    { id: 7, name: 'Natural Afro', type: 'natural', length: 'short', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=300&h=400&fit=crop', time: '30 min daily', cost: '₦0 - ₦5,000 (products)', maintenance: 'Daily moisturizing. Weekly deep conditioning. Trim every 3 months.', steps: ['Wash and condition hair', 'Apply leave-in conditioner', 'Use curl cream or gel', 'Define curls with fingers or comb', 'Fluff roots for volume'] },
    { id: 8, name: 'Bantu Knots', type: 'natural', length: 'short', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300&h=400&fit=crop', time: '1-2 hours', cost: '₦2,000 - ₦8,000', maintenance: 'Lasts 1-2 weeks. Sleep with satin bonnet.', steps: ['Section damp hair', 'Apply styling cream', 'Twist each section tightly', 'Wrap into small knots', 'Secure with bobby pins'] },
    { id: 9, name: 'Fulani Braids', type: 'braids', length: 'long', image: 'https://images.unsplash.com/photo-1592321675774-3de57f3ee0dc?w=300&h=400&fit=crop', time: '4-6 hours', cost: '₦8,000 - ₦22,000', maintenance: 'Lasts 4-8 weeks. Traditional and trendy.', steps: ['Create cornrows in front with beads', 'Braid the rest into box braids', 'Add cowrie shells or beads', 'Style into ponytail or leave down', 'Oil scalp twice a week'] },
    { id: 10, name: 'Sew-in Weave', type: 'weaves', length: 'long', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300&h=400&fit=crop', time: '2-4 hours', cost: '₦10,000 - ₦35,000', maintenance: 'Lasts 6-8 weeks. Wash carefully.', steps: ['Braid natural hair into a beehive pattern', 'Sew weave tracks onto braids', 'Cut and style to frame face', 'Blend with leave-out hair', 'Set with heat protectant'] },
    { id: 11, name: 'Pixie Cut', type: 'short', length: 'short', image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=300&h=400&fit=crop', time: '1 hour', cost: '₦3,000 - ₦15,000', maintenance: 'Trim every 3-4 weeks. Style daily.', steps: ['Cut hair very short on sides', 'Leave slightly longer on top', 'Texturize for movement', 'Style with pomade or wax', 'Finger-style for messy look'] },
    { id: 12, name: 'Curly Weave', type: 'weaves', length: 'long', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=400&fit=crop', time: '3-4 hours', cost: '₦12,000 - ₦40,000', maintenance: 'Lasts 6-8 weeks. Define curls with water.', steps: ['Braid hair flat', 'Sew in curly weave', 'Cut layers for shape', 'Apply curl activator', 'Scrunch and air dry'] }
];
// ===== AUTH FUNCTIONS =====
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('signup-form').classList.toggle('hidden', tab !== 'signup');
}

function signup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    if (!name || !email || !password) {
        showToast('Please fill in all fields 💕');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('glowup_users') || '[]');
    if (users.find(u => u.email === email)) {
        showToast('Email already registered! Try logging in 😊');
        return;
    }
    
    const user = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
    users.push(user);
    localStorage.setItem('glowup_users', JSON.stringify(users));
    
    currentUser = user;
    localStorage.setItem('glowup_user', JSON.stringify(user));
    
    checkLoginStreak();
    
    showToast('Welcome to Glow Up AI! ✨');
    showScreen('onboarding-screen');
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showToast('Please enter email and password 💕');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('glowup_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showToast('Invalid email or password 😔');
        return;
    }
    
    currentUser = user;
    localStorage.setItem('glowup_user', JSON.stringify(user));
    
    const profiles = JSON.parse(localStorage.getItem('glowup_profiles') || '{}');
    userProfile = profiles[user.id] || {};
    
    checkLoginStreak();
    
    showToast('Welcome back, ' + user.name + '! ✨');
    
    if (Object.keys(userProfile).length === 0) {
        showScreen('onboarding-screen');
    } else {
        showMainApp();
    }
}

function checkLoginStreak() {
    const today = new Date().toDateString();
    if (lastLoginDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastLoginDate === yesterday.toDateString()) {
            loginStreak++;
        } else if (lastLoginDate !== today) {
            loginStreak = 1;
        }
        lastLoginDate = today;
        localStorage.setItem('glowup_streak', loginStreak);
        localStorage.setItem('glowup_last_login', lastLoginDate);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('glowup_user');
    showScreen('auth-screen');
}

// ===== ONBOARDING =====
function nextOnboarding(step) {
    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.add('hidden'));
    document.getElementById('onboarding-step-' + step).classList.remove('hidden');
}

function selectGoal(el, goal) {
    el.classList.toggle('selected');
    if (selectedGoals.includes(goal)) {
        selectedGoals = selectedGoals.filter(g => g !== goal);
    } else {
        selectedGoals.push(goal);
    }
}

function finishOnboarding() {
    const name = document.getElementById('onboard-name').value;
    const age = document.getElementById('onboard-age').value;
    const weight = document.getElementById('onboard-weight').value;
    const height = document.getElementById('onboard-height').value;
    const goalWeight = document.getElementById('onboard-goal-weight').value;
    const health = document.getElementById('onboard-health').value;
    const sugar = document.getElementById('onboard-sugar').value;
    
    if (!name || !age || !weight || !height) {
        showToast('Please fill in the required fields 💕');
        return;
    }
    
    userProfile = {
        name, age: parseInt(age), weight: parseFloat(weight),
        height: parseFloat(height), goalWeight: parseFloat(goalWeight) || parseFloat(weight),
        health, sugar, goals: selectedGoals,
        startWeight: parseFloat(weight),
        currentWeight: parseFloat(weight),
        onboarded: true
    };
    
    const profiles = JSON.parse(localStorage.getItem('glowup_profiles') || '{}');
    profiles[currentUser.id] = userProfile;
    localStorage.setItem('glowup_profiles', JSON.stringify(profiles));
    
    fitnessProgress = { currentWeek: 1, currentDay: 1, completedDays: [], completedWeeks: [] };
    localStorage.setItem('glowup_fitness', JSON.stringify(fitnessProgress));
    
    showToast('Profile complete! Let\'s glow up! ✨');
    showMainApp();
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showMainApp() {
    showScreen('main-app');
    updateHeader();
    updateHomeDashboard();
    renderAIAnalysis();
    renderFood();
    renderHair();
    renderMarketplace();
    renderFitness();
    checkPremiumStatus();
}

function updateHeader() {
    if (userProfile.name) {
        document.getElementById('user-name').textContent = 'Hey ' + userProfile.name + '!';
    }
    document.getElementById('streak-badge').textContent = '🔥 ' + loginStreak + ' day streak';
    document.getElementById('premium-badge').textContent = isPremium ? 'PREMIUM' : 'FREE';
    document.getElementById('premium-badge').className = 'badge ' + (isPremium ? 'premium' : 'free');
}

// ===== NAVIGATION =====
function showSection(section) {
    document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + '-section').classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.nav-btn[data-section="' + section + '"]').classList.add('active');
    
    currentSection = section;
    
    if (section === 'fitness') renderFitness();
    if (section === 'food') renderFood();
    if (section === 'hair') renderHair();
    if (section === 'period') renderPeriod();
    if (section === 'market') renderMarketplace();
}

// ===== HOME DASHBOARD =====
function updateHomeDashboard() {
    if (!userProfile.weight) return;
    
    document.getElementById('start-weight').textContent = userProfile.startWeight + ' kg';
    document.getElementById('current-weight').textContent = (userProfile.currentWeight || userProfile.startWeight) + ' kg';
    document.getElementById('goal-weight-display').textContent = userProfile.goalWeight + ' kg';
    
    const heightM = userProfile.height / 100;
    const bmi = (userProfile.currentWeight || userProfile.startWeight) / (heightM * heightM);
    document.getElementById('bmi-value').textContent = bmi.toFixed(1);
    
    let bmiStatus = '';
    if (bmi < 18.5) bmiStatus = 'Underweight - Let\'s gain some healthy weight! 💪';
    else if (bmi < 25) bmiStatus = 'Healthy weight - You\'re doing great! ✨';
    else if (bmi < 30) bmiStatus = 'Overweight - We\'ll work on it together! 💕';
    else bmiStatus = 'Obese - Let\'s start your transformation journey! 🌟';
    document.getElementById('bmi-status').textContent = bmiStatus;
    
    const fp = fitnessProgress || {};
    const week = fp.currentWeek || 1;
    const day = fp.currentDay || 1;
    document.getElementById('fitness-progress').textContent = 'Week ' + week + ' • Day ' + day;
    
    const allEaten = mealStatus.breakfast && mealStatus.lunch && mealStatus.dinner;
    document.getElementById('meal-status').textContent = allEaten ? 'All meals done! 🎉' : 'Have you eaten today?';
    
    if (periodData.nextPeriod) {
        const days = Math.ceil((new Date(periodData.nextPeriod) - new Date()) / (1000 * 60 * 60 * 24));
        document.getElementById('period-status').textContent = days > 0 ? days + ' days until next period' : 'Period due soon!';
    }
}

// ===== AI ANALYSIS (NO API NEEDED!) =====
function renderAIAnalysis() {
    if (!userProfile.name) return;
    
    const container = document.getElementById('ai-analysis-result');
    let analysis = '';
    
    const currentW = userProfile.currentWeight || userProfile.startWeight;
    const goalW = userProfile.goalWeight;
    const diff = goalW - currentW;
    
    if (Math.abs(diff) < 2) {
        analysis += '<p>🎯 <b>You\'re near your goal weight!</b> Keep maintaining with our meal plans.</p>';
    } else if (diff > 0) {
        analysis += '<p>📈 <b>Weight Gain Goal:</b> You need to gain ' + diff.toFixed(1) + ' kg. Focus on protein-rich meals and strength training!</p>';
    } else {
        analysis += '<p>📉 <b>Weight Loss Goal:</b> You need to lose ' + Math.abs(diff).toFixed(1) + ' kg. Our cardio plans and healthy recipes will help!</p>';
    }
    
    if (userProfile.health) {
        const health = userProfile.health.toLowerCase();
        if (health.includes('ulcer')) {
            analysis += '<p>🍲 <b>Ulcer Care:</b> Avoid spicy foods! Try our oatmeal, pasta carbonara, and grilled salmon recipes.</p>';
        }
        if (health.includes('diabet') || health.includes('sugar')) {
            analysis += '<p>🥗 <b>Diabetes Friendly:</b> Stick to low-GI foods. Egusi soup and oatmeal are perfect for you!</p>';
        }
        if (health.includes('chest') || health.includes('heart')) {
            analysis += '<p>❤️ <b>Heart Health:</b> Choose grilled salmon, avocado toast, and avoid fried foods.</p>';
        }
    }
    
    if (userProfile.goals && userProfile.goals.includes('flat-tummy')) {
        analysis += '<p>💪 <b>Flat Tummy Focus:</b> Your core workout is ready! Start with Week 1 Day 1.</p>';
    }
    if (userProfile.goals && userProfile.goals.includes('big-butt')) {
        analysis += '<p>🍑 <b>Big Butt Goal:</b> Squats and glute bridges are your best friends! Check the fitness tab.</p>';
    }
    
    if (loginStreak > 1) {
        analysis += '<p>🔥 <b>Amazing!</b> You\'ve logged in ' + loginStreak + ' days in a row. Consistency is key!</p>';
    }
    
    if (!mealStatus.breakfast) {
        analysis += '<p>⏰ <b>Reminder:</b> Don\'t skip breakfast! Check the Food tab for ideas.</p>';
    }
    
    container.innerHTML = analysis || '<p>Complete more of your profile to get personalized recommendations! ✨</p>';
}
// ===== FITNESS SECTION =====
function setFitnessGoal(goal) {
    currentFitnessGoal = goal;
    document.querySelectorAll('.program-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + goal).classList.add('active');
    renderFitness();
}

function renderFitness() {
    const program = fitnessPrograms[currentFitnessGoal];
    if (!program) return;
    
    if (!isPremium && fitnessDaysUsed >= 3) {
        document.getElementById('fitness-locked').classList.remove('hidden');
        document.getElementById('fitness-content').classList.add('hidden');
        return;
    }
    
    document.getElementById('fitness-locked').classList.add('hidden');
    document.getElementById('fitness-content').classList.remove('hidden');
    
    const container = document.getElementById('workout-container');
    container.innerHTML = '';
    
    const fp = fitnessProgress || { currentWeek: 1, currentDay: 1, completedDays: [], completedWeeks: [] };
    const completedDays = fp.completedDays || [];
    const completedWeeks = fp.completedWeeks || [];
    
    const totalDays = 84;
    const completed = completedDays.length;
    const percent = Math.round((completed / totalDays) * 100);
    document.getElementById('fitness-progress-bar').style.width = percent + '%';
    document.getElementById('progress-percent').textContent = percent + '%';
    document.getElementById('current-week').textContent = 'Week ' + fp.currentWeek;
    
    program.weeks.forEach((week, weekIndex) => {
        const weekNum = weekIndex + 1;
        const isWeekLocked = weekNum > 1 && !completedWeeks.includes(weekNum - 1);
        const isWeekComplete = completedWeeks.includes(weekNum);
        
        const weekDiv = document.createElement('div');
        weekDiv.className = 'week-container';
        
        let weekHeaderHTML = '<div class="week-header ' + (isWeekLocked ? 'locked' : '') + '" onclick="toggleWeek(' + weekNum + ')">';
        weekHeaderHTML += '<h3>Week ' + weekNum + (isWeekComplete ? ' ✅' : '') + '</h3>';
        weekHeaderHTML += '<span>' + (isWeekLocked ? '🔒' : '▼') + '</span>';
        weekHeaderHTML += '</div>';
        weekHeaderHTML += '<div id="week-' + weekNum + '" class="week-days" style="display:none;">';
        
        week.forEach((day, dayIndex) => {
            const dayNum = dayIndex + 1;
            const dayKey = 'W' + weekNum + 'D' + dayNum;
            const isCompleted = completedDays.includes(dayKey);
            const isLocked = isWeekLocked;
            
            if (day.rest) {
                weekHeaderHTML += '<div class="day-card ' + (isLocked ? 'locked' : '') + '">';
                weekHeaderHTML += '<div class="day-header"><h4>🌸 Day ' + dayNum + ' - Rest Day</h4></div>';
                weekHeaderHTML += '<p style="padding:10px;background:var(--bg);border-radius:8px;font-size:14px;">' + day.message + '</p>';
                weekHeaderHTML += '<button onclick="completeRestDay(' + weekNum + ',' + dayNum + ')" class="start-workout-btn" style="background:linear-gradient(135deg,#9C27B0,#7B1FA2);">Mark Rest Day Complete ✓</button>';
                weekHeaderHTML += '</div>';
            } else {
                weekHeaderHTML += '<div class="day-card ' + (isCompleted ? 'completed' : '') + ' ' + (isLocked ? 'locked' : '') + '">';
                weekHeaderHTML += '<div class="day-header">';
                weekHeaderHTML += '<h4>💪 Day ' + dayNum + '</h4>';
                weekHeaderHTML += '<span class="day-status">' + (isCompleted ? 'Done ✓' : 'Pending') + '</span>';
                weekHeaderHTML += '</div>';
                
                day.exercises.forEach(ex => {
                    weekHeaderHTML += '<div class="exercise-item">';
                    weekHeaderHTML += '<img src="' + ex.image + '" alt="' + ex.name + '">';
                    weekHeaderHTML += '<div class="exercise-info">';
                    weekHeaderHTML += '<h5>' + ex.name + '</h5>';
                    weekHeaderHTML += '<p>' + ex.duration + ' min • Rest: ' + ex.rest + ' min</p>';
                    weekHeaderHTML += '</div>';
                    weekHeaderHTML += '<div class="exercise-timer">';
                    weekHeaderHTML += '<span>' + ex.duration + 'm</span>';
                    weekHeaderHTML += '<small>each set</small>';
                    weekHeaderHTML += '</div>';
                    weekHeaderHTML += '</div>';
                });
                
                if (!isCompleted && !isLocked) {
                    weekHeaderHTML += '<button onclick="startWorkout(' + weekNum + ',' + dayNum + ')" class="start-workout-btn">Start Workout 🔥</button>';
                }
                weekHeaderHTML += '</div>';
            }
        });
        
        weekHeaderHTML += '</div>';
        weekDiv.innerHTML = weekHeaderHTML;
        container.appendChild(weekDiv);
    });
}

function toggleWeek(weekNum) {
    const el = document.getElementById('week-' + weekNum);
    if (el) {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
}

function startWorkout(week, day) {
    if (!isPremium && fitnessDaysUsed >= 3) {
        showToast('Free trial ended! Upgrade to continue 💕');
        showPremiumModal();
        return;
    }
    
    const program = fitnessPrograms[currentFitnessGoal];
    const weekData = program.weeks[week - 1];
    const dayData = weekData[day - 1];
    
    if (!dayData || dayData.rest) return;
    
    showWorkoutTimer(dayData.exercises, week, day);
}

let currentExerciseIndex = 0;
let timerInterval = null;
let timeLeft = 0;
let isPaused = true;

function showWorkoutTimer(exercises, week, day) {
    currentExerciseIndex = 0;
    
    let overlay = document.getElementById('workout-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'workout-overlay';
        overlay.className = 'timer-overlay hidden';
        overlay.innerHTML = `
            <img id="timer-img" class="timer-exercise-img" src="">
            <div id="timer-name" class="timer-exercise-name"></div>
            <div id="timer-display" class="timer-display">00:00</div>
            <div class="timer-controls">
                <button class="start" onclick="toggleTimer()">Start</button>
                <button class="skip" onclick="nextExercise()">Skip</button>
            </div>
            <p id="timer-progress" style="margin-top:20px;color:rgba(255,255,255,0.7);"></p>
        `;
        document.body.appendChild(overlay);
    }
    
    overlay.classList.remove('hidden');
    loadExercise(exercises);
    
    overlay.dataset.week = week;
    overlay.dataset.day = day;
}

function loadExercise(exercises) {
    const ex = exercises[currentExerciseIndex];
    document.getElementById('timer-img').src = ex.image;
    document.getElementById('timer-name').textContent = ex.name + ' - ' + ex.duration + ' minutes';
    document.getElementById('timer-progress').textContent = 'Exercise ' + (currentExerciseIndex + 1) + ' of ' + exercises.length;
    timeLeft = ex.duration * 60;
    updateTimerDisplay();
    isPaused = true;
}

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function toggleTimer() {
    const btn = document.querySelector('.timer-controls .start');
    if (isPaused) {
        isPaused = false;
        btn.textContent = 'Pause';
        btn.className = 'pause';
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                nextExercise();
            }
        }, 1000);
    } else {
        isPaused = true;
        btn.textContent = 'Resume';
        btn.className = 'start';
        clearInterval(timerInterval);
    }
}

function nextExercise() {
    clearInterval(timerInterval);
    const overlay = document.getElementById('workout-overlay');
    const week = parseInt(overlay.dataset.week);
    const day = parseInt(overlay.dataset.day);
    const program = fitnessPrograms[currentFitnessGoal];
    const exercises = program.weeks[week - 1][day - 1].exercises;
    
    currentExerciseIndex++;
    if (currentExerciseIndex >= exercises.length) {
        overlay.classList.add('hidden');
        completeWorkout(week, day);
    } else {
        loadExercise(exercises);
        document.querySelector('.timer-controls .start').textContent = 'Start';
        document.querySelector('.timer-controls .start').className = 'start';
    }
}

function completeWorkout(week, day) {
    const dayKey = 'W' + week + 'D' + day;
    if (!fitnessProgress.completedDays) fitnessProgress.completedDays = [];
    if (!fitnessProgress.completedDays.includes(dayKey)) {
        fitnessProgress.completedDays.push(dayKey);
        fitnessDaysUsed++;
        localStorage.setItem('glowup_fitness_days', fitnessDaysUsed);
        localStorage.setItem('glowup_fitness', JSON.stringify(fitnessProgress));
    }
    
    const program = fitnessPrograms[currentFitnessGoal];
    const weekData = program.weeks[week - 1];
    const allDaysDone = weekData.every((d, i) => {
        if (d.rest) return true;
        return fitnessProgress.completedDays.includes('W' + week + 'D' + (i + 1));
    });
    
    if (allDaysDone && !fitnessProgress.completedWeeks.includes(week)) {
        fitnessProgress.completedWeeks.push(week);
        document.getElementById('completed-week').textContent = week;
        document.getElementById('week-complete-modal').classList.add('active');
        localStorage.setItem('glowup_fitness', JSON.stringify(fitnessProgress));
    }
    
    showToast('Workout complete! You\'re glowing! ✨');
    renderFitness();
    updateHomeDashboard();
}

function completeRestDay(week, day) {
    const dayKey = 'W' + week + 'D' + day;
    if (!fitnessProgress.completedDays) fitnessProgress.completedDays = [];
    if (!fitnessProgress.completedDays.includes(dayKey)) {
        fitnessProgress.completedDays.push(dayKey);
        localStorage.setItem('glowup_fitness', JSON.stringify(fitnessProgress));
    }
    showToast('Rest day marked! Recovery is important too 💕');
    renderFitness();
}

function setWorkoutFeel(feel) {
    workoutFeel = feel;
    document.querySelectorAll('.feel-buttons button').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected');
}

function submitWeekComplete() {
    const weight = document.getElementById('week-weight').value;
    if (weight) {
        userProfile.currentWeight = parseFloat(weight);
        const profiles = JSON.parse(localStorage.getItem('glowup_profiles') || '{}');
        profiles[currentUser.id] = userProfile;
        localStorage.setItem('glowup_profiles', JSON.stringify(profiles));
    }
    
    if (workoutFeel === 'hard') {
        showToast('We\'ll make next week a bit easier for you! 💕');
    } else if (workoutFeel === 'easy') {
        showToast('Amazing! We\'ll increase the intensity next week! 🔥');
    }
    
    fitnessProgress.currentWeek = (fitnessProgress.currentWeek || 1) + 1;
    localStorage.setItem('glowup_fitness', JSON.stringify(fitnessProgress));
    
    closeModal('week-complete-modal');
    renderFitness();
    updateHomeDashboard();
    showToast('Week unlocked! You\'re unstoppable! 🎉');
}

// ===== FOOD SECTION =====
let currentFoodFilter = 'all';
let currentHealthFilter = 'all';

function filterFood(country) {
    currentFoodFilter = country;
    document.querySelectorAll('.food-cat').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderFood();
}

function filterByHealth(health) {
    currentHealthFilter = health;
    document.querySelectorAll('.health-tag').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderFood();
}

function renderFood() {
    const grid = document.getElementById('food-grid');
    grid.innerHTML = '';
    
    let filtered = recipes;
    if (currentFoodFilter !== 'all') {
        filtered = filtered.filter(r => r.country === currentFoodFilter);
    }
    if (currentHealthFilter !== 'all') {
        filtered = filtered.filter(r => r.health.includes(currentHealthFilter));
    }
    
    if (userProfile.health) {
        const userHealth = userProfile.health.toLowerCase();
        if (userHealth.includes('ulcer')) {
            filtered = filtered.filter(r => !r.health.includes('spicy') && !r.name.toLowerCase().includes('spicy'));
        }
    }
    
    filtered.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.onclick = () => showFoodDetail(recipe);
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <div class="food-card-info">
                <h4>${recipe.name}</h4>
                <p>⏱️ ${recipe.time} • 🔥 ${recipe.calories}</p>
                <span class="food-country">${recipe.country.toUpperCase()}</span>
            </div>
        `;
        grid.appendChild(card);
    });
    
    document.getElementById('breakfast-status').textContent = mealStatus.breakfast ? 'Eaten ✓' : 'Not eaten';
    document.getElementById('lunch-status').textContent = mealStatus.lunch ? 'Eaten ✓' : 'Not eaten';
    document.getElementById('dinner-status').textContent = mealStatus.dinner ? 'Eaten ✓' : 'Not eaten';
    
    document.querySelectorAll('.reminder-item button').forEach((btn, i) => {
        const meals = ['breakfast', 'lunch', 'dinner'];
        if (mealStatus[meals[i]]) {
            btn.textContent = 'Eaten ✓';
            btn.classList.add('eaten');
        } else {
            btn.textContent = 'Mark Eaten';
            btn.classList.remove('eaten');
        }
    });
}

function showFoodDetail(recipe) {
    currentFood = recipe;
    document.getElementById('food-detail-img').src = recipe.image;
    document.getElementById('food-detail-name').textContent = recipe.name;
    document.getElementById('food-detail-country').textContent = '🇺🇳 ' + recipe.country.toUpperCase();
    document.getElementById('food-detail-time').textContent = '⏱️ ' + recipe.time;
    document.getElementById('food-detail-calories').textContent = '🔥 ' + recipe.calories;
    
    const ingList = document.getElementById('food-detail-ingredients');
    ingList.innerHTML = recipe.ingredients.map(i => '<li>' + i + '</li>').join('');
    
    const stepsDiv = document.getElementById('food-detail-steps');
    stepsDiv.innerHTML = recipe.steps.map((s, i) => `
        <div class="step-item">
            <div class="step-num">${i + 1}</div>
            <div class="step-text">${s}</div>
        </div>
    `).join('');
    
    document.getElementById('food-detail-health').textContent = recipe.healthBenefits;
    
    document.getElementById('food-detail-modal').classList.add('active');
}

function askIngredientSource() {
    document.getElementById('ingredient-modal').classList.add('active');
}

function getIngredientSource() {
    const country = document.getElementById('user-country').value.toLowerCase().trim();
    const resultDiv = document.getElementById('ingredient-source-result');
    
    if (!country) {
        showToast('Please enter your country first! 🌍');
        return;
    }
    
    let source = currentFood.ingredientSources[country] || currentFood.ingredientSources['default'];
    
    resultDiv.innerHTML = `
        <div class="ingredient-result">
            <h4>🛒 Where to find ingredients in ${country.charAt(0).toUpperCase() + country.slice(1)}:</h4>
            <p>${source}</p>
            <h4 style="margin-top:15px;">💡 AI Tip:</h4>
            <p>If you can't find these ingredients locally, try:</p>
            <ul>
                <li>Amazon or local online grocery stores</li>
                <li>Ethnic food markets in your city</li>
                <li>Asking local restaurants where they source from</li>
                <li>Community Facebook groups for food swaps</li>
            </ul>
        </div>
    `;
}

function markMealEaten(meal) {
    mealStatus[meal] = true;
    localStorage.setItem('glowup_meals', JSON.stringify(mealStatus));
    renderFood();
    updateHomeDashboard();
    showToast('Great! ' + meal.charAt(0).toUpperCase() + meal.slice(1) + ' logged! 🍽️');
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow - now;
    setTimeout(() => {
        mealStatus = { breakfast: false, lunch: false, dinner: false };
        localStorage.setItem('glowup_meals', JSON.stringify(mealStatus));
        renderFood();
    }, msUntilMidnight);
}

function askDietician() {
    document.getElementById('dietician-modal').classList.add('active');
}

function submitDieticianRequest() {
    const name = document.getElementById('diet-name').value;
    const email = document.getElementById('diet-email').value;
    const phone = document.getElementById('diet-phone').value;
    const message = document.getElementById('diet-message').value;
    
    if (!name || !email || !phone) {
        showToast('Please fill in your contact details 💕');
        return;
    }
    
    const requests = JSON.parse(localStorage.getItem('glowup_diet_requests') || '[]');
    requests.push({ name, email, phone, message, date: new Date().toISOString(), userId: currentUser?.id });
    localStorage.setItem('glowup_diet_requests', JSON.stringify(requests));
    
    closeModal('dietician-modal');
    showToast('Request sent! A dietician will contact you within 24 hours 👩‍⚕️');
}
// ===== HAIR SECTION =====
let currentHairFilter = 'all';
let selectedSkinTone = '';

function filterHair(type) {
    currentHairFilter = type;
    document.querySelectorAll('.hair-filter').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderHair();
}

function setSkinTone(tone) {
    selectedSkinTone = tone;
    document.querySelectorAll('.tone').forEach(t => t.classList.remove('selected'));
    event.target.classList.add('selected');
}

function renderHair() {
    const grid = document.getElementById('hair-grid');
    grid.innerHTML = '';
    
    let filtered = hairstyles;
    if (currentHairFilter !== 'all') {
        filtered = filtered.filter(h => h.type === currentHairFilter || h.length === currentHairFilter);
    }
    
    filtered.forEach(style => {
        const card = document.createElement('div');
        card.className = 'hair-card';
        card.onclick = () => showHairDetail(style);
        card.innerHTML = `
            <img src="${style.image}" alt="${style.name}">
            <div class="hair-card-info">
                <h4>${style.name}</h4>
                <p>${style.type} • ${style.length}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function showHairDetail(style) {
    currentHair = style;
    document.getElementById('hair-detail-img').src = style.image;
    document.getElementById('hair-detail-name').textContent = style.name;
    document.getElementById('hair-detail-type').textContent = style.type.toUpperCase();
    document.getElementById('hair-detail-length').textContent = style.length.toUpperCase();
    document.getElementById('hair-detail-time').textContent = '⏱️ ' + style.time;
    document.getElementById('hair-detail-cost').textContent = style.cost;
    document.getElementById('hair-detail-maintain').textContent = style.maintenance;
    
    const stepsDiv = document.getElementById('hair-detail-steps');
    stepsDiv.innerHTML = style.steps.map((s, i) => `
        <div class="step-item">
            <div class="step-num">${i + 1}</div>
            <div class="step-text">${s}</div>
        </div>
    `).join('');
    
    document.getElementById('hair-detail-modal').classList.add('active');
}

function handleFaceUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('face-preview');
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function analyzeFaceForHair() {
    const budget = document.getElementById('hair-budget').value;
    const preview = document.getElementById('face-preview');
    
    if (!preview.src || preview.classList.contains('hidden')) {
        showToast('Please upload your photo first! 📸');
        return;
    }
    
    const recs = [];
    const budgetNum = parseInt(budget) || 20000;
    
    if (budgetNum < 5000) {
        recs.push('Natural Afro - Free to maintain, just need good products!');
        recs.push('Cornrows - Very affordable and protective');
    } else if (budgetNum < 15000) {
        recs.push('Box Braids - Classic and versatile');
        recs.push('Bantu Knots - Cute and budget-friendly');
    } else if (budgetNum < 30000) {
        recs.push('Knotless Braids - Trendy and gentle on edges');
        recs.push('Ghana Weaving - Elegant and long-lasting');
    } else {
        recs.push('Premium Wig (Human Hair) - Instant transformation');
        recs.push('Knotless Braids with Extensions - Best quality');
    }
    
    if (selectedSkinTone === 'dark' || selectedSkinTone === 'brown') {
        recs.push('Bold colors like burgundy or honey blonde will POP on your skin!');
    } else {
        recs.push('Warm browns and caramels will complement your skin tone beautifully!');
    }
    
    const resultDiv = document.getElementById('hair-recommendation');
    resultDiv.innerHTML = `
        <div class="hair-rec-result">
            <h4>✨ AI Hair Analysis Results</h4>
            <p><b>Based on your photo and budget of ₦${budgetNum.toLocaleString()}:</b></p>
            ${recs.map(r => '<p>• ' + r + '</p>').join('')}
            <p style="margin-top:10px;color:var(--primary-dark);"><b>💡 Pro Tip:</b> Always moisturize your natural hair before any protective style!</p>
        </div>
    `;
}

// ===== PERIOD TRACKER =====
function renderPeriod() {
    if (!isPremium && periodScansUsed >= 3) {
        document.getElementById('period-locked').classList.remove('hidden');
        document.getElementById('period-content').classList.add('hidden');
    } else {
        document.getElementById('period-locked').classList.add('hidden');
        document.getElementById('period-content').classList.remove('hidden');
    }
    
    if (periodData.startDate) document.getElementById('period-start').value = periodData.startDate;
    if (periodData.endDate) document.getElementById('period-end').value = periodData.endDate;
    if (periodData.cycleLength) document.getElementById('cycle-length').value = periodData.cycleLength;
    if (periodData.pain) document.getElementById('period-pain').value = periodData.pain;
    if (periodData.doctor) document.getElementById('doctor-visit').value = periodData.doctor;
    if (periodData.remind3days) document.getElementById('remind-3days').checked = true;
    if (periodData.remindStart) document.getElementById('remind-start').checked = true;
    
    if (periodData.nextPeriod) {
        const days = Math.ceil((new Date(periodData.nextPeriod) - new Date()) / (1000 * 60 * 60 * 24));
        document.getElementById('days-until').textContent = days > 0 ? days : 0;
        document.getElementById('next-period-date').textContent = new Date(periodData.nextPeriod).toLocaleDateString();
        document.getElementById('ovulation-date').textContent = new Date(periodData.ovulation).toLocaleDateString();
        document.getElementById('fertile-date').textContent = new Date(periodData.fertileStart).toLocaleDateString() + ' - ' + new Date(periodData.fertileEnd).toLocaleDateString();
        document.getElementById('period-result').classList.remove('hidden');
    }
}

function calculatePeriod() {
    if (!isPremium && periodScansUsed >= 3) {
        showToast('Free scans used! Upgrade for unlimited tracking 🌸');
        showPremiumModal();
        return;
    }
    
    const start = document.getElementById('period-start').value;
    const end = document.getElementById('period-end').value;
    const cycle = parseInt(document.getElementById('cycle-length').value) || 28;
    
    if (!start || !end) {
        showToast('Please enter both start and end dates 📅');
        return;
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const periodLength = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);
    
    const ovulation = new Date(nextPeriod);
    ovulation.setDate(ovulation.getDate() - 14);
    
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    periodData = {
        startDate: start,
        endDate: end,
        cycleLength: cycle,
        periodLength: periodLength,
        nextPeriod: nextPeriod.toISOString(),
        ovulation: ovulation.toISOString(),
        fertileStart: fertileStart.toISOString(),
        fertileEnd: fertileEnd.toISOString()
    };
    
    localStorage.setItem('glowup_period', JSON.stringify(periodData));
    
    if (!isPremium) {
        periodScansUsed++;
        localStorage.setItem('glowup_period_scans', periodScansUsed);
    }
    
    renderPeriod();
    updateHomeDashboard();
    showToast('Cycle calculated! Your next period is in ' + Math.ceil((nextPeriod - new Date()) / (1000 * 60 * 60 * 24)) + ' days 🌸');
}

function logSymptom(symptom) {
    event.target.classList.toggle('active');
    
    const symptoms = JSON.parse(localStorage.getItem('glowup_symptoms') || '[]');
    const today = new Date().toDateString();
    
    symptoms.push({ symptom, date: today });
    localStorage.setItem('glowup_symptoms', JSON.stringify(symptoms));
    
    let advice = '';
    switch(symptom) {
        case 'cramps': advice = 'Try a warm water bottle on your tummy and drink ginger tea! 🍵'; break;
        case 'moody': advice = 'It\'s okay to feel this way! Take deep breaths and rest. 💕'; break;
        case 'bloating': advice = 'Avoid salty foods and drink peppermint tea! 🌿'; break;
        case 'tired': advice = 'Your body is working hard! Take a nap if you can. 😴'; break;
        case 'headache': advice = 'Stay hydrated and rest in a dark room. 💧'; break;
        case 'acne': advice = 'Keep your face clean and avoid touching it. Use a gentle cleanser! 🧴'; break;
    }
    
    if (advice) showToast(advice);
}

function saveReminder() {
    periodData.remind3days = document.getElementById('remind-3days').checked;
    periodData.remindStart = document.getElementById('remind-start').checked;
    localStorage.setItem('glowup_period', JSON.stringify(periodData));
    showToast('Reminders saved! 🔔');
}

function savePeriodPain() {
    periodData.pain = document.getElementById('period-pain').value;
    localStorage.setItem('glowup_period', JSON.stringify(periodData));
    
    if (periodData.pain === 'severe') {
        showToast('Severe pain? Please see a doctor soon! Your health matters 🏥');
    }
}

function saveDoctorVisit() {
    periodData.doctor = document.getElementById('doctor-visit').value;
    localStorage.setItem('glowup_period', JSON.stringify(periodData));
}

// ===== MARKETPLACE =====
let currentMarketTab = 'buy';
let currentMarketFilter = 'all';

function showMarketTab(tab) {
    currentMarketTab = tab;
    document.querySelectorAll('.market-tab').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('market-buy').classList.toggle('hidden', tab !== 'buy');
    document.getElementById('market-sell').classList.toggle('hidden', tab !== 'sell');
    if (tab === 'buy') renderMarketplace();
}

function filterMarket(category) {
    currentMarketFilter = category;
    document.querySelectorAll('.mcat').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderMarketplace();
}

function renderMarketplace() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';
    
    let filtered = products.filter(p => p.approved);
    if (currentMarketFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentMarketFilter);
    }
    
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'market-card';
        card.onclick = () => showProductBuy(product);
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="market-info">
                <h4>${product.name}</h4>
                <p class="price">₦${product.price.toLocaleString()}</p>
                <p class="seller">by ${product.seller}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function showProductBuy(product) {
    currentProduct = product;
    document.getElementById('buy-product-img').src = product.image;
    document.getElementById('buy-product-name').textContent = product.name;
    document.getElementById('buy-product-price').textContent = '₦' + product.price.toLocaleString();
    document.getElementById('buy-product-desc').textContent = product.desc + '\n\nSold by: ' + product.seller;
    document.getElementById('product-buy-modal').classList.add('active');
}

function previewSellImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('sell-preview');
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function submitProduct() {
    const name = document.getElementById('sell-name').value;
    const price = document.getElementById('sell-price').value;
    const category = document.getElementById('sell-category').value;
    const desc = document.getElementById('sell-desc').value;
    const preview = document.getElementById('sell-preview');
    
    if (!name || !price || !category || !desc) {
        showToast('Please fill in all product details 📦');
        return;
    }
    
    const product = {
        id: Date.now(),
        name,
        price: parseInt(price),
        category,
        desc,
        image: preview.src && !preview.classList.contains('hidden') ? preview.src : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        seller: currentUser ? currentUser.name : 'Anonymous',
        approved: false,
        submittedAt: new Date().toISOString()
    };
    
    products.push(product);
    localStorage.setItem('glowup_products', JSON.stringify(products));
    
    document.getElementById('sell-name').value = '';
    document.getElementById('sell-price').value = '';
    document.getElementById('sell-category').value = '';
    document.getElementById('sell-desc').value = '';
    document.getElementById('sell-preview').classList.add('hidden');
    
    showToast('Product submitted for approval! Admin will review it soon 📦');
}

// ===== PAYSTACK PAYMENT =====
function payWithPaystack() {
    if (!currentProduct) return;
    
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: currentUser ? currentUser.email : 'customer@example.com',
        amount: currentProduct.price * 100,
        currency: 'NGN',
        ref: 'GLOWUP_' + Date.now(),
        metadata: {
            product_id: currentProduct.id,
            product_name: currentProduct.name,
            custom_fields: [
                { display_name: 'Product', variable_name: 'product', value: currentProduct.name }
            ]
        },
        callback: function(response) {
            showToast('Payment successful! 🎉 Reference: ' + response.reference);
            closeModal('product-buy-modal');
            
            const transactions = JSON.parse(localStorage.getItem('glowup_transactions') || '[]');
            transactions.push({
                reference: response.reference,
                product: currentProduct.name,
                amount: currentProduct.price,
                date: new Date().toISOString(),
                status: 'success'
            });
            localStorage.setItem('glowup_transactions', JSON.stringify(transactions));
        },
        onClose: function() {
            showToast('Payment cancelled. You can try again! 💕');
        }
    });
    
    handler.openIframe();
}

// ===== PREMIUM =====
function showPremiumModal() {
    document.getElementById('premium-modal').classList.add('active');
}

function subscribe(plan) {
    const amount = plan === 'monthly' ? 5000 : 12000;
    
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: currentUser ? currentUser.email : 'customer@example.com',
        amount: amount * 100,
        currency: 'NGN',
        ref: 'GLOWUP_PREM_' + Date.now(),
        metadata: {
            plan: plan,
            custom_fields: [
                { display_name: 'Plan', variable_name: 'plan', value: plan }
            ]
        },
        callback: function(response) {
            isPremium = true;
            localStorage.setItem('glowup_premium', 'true');
            localStorage.setItem('glowup_premium_plan', plan);
            localStorage.setItem('glowup_premium_date', new Date().toISOString());
            
            showToast('Welcome to Premium! Your glow-up journey is unlocked! ✨');
            closeModal('premium-modal');
            updateHeader();
            renderFitness();
            renderPeriod();
            
            const transactions = JSON.parse(localStorage.getItem('glowup_transactions') || '[]');
            transactions.push({
                reference: response.reference,
                plan: plan,
                amount: amount,
                date: new Date().toISOString(),
                status: 'success'
            });
            localStorage.setItem('glowup_transactions', JSON.stringify(transactions));
        },
        onClose: function() {
            showToast('Payment cancelled. Your free features still work! 💕');
        }
    });
    
    handler.openIframe();
}

function checkPremiumStatus() {
    const premiumDate = localStorage.getItem('glowup_premium_date');
    const plan = localStorage.getItem('glowup_premium_plan');
    
    if (premiumDate && isPremium) {
        const start = new Date(premiumDate);
        const now = new Date();
        const months = plan === 'quarterly' ? 3 : 1;
        const expiry = new Date(start);
        expiry.setMonth(expiry.getMonth() + months);
        
        if (now > expiry) {
            isPremium = false;
            localStorage.removeItem('glowup_premium');
            showToast('Your premium plan has expired. Please renew to continue! 💕');
            updateHeader();
        }
    }
}

// ===== ADMIN DASHBOARD =====
let adminClickCount = 0;
let adminClickTimer = null;

function handleAdminTrigger() {
    adminClickCount++;
    if (!adminClickTimer) {
        adminClickTimer = setTimeout(() => {
            adminClickCount = 0;
            adminClickTimer = null;
        }, 3000);
    }
    
    if (adminClickCount >= 3) {
        adminClickCount = 0;
        clearTimeout(adminClickTimer);
        adminClickTimer = null;
        document.getElementById('admin-login-modal').classList.add('active');
    }
}

function adminLogin() {
    const email = document.getElementById('admin-email').value;
    const code = document.getElementById('admin-code').value;
    
    if (email === 'nifemiabioye59@gmail.com' && code === 'jojoh$28crude$') {
        adminAuthenticated = true;
        closeModal('admin-login-modal');
        showAdminDashboard();
    } else {
        showToast('Invalid admin credentials! 🔒');
    }
}

function showAdminDashboard() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('admin-dashboard').classList.add('active');
    document.querySelector('.bottom-nav').style.display = 'none';
    
    const users = JSON.parse(localStorage.getItem('glowup_users') || '[]');
    document.getElementById('admin-users').textContent = users.length;
    document.getElementById('admin-products').textContent = products.length;
    
    const pending = products.filter(p => !p.approved);
    document.getElementById('admin-pending').textContent = pending.length;
    
    const transactions = JSON.parse(localStorage.getItem('glowup_transactions') || '[]');
    const revenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    document.getElementById('admin-revenue').textContent = '₦' + revenue.toLocaleString();
    
    const pendingList = document.getElementById('pending-products');
    pendingList.innerHTML = '';
    if (pending.length === 0) {
        pendingList.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px;">No pending products 🎉</p>';
    }
    pending.forEach(p => {
        const div = document.createElement('div');
        div.className = 'pending-item';
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="pending-info">
                <h4>${p.name}</h4>
                <p>₦${p.price.toLocaleString()} • ${p.seller}</p>
            </div>
            <div class="approve-btns">
                <button class="approve" onclick="approveProduct(${p.id})">Approve</button>
                <button class="reject" onclick="rejectProduct(${p.id})">Reject</button>
            </div>
        `;
        pendingList.appendChild(div);
    });
    
    const allList = document.getElementById('admin-all-products');
    allList.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'admin-product-item';
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="admin-product-info">
                <h4>${p.name}</h4>
                <p>₦${p.price.toLocaleString()} • ${p.seller} • ${p.approved ? '✅ Approved' : '⏳ Pending'}</p>
            </div>
        `;
        allList.appendChild(div);
    });
}

function approveProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.approved = true;
        localStorage.setItem('glowup_products', JSON.stringify(products));
        showToast('Product approved! ✅');
        showAdminDashboard();
    }
}

function rejectProduct(id) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('glowup_products', JSON.stringify(products));
    showToast('Product rejected ❌');
    showAdminDashboard();
}

function logoutAdmin() {
    adminAuthenticated = false;
    document.querySelector('.bottom-nav').style.display = 'flex';
    showMainApp();
}

// ===== MODAL HELPERS =====
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
        e.target.classList.remove('active');
    }
});

// ===== TOAST =====
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== MEAL REMINDERS (Auto) =====
function setupMealReminders() {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours === 8 && !mealStatus.breakfast) {
        showToast('Good morning! Have you eaten breakfast? 🌅 Check the Food tab!');
    }
    if (hours === 13 && !mealStatus.lunch) {
        showToast('Lunch time! Don\'t skip your meal 🌞 Check the Food tab!');
    }
    if (hours === 19 && !mealStatus.dinner) {
        showToast('Dinner time! Eat something healthy 🌙 Check the Food tab!');
    }
}

// ===== PERIOD REMINDERS =====
function checkPeriodReminders() {
    if (!periodData.nextPeriod) return;
    
    const nextPeriod = new Date(periodData.nextPeriod);
    const now = new Date();
    const daysUntil = Math.ceil((nextPeriod - now) / (1000 * 60 * 60 * 24));
    
    if (periodData.remind3days && daysUntil === 3) {
        showToast('🌸 Period reminder: Your period is coming in 3 days!');
    }
    if (periodData.remindStart && daysUntil === 0) {
        showToast('🌸 Your period is expected today. Take care of yourself!');
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        const profiles = JSON.parse(localStorage.getItem('glowup_profiles') || '{}');
        userProfile = profiles[currentUser.id] || {};
        
        if (Object.keys(userProfile).length === 0) {
            showScreen('onboarding-screen');
        } else {
            showMainApp();
        }
    } else {
        showScreen('auth-screen');
    }
    
    setupMealReminders();
    checkPeriodReminders();
    checkPremiumStatus();
    
    setInterval(checkPremiumStatus, 1000 * 60 * 60 * 24);
    setInterval(setupMealReminders, 1000 * 60 * 60);
});

document.addEventListener('backbutton', function(e) {
    if (document.querySelector('.modal.active')) {
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        e.preventDefault();
    }
}, false);


