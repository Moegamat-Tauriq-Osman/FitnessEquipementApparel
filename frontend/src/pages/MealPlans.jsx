import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FitnessHub = () => {
    const [meals, setMeals] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [workoutRoutines, setWorkoutRoutines] = useState([]);
    const [fitnessTips, setFitnessTips] = useState([]);
    const [loading, setLoading] = useState({
        meals: true,
        exercises: true,
        workouts: true,
        tips: true
    });
    const [activeTab, setActiveTab] = useState('meals');

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const categories = ['Seafood', 'Vegetarian', 'Chicken', 'Beef', 'Breakfast'];
                const allMeals = [];

                for (const category of categories) {
                    const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
                    if (res.data.meals) {
                        const mealDetails = await Promise.all(
                            res.data.meals.slice(0, 2).map(meal =>
                                axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                            )
                        );
                        mealDetails.forEach(detail => {
                            if (detail.data.meals) {
                                allMeals.push(detail.data.meals[0]);
                            }
                        });
                    }
                }
                setMeals(allMeals.slice(0, 12));
            } catch (err) {
                console.error('Error fetching meals:', err);
            } finally {
                setLoading(prev => ({ ...prev, meals: false }));
            }
        };

        fetchMeals();
    }, []);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const categories = [8, 9, 10, 11, 12, 13];
                const allExercises = [];

                for (const category of categories) {
                    const res = await axios.get(`https://wger.de/api/v2/exercise/?language=2&category=${category}&limit=5`);
                    if (res.data.results) {
                        allExercises.push(...res.data.results);
                    }
                }
                setExercises(allExercises.slice(0, 15));
            } catch (err) {
                console.error('Error fetching exercises:', err);
                setExercises(getFallbackExercises());
            } finally {
                setLoading(prev => ({ ...prev, exercises: false }));
            }
        };

        fetchExercises();
    }, []);

    useEffect(() => {
        const routines = [
            {
                name: "Full Body Strength",
                duration: "45-60 mins",
                level: "Intermediate",
                exercises: [
                    "Barbell Squats: 4 sets x 8-12 reps",
                    "Bench Press: 4 sets x 8-12 reps",
                    "Bent-over Rows: 4 sets x 8-12 reps",
                    "Overhead Press: 3 sets x 10-15 reps",
                    "Romanian Deadlifts: 3 sets x 10-15 reps",
                    "Plank: 3 sets x 60 seconds"
                ],
                focus: "Overall strength and muscle building"
            },
            {
                name: "HIIT Cardio Blast",
                duration: "30 mins",
                level: "Advanced",
                exercises: [
                    "Jump Squats: 45s work, 15s rest",
                    "Mountain Climbers: 45s work, 15s rest",
                    "Burpees: 45s work, 15s rest",
                    "High Knees: 45s work, 15s rest",
                    "Plank Jacks: 45s work, 15s rest",
                    "Rest: 2 minutes between circuits"
                ],
                focus: "Fat burning and cardiovascular endurance"
            },
            {
                name: "Upper Body Focus",
                duration: "50 mins",
                level: "Beginner-Intermediate",
                exercises: [
                    "Push-ups: 3 sets x 10-15 reps",
                    "Dumbbell Rows: 3 sets x 10-12 reps",
                    "Shoulder Press: 3 sets x 10-15 reps",
                    "Bicep Curls: 3 sets x 12-15 reps",
                    "Tricep Dips: 3 sets x 10-15 reps",
                    "Lat Pulldowns: 3 sets x 10-12 reps"
                ],
                focus: "Upper body strength and definition"
            },
            {
                name: "Lower Body Power",
                duration: "40 mins",
                level: "Intermediate",
                exercises: [
                    "Barbell Squats: 4 sets x 6-10 reps",
                    "Deadlifts: 4 sets x 6-8 reps",
                    "Lunges: 3 sets x 10-12 reps per leg",
                    "Leg Press: 3 sets x 10-15 reps",
                    "Calf Raises: 4 sets x 15-20 reps",
                    "Glute Bridges: 3 sets x 12-15 reps"
                ],
                focus: "Leg strength and power development"
            },
            {
                name: "Core & Abs Intensive",
                duration: "25 mins",
                level: "All Levels",
                exercises: [
                    "Russian Twists: 3 sets x 20 reps",
                    "Leg Raises: 3 sets x 15 reps",
                    "Plank: 3 sets x 60-90 seconds",
                    "Bicycle Crunches: 3 sets x 30 reps",
                    "Mountain Climbers: 3 sets x 30 reps",
                    "Flutter Kicks: 3 sets x 30 seconds"
                ],
                focus: "Core strength and abdominal definition"
            },
            {
                name: "Yoga & Flexibility",
                duration: "60 mins",
                level: "All Levels",
                exercises: [
                    "Sun Salutations: 5 rounds",
                    "Warrior Poses: Hold 30 seconds each side",
                    "Downward Dog: 1 minute hold",
                    "Pigeon Pose: 2 minutes per side",
                    "Bridge Pose: 1 minute hold",
                    "Seated Forward Fold: 2 minutes"
                ],
                focus: "Flexibility, mobility, and stress relief"
            }
        ];
        setWorkoutRoutines(routines);
        setLoading(prev => ({ ...prev, workouts: false }));
    }, []);

    useEffect(() => {
        const tips = [
            "Stay hydrated - drink at least 8-10 glasses of water daily, especially before and after workouts.",
            "Prioritize protein intake to support muscle recovery and growth. Aim for 1.6-2.2g per kg of body weight.",
            "Get 7-9 hours of quality sleep nightly - this is when your body repairs and builds muscle.",
            "Incorporate both strength training and cardio for optimal fitness results.",
            "Focus on proper form over heavy weights to prevent injuries and maximize effectiveness.",
            "Allow 48 hours of recovery time for each muscle group between intense workouts.",
            "Track your progress with photos, measurements, and strength improvements - not just scale weight.",
            "Include dynamic stretching before workouts and static stretching after for better flexibility.",
            "Eat a balanced meal with carbs and protein within 2 hours after your workout.",
            "Gradually increase workout intensity using progressive overload principle.",
            "Listen to your body - rest when needed and don't ignore pain signals.",
            "Mix up your routine every 4-6 weeks to prevent plateaus and maintain motivation.",
            "Focus on compound exercises (squats, deadlifts, bench press) for maximum efficiency.",
            "Manage stress through meditation, deep breathing, or light activity on rest days.",
            "Consistency is key - even short, regular workouts are better than occasional long sessions.",
            "Include healthy fats in your diet for hormone production and joint health.",
            "Warm up properly for 5-10 minutes before every workout session.",
            "Stay active throughout the day - take walking breaks if you have a sedentary job.",
            "Set realistic, specific goals and celebrate small victories along the way.",
            "Consider working with a certified trainer to ensure proper technique and programming."
        ];
        setFitnessTips(tips);
        setLoading(prev => ({ ...prev, tips: false }));
    }, []);

    const getFallbackExercises = () => {
        return [
            {
                id: 1,
                name: "Barbell Squats",
                description: "Compound exercise targeting quadriceps, hamstrings, glutes, and core. Keep chest up and back straight throughout movement."
            },
            {
                id: 2,
                name: "Bench Press",
                description: "Upper body compound movement focusing on chest, shoulders, and triceps. Maintain shoulder blades retracted."
            },
            {
                id: 3,
                name: "Deadlifts",
                description: "Full body exercise emphasizing posterior chain. Keep back flat and drive through heels."
            },
            {
                id: 4,
                name: "Pull-ups",
                description: "Upper body pulling exercise targeting back and biceps. Focus on pulling elbows down and back."
            },
            {
                id: 5,
                name: "Overhead Press",
                description: "Shoulder dominant exercise. Keep core tight and press directly overhead."
            },
            {
                id: 6,
                name: "Lunges",
                description: "Unilateral leg exercise improving balance and coordination. Step forward and lower until both knees form 90-degree angles."
            },
            {
                id: 7,
                name: "Plank",
                description: "Core stability exercise. Maintain straight line from head to heels, engaging entire core."
            },
            {
                id: 8,
                name: "Russian Twists",
                description: "Rotational core exercise. Sit at 45-degree angle and rotate torso side to side."
            },
            {
                id: 9,
                name: "Push-ups",
                description: "Bodyweight chest exercise. Maintain straight body line and lower chest to floor."
            },
            {
                id: 10,
                name: "Burpees",
                description: "Full body conditioning exercise combining squat, plank, and jump movements."
            }
        ];
    };

    const getIngredients = (meal) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }
        return ingredients;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4"> Fitness Resources</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Healthy meals, workout routines, exercises, and fitness tips
                    </p>
                </div>

                <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
                    {['meals', 'workouts', 'exercises', 'tips'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-semibold capitalize transition-colors ${activeTab === tab
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'meals' ? ' Healthy Meals' :
                                tab === 'workouts' ? ' Workout Routines' :
                                    tab === 'exercises' ? ' Exercises' : ' Fitness Tips'}
                        </button>
                    ))}
                </div>

                <div className="space-y-12">
                    {activeTab === 'meals' && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center"> Healthy Meal Plans</h2>
                            {loading.meals ? (
                                <LoadingSpinner />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {meals.map((meal) => (
                                        <div key={meal.idMeal} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                            <img
                                                src={meal.strMealThumb}
                                                alt={meal.strMeal}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{meal.strMeal}</h3>
                                                <div className="flex gap-4 mb-3">
                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {meal.strCategory}
                                                    </span>
                                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {meal.strArea}
                                                    </span>
                                                </div>
                                                <div className="mb-4">
                                                    <h4 className="font-semibold text-gray-700 mb-2">Key Ingredients:</h4>
                                                    <div className="text-sm text-gray-600 line-clamp-3">
                                                        {getIngredients(meal).slice(0, 4).join(', ')}...
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm line-clamp-3">
                                                    {meal.strInstructions.slice(0, 150)}...
                                                </p>
                                                <a
                                                    href={meal.strYoutube}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                                >
                                                    Watch Recipe
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'workouts' && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Workout Routines</h2>
                            {loading.workouts ? (
                                <LoadingSpinner />
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {workoutRoutines.map((routine, index) => (
                                        <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-gray-800">{routine.name}</h3>
                                                <div className="flex gap-2">
                                                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {routine.duration}
                                                    </span>
                                                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {routine.level}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mb-4">{routine.focus}</p>
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-gray-700">Exercises:</h4>
                                                {routine.exercises.map((exercise, exIndex) => (
                                                    <div key={exIndex} className="flex items-start text-sm text-gray-700">
                                                        <span className="text-blue-500 mr-2">•</span>
                                                        {exercise}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'exercises' && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center"> Exercise Library</h2>
                            {loading.exercises ? (
                                <LoadingSpinner />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {exercises.map((exercise) => (
                                        <div key={exercise.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                            <h3 className="text-lg font-bold text-gray-800 mb-3">{exercise.name}</h3>
                                            <p className="text-gray-700 text-sm">
                                                {exercise.description
                                                    ? exercise.description.replace(/(<([^>]+)>)/gi, '').slice(0, 200) + '...'
                                                    : 'Professional exercise focusing on proper form and technique for optimal results.'}
                                            </p>
                                            <div className="mt-4 flex gap-2">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                                    Strength
                                                </span>
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                                    Fitness
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'tips' && (
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Fitness & Health Tips</h2>
                            {loading.tips ? (
                                <LoadingSpinner />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {fitnessTips.map((tip, index) => (
                                        <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                            <div className="flex items-start">
                                                <p className="text-gray-700">{tip}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default FitnessHub;