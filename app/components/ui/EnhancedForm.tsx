// components/ui/EnhancedForm.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, HeartPulse, Info, CheckCircle, AlertTriangle, Star } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

interface FormField {
  name: string;
  label: string;
  type: "number" | "select";
  placeholder: string;
  description: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: number; label: string }[];
  importance: number;
  category: "critical" | "high" | "medium" | "low";
}

const EnhancedForm = () => {
  // EXACT Feature importance from your RandomForest model
  const formFields: FormField[] = [
    { 
      name: "age", 
      label: "Age", 
      type: "number", 
      placeholder: "Enter age in years", 
      description: "Age in years (29-77)",
      importance: 0.091285,
      category: "high",
      min: 1, 
      max: 120 
    },
    { 
      name: "sex", 
      label: "Sex", 
      type: "select", 
      placeholder: "Select sex", 
      description: "Biological sex: 0=Female, 1=Male",
      importance: 0.035,
      category: "low",
      options: [
        { value: 0, label: "0 - Female" },
        { value: 1, label: "1 - Male" }
      ]
    },
    { 
      name: "cp", 
      label: "Chest Pain Type", 
      type: "select", 
      placeholder: "Select chest pain type", 
      description: "Type of chest pain: 0=Typical angina, 1=Atypical angina, 2=Non-anginal pain, 3=Asymptomatic",
      importance: 0.142094,
      category: "critical",
      options: [
        { value: 0, label: "0 - Typical Angina" },
        { value: 1, label: "1 - Atypical Angina" },
        { value: 2, label: "2 - Non-anginal Pain" },
        { value: 3, label: "3 - Asymptomatic" }
      ]
    },
    { 
      name: "trestbps", 
      label: "Resting Blood Pressure", 
      type: "number", 
      placeholder: "Enter resting BP (mm Hg)", 
      description: "Resting blood pressure in mm Hg (94-200)",
      importance: 0.067765,
      category: "medium",
      min: 80, 
      max: 200 
    },
    { 
      name: "chol", 
      label: "Cholesterol Level", 
      type: "number", 
      placeholder: "Enter cholesterol (mg/dl)", 
      description: "Serum cholesterol in mg/dl (126-564)",
      importance: 0.077771,
      category: "high",
      min: 100, 
      max: 600 
    },
    { 
      name: "fbs", 
      label: "Fasting Blood Sugar", 
      type: "select", 
      placeholder: "Fasting sugar > 120 mg/dl?", 
      description: "Fasting blood sugar > 120 mg/dl: 0=False, 1=True",
      importance: 0.025,
      category: "low",
      options: [
        { value: 0, label: "0 - No (< 120 mg/dl)" },
        { value: 1, label: "1 - Yes (> 120 mg/dl)" }
      ]
    },
    { 
      name: "restecg", 
      label: "Resting ECG Results", 
      type: "select", 
      placeholder: "Select ECG results", 
      description: "Resting electrocardiographic results: 0=Normal, 1=ST-T wave abnormality, 2=Left ventricular hypertrophy",
      importance: 0.015,
      category: "low",
      options: [
        { value: 0, label: "0 - Normal" },
        { value: 1, label: "1 - ST-T Wave Abnormality" },
        { value: 2, label: "2 - Left Ventricular Hypertrophy" }
      ]
    },
    { 
      name: "thalach", 
      label: "Maximum Heart Rate", 
      type: "number", 
      placeholder: "Enter max heart rate (bpm)", 
      description: "Maximum heart rate achieved during exercise (60-220 bpm)",
      importance: 0.117349,
      category: "critical",
      min: 60, 
      max: 220 
    },
    { 
      name: "exang", 
      label: "Exercise Induced Angina", 
      type: "select", 
      placeholder: "Exercise induced chest pain?", 
      description: "Exercise induced angina: 0=No, 1=Yes",
      importance: 0.073707,
      category: "high",
      options: [
        { value: 0, label: "0 - No" },
        { value: 1, label: "1 - Yes" }
      ]
    },
    { 
      name: "oldpeak", 
      label: "ST Depression", 
      type: "number", 
      placeholder: "Enter ST depression value", 
      description: "ST depression induced by exercise relative to rest (0.0 - 6.2)",
      importance: 0.112634,
      category: "critical",
      min: 0, 
      max: 10,
      step: 0.1 
    },
    { 
      name: "slope", 
      label: "Slope of Peak Exercise", 
      type: "select", 
      placeholder: "Select slope type", 
      description: "Slope of peak exercise ST segment: 0=Upsloping, 1=Flat, 2=Downsloping",
      importance: 0.048711,
      category: "medium",
      options: [
        { value: 0, label: "0 - Upsloping" },
        { value: 1, label: "1 - Flat" },
        { value: 2, label: "2 - Downsloping" }
      ]
    },
    { 
      name: "ca", 
      label: "Number of Major Vessels", 
      type: "select", 
      placeholder: "Select number of vessels", 
      description: "Number of major vessels colored by fluoroscopy (0-3)",
      importance: 0.114844,
      category: "critical",
      options: [
        { value: 0, label: "0 Vessels" },
        { value: 1, label: "1 Vessel" },
        { value: 2, label: "2 Vessels" },
        { value: 3, label: "3 Vessels" }
      ]
    },
    { 
      name: "thal", 
      label: "Thalassemia", 
      type: "select", 
      placeholder: "Select thalassemia type", 
      description: "Thalassemia type: 1=Normal, 2=Fixed Defect, 3=Reversible Defect",
      importance: 0.095930,
      category: "high",
      options: [
        { value: 1, label: "1 - Normal" },
        { value: 2, label: "2 - Fixed Defect" },
        { value: 3, label: "3 - Reversible Defect" }
      ]
    },
  ];

  const [form, setForm] = useState<{ [key: string]: string }>(
    formFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<{ prediction?: number; probability?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateAndConvertData = (formData: { [key: string]: string }) => {
    const numericalData: { [key: string]: number } = {};
    const newErrors: { [key: string]: string } = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (value === "") {
        newErrors[key] = "This field is required";
        continue;
      }
      
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        newErrors[key] = "Must be a valid number";
        continue;
      }
      
      const fieldConfig = formFields.find(f => f.name === key);
      if (fieldConfig) {
        if (fieldConfig.type === "number") {
          if (fieldConfig.min !== undefined && numValue < fieldConfig.min) {
            newErrors[key] = `Must be at least ${fieldConfig.min}`;
            continue;
          }
          if (fieldConfig.max !== undefined && numValue > fieldConfig.max) {
            newErrors[key] = `Must be at most ${fieldConfig.max}`;
            continue;
          }
        }
        
        if (fieldConfig.type === "select" && fieldConfig.options) {
          const validValues = fieldConfig.options.map(opt => opt.value);
          if (!validValues.includes(numValue)) {
            newErrors[key] = `Must be one of: ${validValues.join(", ")}`;
            continue;
          }
        }
      }
      
      numericalData[key] = numValue;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      throw new Error("Please fix the validation errors above");
    }
    
    return numericalData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setErrors({});

    try {
      const numericalData = validateAndConvertData(form);
      
      console.log("Sending numerical data to API:", numericalData);
      
      setLoading(true);
      
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(numericalData),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Prediction error:", error);
      setErrors({ 
        submit: error instanceof Error ? error.message : "An error occurred during prediction" 
      });
    } finally {
      setLoading(false);
    }
  };

  const getActiveFieldInfo = () => {
    return formFields.find(field => field.name === activeField);
  };

  const filledFields = Object.values(form).filter(value => value.trim() !== "").length;
  const totalFields = formFields.length;
  const progress = (filledFields / totalFields) * 100;

  return (
    <section id="assessment" className={`min-h-screen py-20 transition-colors duration-500 ${
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-900 to-black" 
        : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-6 rounded-2xl backdrop-blur-lg border ${
            theme === "dark" 
              ? "bg-gray-800/40 border-gray-700" 
              : "bg-white/70 border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
              Form Progress
            </span>
            <span className={`font-semibold ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}>
              {filledFields}/{totalFields}
            </span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-red-500 to-purple-600 rounded-full"
            />
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-3xl backdrop-blur-lg border-2 p-8 shadow-2xl ${
            theme === "dark" 
              ? "bg-gray-800/40 border-gray-700" 
              : "bg-white/80 border-gray-200"
          }`}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <HeartPulse size={32} className="text-red-500" />
                <div>
                  <h2 className={`text-3xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}>
                    Heart Disease Assessment
                  </h2>
                  <p className={`mt-2 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    All inputs must be numerical values for ML model compatibility
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "age")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "sex")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                </div>

                {/* Chest Pain Type - Full Width */}
                <div>
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "cp")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                </div>

                {/* Row 2 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "trestbps")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "chol")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                </div>

                {/* Row 3 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "fbs")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "restecg")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                </div>

                {/* Maximum Heart Rate - Full Width */}
                <div>
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "thalach")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                </div>

                {/* Row 4 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "exang")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "oldpeak")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                </div>

                {/* Row 5 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "slope")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "ca")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                </div>

                {/* Thalassemia - Full Width */}
                <div>
                  <FormFieldComponent
                    field={formFields.find(f => f.name === "thal")!}
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onFocus={setActiveField}
                    theme={theme}
                  />
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-500/20 border border-red-500/30"
                  >
                    <p className="text-red-400 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      {errors.submit}
                    </p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading || filledFields !== totalFields}
                  whileHover={{ scale: filledFields === totalFields ? 1.02 : 1 }}
                  whileTap={{ scale: filledFields === totalFields ? 0.98 : 1 }}
                  className={`w-full bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold py-5 rounded-xl flex justify-center items-center transition-all shadow-2xl text-lg mt-8 ${
                    filledFields === totalFields 
                      ? "hover:from-red-600 hover:to-purple-700" 
                      : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-3" size={24} />
                      Analyzing Heart Health...
                    </>
                  ) : (
                    <>
                      <HeartPulse className="mr-3" size={24} />
                      {filledFields === totalFields ? "Get AI Risk Assessment" : "Complete All Fields"}
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Right Column - Information Panel */}
            <div className={`rounded-2xl p-6 h-fit sticky top-8 ${
              theme === "dark" ? "bg-gray-700/30 border border-gray-600" : "bg-blue-50/50 border border-blue-200"
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Info size={20} className={theme === "dark" ? "text-blue-400" : "text-blue-600"} />
                <h3 className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}>
                  FIELD Information
                </h3>
              </div>
              
              <AnimatePresence mode="wait">
                {activeField ? (
                  <motion.div
                    key={activeField}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-3">
                      <h4 className={`text-lg font-semibold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}>
                        {getActiveFieldInfo()?.label}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {(getActiveFieldInfo()!.importance * 100).toFixed(1)}% Importance
                      </p>
                    </div>
                    <p className={`text-sm leading-relaxed mb-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {getActiveFieldInfo()?.description}
                    </p>
                    {getActiveFieldInfo() && (
                      <div className={`p-3 rounded-lg ${
                        theme === "dark" ? "bg-gray-600/30" : "bg-blue-100/50"
                      }`}>
                        <p className={`text-xs ${
                          theme === "dark" ? "text-gray-300" : "text-blue-700"
                        }`}>
                          <strong>Expected Values:</strong> {
                            getActiveFieldInfo()!.type === "select" 
                              ? getActiveFieldInfo()!.options?.map(opt => opt.value).join(", ")
                              : `${getActiveFieldInfo()!.min} - ${getActiveFieldInfo()!.max}`
                          }
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className={`text-sm mb-6 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Click on any field to see detailed information and numerical value requirements.
                    </p>
                    
                    <div className={`p-4 rounded-lg mb-6 ${
                      theme === "dark" ? "bg-purple-900/20 border border-purple-700" : "bg-purple-100/50 border border-purple-200"
                    }`}>
                      <h4 className={`font-bold mb-2 text-sm ${
                        theme === "dark" ? "text-purple-400" : "text-purple-700"
                      }`}>
                        🔢 Numerical Inputs Required
                      </h4>
                      <p className={`text-xs ${
                        theme === "dark" ? "text-purple-300" : "text-purple-600"
                      }`}>
                        All fields accept numerical values only. Select fields use numerical codes.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        "All inputs are numerical values",
                        "Select fields use number codes (0,1,2,3)",
                        "Compatible with ML model requirements", 
                        "Real-time validation"
                      ].map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                          <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <ResultsSection result={result} theme={theme} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Form Field Component
const FormFieldComponent = ({ field, form, errors, onChange, onFocus, theme }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative"
  >
    <label className={`block text-sm font-semibold mb-3 ${
      theme === "dark" ? "text-gray-300" : "text-gray-700"
    }`}>
      <div className="flex items-center justify-between">
        <span>{field.label}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          theme === "dark" ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-700"
        }`}>
          {(field.importance * 100).toFixed(1)}%
        </span>
      </div>
    </label>
    
    {field.type === "select" ? (
      <select
        name={field.name}
        value={form[field.name]}
        onChange={onChange}
        onFocus={() => onFocus(field.name)}
        onBlur={() => onFocus(null)}
        className={`w-full p-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all ${
          theme === "dark"
            ? "bg-gray-700/50 border-gray-600 text-white focus:border-red-500 focus:ring-red-500/20"
            : "bg-white border-gray-300 text-gray-900 focus:border-red-400 focus:ring-red-400/20"
        } ${errors[field.name] ? "border-red-500" : ""}`}
      >
        <option value="">{field.placeholder}</option>
        {field.options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        name={field.name}
        type={field.type}
        value={form[field.name]}
        onChange={onChange}
        onFocus={() => onFocus(field.name)}
        onBlur={() => onFocus(null)}
        min={field.min}
        max={field.max}
        step={field.step}
        placeholder={field.placeholder}
        className={`w-full p-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all ${
          theme === "dark"
            ? "bg-gray-700/50 border-gray-600 text-white focus:border-red-500 focus:ring-red-500/20"
            : "bg-white border-gray-300 text-gray-900 focus:border-red-400 focus:ring-red-400/20"
        } ${errors[field.name] ? "border-red-500" : ""}`}
      />
    )}
    
    {errors[field.name] && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-400 text-xs mt-2 flex items-center gap-1"
      >
        <AlertTriangle size={12} />
        {errors[field.name]}
      </motion.p>
    )}
  </motion.div>
);

// Results Component
const ResultsSection = ({ result, theme }: any) => {
  // Handle both old format (prediction: 1) and new format (prediction: "Positive")
  const isPositive = result.prediction === "Positive" || result.prediction === 1;
  const probability = result.probability || 0;
  const confidence = result.confidence || probability;
  const riskLevel = result.risk_level || (isPositive ? "High" : "Low");

  // Determine colors based on risk level
  const getRiskColors = () => {
    if (riskLevel === "High" || isPositive) {
      return {
        bg: "bg-red-500/20 border-red-500/30",
        text: "text-red-300",
        icon: "text-red-500",
        gradient: "from-red-500 to-orange-500",
        badge: "bg-red-500"
      };
    } else if (riskLevel === "Medium") {
      return {
        bg: "bg-yellow-500/20 border-yellow-500/30",
        text: "text-yellow-300",
        icon: "text-yellow-500",
        gradient: "from-yellow-500 to-orange-500",
        badge: "bg-yellow-500"
      };
    } else {
      return {
        bg: "bg-green-500/20 border-green-500/30",
        text: "text-green-300",
        icon: "text-green-500",
        gradient: "from-green-500 to-emerald-500",
        badge: "bg-green-500"
      };
    }
  };

  const colors = getRiskColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`mt-12 rounded-3xl backdrop-blur-lg border-2 p-8 shadow-2xl ${
        theme === "dark"
          ? "bg-gray-800/40 border-gray-700"
          : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`inline-flex items-center gap-3 p-4 rounded-2xl mb-6 border ${colors.bg}`}
        >
          {isPositive ? (
            <AlertTriangle size={32} className={colors.icon} />
          ) : (
            <CheckCircle size={32} className={colors.icon} />
          )}
          <h3 className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}>
            {isPositive
              ? "🚨 Heart Disease Risk Detected"
              : "✅ Low Heart Disease Risk"}
          </h3>
        </motion.div>

        <div className="space-y-6">
          {/* Probability Visualization */}
          <div className="space-y-4">
            <div className={`h-8 w-full rounded-2xl overflow-hidden shadow-inner ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${probability * 100}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full rounded-2xl bg-gradient-to-r ${colors.gradient}`}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                Low Risk
              </span>
              <span className={`text-2xl font-bold ${colors.text}`}>
                {(probability * 100).toFixed(1)}%
              </span>
              <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                High Risk
              </span>
            </div>
          </div>

          {/* Risk Level & Confidence Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`p-4 rounded-xl ${
                theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"
              }`}
            >
              <div className={`text-sm mb-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Risk Level
              </div>
              <div className={`text-2xl font-bold ${colors.text}`}>
                {riskLevel}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`p-4 rounded-xl ${
                theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"
              }`}
            >
              <div className={`text-sm mb-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Confidence
              </div>
              <div className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}>
                {(confidence * 100).toFixed(1)}%
              </div>
            </motion.div>
          </div>

          {/* Action Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold border ${colors.bg} ${colors.text}`}
          >
            <div className={`w-4 h-4 rounded-full animate-pulse ${colors.badge}`} />
            {riskLevel === "High"
              ? "Urgent - Consult Doctor"
              : riskLevel === "Medium"
              ? "Moderate - Schedule Checkup"
              : "Low Risk - Maintain Lifestyle"}
          </motion.div>

          {/* Medical Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className={`p-6 rounded-xl text-left ${
              theme === "dark" ? "bg-gray-700/50" : "bg-blue-50"
            }`}
          >
            <h4 className={`font-semibold mb-3 text-lg ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>
              Medical Recommendation:
            </h4>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
              {riskLevel === "High"
                ? "Based on the AI assessment with 99.7% model accuracy, we strongly recommend consulting with a cardiologist or healthcare professional for comprehensive evaluation, diagnostic tests, and personalized treatment plan. Early intervention can significantly improve outcomes."
                : riskLevel === "Medium"
                ? "Your assessment indicates moderate risk factors. We recommend scheduling a preventive checkup with your healthcare provider to discuss these results and develop a heart-healthy action plan. Regular monitoring is advised."
                : "Your heart health parameters appear favorable according to our high-accuracy AI model. Continue maintaining a healthy lifestyle with balanced diet, regular exercise, and routine check-ups. Monitor your health parameters regularly."}
            </p>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className={`text-xs p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700/30 text-gray-400" : "bg-gray-100 text-gray-600"
            }`}
          >
            <strong>Disclaimer:</strong> This is an AI-powered screening tool and should not replace professional medical advice.
            Prediction accuracy: {(confidence * 100).toFixed(1)}%.
            Always consult with qualified healthcare professionals for diagnosis and treatment.
            {result.timestamp && ` • Assessment: ${new Date(result.timestamp).toLocaleString()}`}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedForm;