// "use client";
// import { useState } from "react";

// export default function Home() {
//   const [form, setForm] = useState({
//     age: "", sex: "", cp: "", trestbps: "", chol: "",
//     fbs: "", restecg: "", thalach: "", exang: "",
//     oldpeak: "", slope: "", ca: "", thal: ""
//   });

//   const [result, setResult] = useState(null);
//   const API_URL = "http://127.0.0.1:8000/predict";

//   function handleChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     const res = await fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form)
//     });

//     const data = await res.json();
//     setResult(data);
//   }

//   return (
//     <main className="min-h-screen px-4 py-10 flex flex-col items-center justify-start transition-colors duration-300 dark:bg-gray-900 bg-gray-100">
//       <div className="flex justify-end w-full max-w-3xl mb-4">
//         <button
//           onClick={() => document.documentElement.classList.toggle('dark')}
//           className="px-4 py-2 rounded-lg shadow bg-gray-200 dark:bg-gray-800 dark:text-white"
//         >
//           Toggle Mode
//         </button>
//       </div>

//       <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 dark:from-pink-400 dark:to-purple-300">
//         ❤ Heart Disease Prediction
//       </h1>

//       <form onSubmit={handleSubmit} className="backdrop-blur-lg bg-white/40 dark:bg-white/10 shadow-xl p-6 rounded-2xl w-full max-w-3xl grid md:grid-cols-2 gap-4 border border-white/20">
//         {Object.keys(form).map((key) => (
//           <input
//             key={key}
//             name={key}
//             placeholder={key}
//             value={form[key]}
//             onChange={handleChange}
//             className="p-3 rounded-xl bg-white/40 dark:bg-white/20 shadow-inner border border-white/30 focus:ring-2 focus:ring-purple-400 outline-none dark:text-white"
//             required
//           />
//         ))}

//         <button className="md:col-span-2 mt-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition shadow-lg">
//           Predict
//         </button>
//       </form>

//       {result && (
//         <div className="mt-8 backdrop-blur-lg bg-white/40 dark:bg-white/10 p-6 rounded-2xl shadow-xl border border-white/20 text-center w-full max-w-md animate-fade-in">
//           <p className="text-2xl font-bold dark:text-white">
//             {result.prediction === 1 ? "⚠ Heart Disease Detected" : "✅ No Heart Disease"}
//           </p>
//           <p className="mt-2 text-gray-700 dark:text-gray-300">
//             Probability: {(result.probability * 100).toFixed(2)}%
//           </p>
//         </div>
//       )}
//     </main>
//   );
// }




// "use client";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2, HeartPulse, Moon, Sun } from "lucide-react";

// export default function Home() {
//   const [form, setForm] = useState({
//     age: "", sex: "", cp: "", trestbps: "", chol: "",
//     fbs: "", restecg: "", thalach: "", exang: "",
//     oldpeak: "", slope: "", ca: "", thal: ""
//   });

//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [error, setError] = useState(null);

//   const API_URL = "http://127.0.0.1:8000/predict";

//   useEffect(() => {
//     if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
//       setDarkMode(true);
//       document.documentElement.classList.add("dark");
//     }
//   }, []);

//   const toggleTheme = () => {
//     document.documentElement.classList.toggle("dark");
//     setDarkMode(!darkMode);
//   };

//   function handleChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     setResult(null);

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form)
//       });

//       if (!res.ok) throw new Error("Failed to fetch prediction.");
//       const data = await res.json();
//       setResult(data);
//     } catch (err) {
//       setError("Server Error! Please check backend connection.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="min-h-screen px-6 py-10 flex flex-col items-center justify-start transition-colors duration-300 dark:bg-gray-900 bg-gray-50">
//       {/* Theme Toggle */}
//       <div className="flex justify-end w-full max-w-3xl mb-6">
//         <button
//           onClick={toggleTheme}
//           className="flex items-center gap-2 px-4 py-2 rounded-xl shadow bg-gray-200 dark:bg-gray-800 dark:text-white hover:scale-105 transition-transform"
//         >
//           {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//           {darkMode ? "Light Mode" : "Dark Mode"}
//         </button>
//       </div>

//       {/* Header */}
//       <motion.h1
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-violet-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-300"
//       >
//         <span className="inline-flex items-center gap-2">
//           <HeartPulse className="text-pink-500 animate-pulse" size={38} />
//           Heart Disease Predictor
//         </span>
//       </motion.h1>

