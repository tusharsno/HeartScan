// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Loader2, HeartPulse, Moon, Sun } from "lucide-react";

// const Form = () => {
//   const fields = [
//     "age", "sex", "cp", "trestbps", "chol",
//     "fbs", "restecg", "thalach", "exang",
//     "oldpeak", "slope", "ca", "thal"
//   ];

//   const [form, setForm] = useState(
//     fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
//   );
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [result, setResult] = useState<{ prediction?: number; probability?: number } | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(true);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" }); // clear error as user types
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setResult(null);

//     // Validation: show error if empty
//     const newErrors: { [key: string]: string } = {};
//     fields.forEach((field) => {
//       if (!form[field].trim()) newErrors[field] = "⚠ Please fill this field";
//     });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("/api/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       setResult(data);
//     } catch (error) {
//       setResult({ prediction: null, probability: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main
//       className={`min-h-screen flex flex-col items-center justify-center px-6 py-10 transition-colors duration-500 ${
//         darkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       {/* Theme Toggle */}
//       <button
//         onClick={() => setDarkMode(!darkMode)}
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
//         {fields.map((key) => (
//   <div key={key} className="relative flex flex-col">
//     <input
//       name={key}
//       value={(form as any)[key]}
//       onChange={handleChange}
//       className={`
//         peer w-full p-3 rounded-lg border
//         focus:outline-none focus:ring-2 transition-all
//         ${
//           (form as any)[key]
//             ? "ring-green-400/70 shadow-lg bg-gray-700/80 text-white"
//             : "bg-gray-800/70 border-gray-600 text-white"
//         }
//       `}
//     />

//     {/* Label disappears when typing */}
//     {(form as any)[key] === "" && (
//       <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all">
//         {key.toUpperCase()}
//       </label>
//     )}

//     {/* Show error only if this field is empty after submit */}
//     {errors[key] && (
//       <span className="text-red-400 text-sm mt-1">{errors[key]}</span>
//     )}
//   </div>
// ))}


//         <button
//           type="submit"
//           disabled={loading}
//           className="col-span-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-transform hover:scale-105 mt-2"
//         >
//           {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Predict"}
//         </button>
//       </form>

//       {/* Result Card */}
//       {result && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="mt-6 w-full max-w-md p-6 rounded-2xl shadow-lg bg-black/40 text-white text-center"
//         >
//           <p className="text-xl font-bold mb-2">
//             {result.prediction === 1
//               ? "⚠ Heart Disease Detected"
//               : "✅ No Heart Disease Detected"}
//           </p>

//           {result.probability !== undefined && (
//             <>
//               <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden mb-2">
//                 <div
//                   className={`h-full ${
//                     result.prediction === 1 ? "bg-red-500" : "bg-green-500"
//                   }`}
//                   style={{ width: `${(result.probability || 0) * 100}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm text-gray-300">
//                 Probability: {(result.probability! * 100).toFixed(2)}%
//               </p>
//             </>
//           )}

//           {result.prediction === 1 && (
//             <motion.div
//               animate={{ scale: [1, 1.2, 1] }}
//               transition={{ repeat: Infinity, duration: 0.8 }}
//               className="mt-4"
//             >
//               <HeartPulse size={40} className="text-red-500 mx-auto" />
//             </motion.div>
//           )}
//         </motion.div>
//       )}
//     </main>
//   );
// }

// export default Form;



"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, HeartPulse } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

const Form = () => {
  const fields = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalach", "exang",
    "oldpeak", "slope", "ca", "thal"
  ];

  const [form, setForm] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<{ prediction?: number; probability?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const newErrors: { [key: string]: string } = {};
    fields.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = "⚠ Please fill this field";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ prediction: null, probability: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-10 transition-colors duration-500 ${
        theme === "dark" 
          ? "bg-[#0a0a0a] text-white" 
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mb-6"
      >
        <HeartPulse size={40} className="text-red-500" />
        <h1 className="text-3xl font-bold">Heart Disease Prediction</h1>
      </motion.div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl backdrop-blur-md p-6 rounded-2xl shadow-lg border transition-colors ${
          theme === "dark" 
            ? "bg-black/30 border-gray-700" 
            : "bg-white/80 border-gray-200"
        }`}
      >
        {fields.map((key) => (
          <div key={key} className="relative flex flex-col">
            <input
              name={key}
              value={(form as any)[key]}
              onChange={handleChange}
              className={`
                peer w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                ${
                  theme === "dark"
                    ? (form as any)[key]
                      ? "ring-green-400/70 bg-gray-700/80 text-white border-gray-600"
                      : "bg-gray-800/70 border-gray-600 text-white"
                    : (form as any)[key]
                      ? "ring-blue-400/70 bg-white text-gray-900 border-gray-300"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                }
              `}
            />

            {(form as any)[key] === "" && (
              <label className={`absolute left-3 top-3 text-sm transition-all ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                {key.toUpperCase()}
              </label>
            )}

            {errors[key] && (
              <span className="text-red-400 text-sm mt-1">{errors[key]}</span>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="col-span-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-transform hover:scale-105 mt-2"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Predict"}
        </button>
      </form>

      {/* Result Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`mt-6 w-full max-w-md p-6 rounded-2xl shadow-lg text-center ${
            theme === "dark" ? "bg-black/40 text-white" : "bg-white/90 text-gray-900 border border-gray-200"
          }`}
        >
          <p className="text-xl font-bold mb-2">
            {result.prediction === 1
              ? "⚠ Heart Disease Detected"
              : "✅ No Heart Disease Detected"}
          </p>

          {result.probability !== undefined && (
            <>
              <div className={`h-4 w-full rounded-full overflow-hidden mb-2 ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <div
                  className={`h-full ${
                    result.prediction === 1 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${(result.probability || 0) * 100}%` }}
                ></div>
              </div>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}>
                Probability: {(result.probability! * 100).toFixed(2)}%
              </p>
            </>
          )}

          {result.prediction === 1 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="mt-4"
            >
              <HeartPulse size={40} className="text-red-500 mx-auto" />
            </motion.div>
          )}
        </motion.div>
      )}
    </main>
  );
}

export default Form;