//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="backdrop-blur-xl bg-white/50 dark:bg-white/10 shadow-2xl p-8 rounded-3xl w-full max-w-3xl grid md:grid-cols-2 gap-5 border border-white/20"
//       >
//         {Object.keys(form).map((key) => (
//           <div key={key} className="relative">
//             <input
//               type="text"
//               name={key}
//               value={form[key]}
//               onChange={handleChange}
//               className="peer w-full p-3 rounded-xl bg-white/40 dark:bg-white/20 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-pink-400 outline-none dark:text-white"
//               placeholder=" "
//               required
//             />
//             <label
//               className="absolute left-3 top-3 text-gray-500 dark:text-gray-300 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-pink-500"
//             >
//               {key.toUpperCase()}
//             </label>
//           </div>
//         ))}

//         <button
//           type="submit"
//           disabled={loading}
//           className="md:col-span-2 mt-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-all shadow-lg flex justify-center items-center gap-2"
//         >
//           {loading ? <Loader2 className="animate-spin" size={20} /> : "Predict"}
//         </button>
//       </form>

//       {/* Result */}
//       <AnimatePresence>
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             className="mt-8 bg-red-500/20 border border-red-400/40 text-red-800 dark:text-red-300 p-4 rounded-xl text-center max-w-md"
//           >
//             {error}
//           </motion.div>
//         )}

//         {result && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             className="mt-10 backdrop-blur-xl bg-white/50 dark:bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center w-full max-w-md"
//           >
//             <p className="text-2xl font-bold dark:text-white">
//               {result.prediction === 1
//                 ? "⚠️ Heart Disease Detected"
//                 : "✅ No Heart Disease Found"}
//             </p>
//             <p className="mt-3 text-gray-700 dark:text-gray-300">
//               Probability: <span className="font-semibold">
//                 {(result.probability * 100).toFixed(2)}%
//               </span>
//             </p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2, HeartPulse, Moon, Sun } from "lucide-react";

// export default function Home() {
//   const [form, setForm] = useState({
//     age: "",
//     sex: "",
//     cp: "",
//     trestbps: "",
//     chol: "",
//     fbs: "",
//     restecg: "",
//     thalach: "",
//     exang: "",
//     oldpeak: "",
//     slope: "",
//     ca: "",
//     thal: ""
//   });

//   const [result, setResult] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(true);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setResult(null);

//     try {
//       const res = await fetch("/api/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form)
//       });

//       const data = await res.json();
//       setResult(data.result);
//     } catch (error) {
//       setResult("Error occurred while predicting.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🌙 Toggle Theme
//   const toggleTheme = () => setDarkMode(!darkMode);

//   return (
//     <main
//       className={`min-h-screen flex flex-col items-center justify-center px-6 py-10 transition-colors duration-500 ${
//         darkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       {/* Theme Toggle */}
//       <button
//         onClick={toggleTheme}
//         className="absolute top-5 right-5 p-2 rounded-full border border-gray-600 hover:scale-105 transition-transform"
//       >
//         {darkMode ? <Sun size={22} /> : <Moon size={22} />}
//       </button>

//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="flex items-center gap-3 mb-6"
//       >
//         <HeartPulse size={40} className="text-red-500" />
//         <h1 className="text-3xl font-semibold">Heart Disease Prediction</h1>
//       </motion.div>

//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl bg-black/30 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700"
//       >
//         {Object.keys(form).map((key) => (
//           <input
//             key={key}
//             name={key}
//             placeholder={key.toUpperCase()}
//             value={(form as any)[key]}
//             onChange={handleChange}
//             className="p-3 rounded-lg bg-gray-800/70 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
//           />
//         ))}

//         <button
//           type="submit"
//           disabled={loading}
//           className="col-span-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-all"
//         >
//           {loading ? (
//             <Loader2 className="animate-spin mr-2" size={20} />
//           ) : (
//             "Predict"
//           )}
//         </button>
//       </form>

//       {/* Result Animation */}
//       <AnimatePresence>
//         {result && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.4 }}
//             className="mt-6 text-xl font-medium"
//           >
//             {result}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }



// import { ThemeProvider } from "next-themes";
// import Form from "./components/ui/Form";

// export default function Home() {
//   return (
//     <div className="">
//       {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}> */}
//         <Form />
//       {/* </ThemeProvider> */}
//     </div>
//   );
// }


// import Form from "./components/ui/Form";
// import ThemeToggle from "./components/ui/ThemeToggle";
// import HeroSection from "./components/ui/HeroSection";
// import EnhancedForm from "./components/ui/EnhancedForm";

// export default function Home() {
//   return (
//     <div className="relative">
//       <ThemeToggle />
//       <HeroSection />
//       <EnhancedForm />
//       <Form />
//     </div>
//   );
// }

// app/page.tsx
import HeroSection from "./components/ui/HeroSection";
import EnhancedForm from "./components/ui/EnhancedForm";
import ThemeToggle from "./components/ui/ThemeToggle";

export default function Home() {
  return (
    <div className="relative">
      <ThemeToggle />
      <HeroSection />
      <EnhancedForm />
    </div>
  );
}