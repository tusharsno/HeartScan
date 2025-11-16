"use client";

import { motion } from "framer-motion";
import { HeartPulse, Shield, Zap, Brain, ArrowDown } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

export default function HeroSection() {
  const { theme } = useTheme();

  const features = [
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Machine learning algorithms for accurate predictions",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and never stored",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get risk assessment in seconds",
    },
  ];

  return (
    <section
      className={`relative overflow-hidden min-h-screen flex items-center justify-center px-6 py-24 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#030712] via-[#0a1124] to-[#050910]"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* === Decorative Animated Background Orbs === */}
      {/* Deep Blue Orb (Left) */}
      <motion.div
        animate={{ x: [0, 80, -40, 0], y: [0, -40, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-32 w-[45rem] h-[45rem] rounded-full bg-blue-800/20 blur-[180px]"
      />

      {/* Cyan Tech Glow Orb (Right) */}
      <motion.div
        animate={{ x: [0, -60, 30, 0], y: [0, 50, -40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-56 right-10 w-[38rem] h-[38rem] rounded-full bg-cyan-500/20 blur-[170px]"
      />

      {/* === Spotlight overlay === */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/10 to-black/40" />

      <div className="relative max-w-6xl mx-auto text-center z-10">
        {/* === Logo & Title === */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-center gap-4 mb-8"
          >
            <div
              className={`p-5 rounded-2xl shadow-2xl ${
                theme === "dark"
                  ? "bg-red-500/20 border border-red-500/30"
                  : "bg-red-100 border border-red-200"
              }`}
            >
              <HeartPulse size={60} className="text-red-500" />
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                HeartScan Pro
              </h1>
              <p
                className={`text-xl md:text-2xl font-light mt-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Advanced AI-Powered Heart Disease Risk Assessment
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* === Feature Cards === */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15, delay: 0.4 },
            },
          }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                y: -6,
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              className={`p-8 rounded-3xl backdrop-blur-lg border shadow-lg transition-all ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 hover:border-red-500/40 hover:shadow-red-500/20"
                  : "bg-white/60 border-gray-200 hover:border-red-300 hover:shadow-red-500/10"
              }`}
            >
              <div
                className={`p-4 rounded-2xl inline-block mb-4 ${
                  theme === "dark" ? "bg-red-500/20" : "bg-red-100"
                }`}
              >
                <feature.icon size={34} className="text-red-500" />
              </div>
              <h3
                className={`text-2xl font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* === CTA + Arrow Animation === */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-14"
        >
          <p
            className={`text-xl md:text-2xl font-medium mb-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Enter your health parameters below for instant risk assessment
          </p>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex justify-center"
          >
            <ArrowDown
              size={36}
              className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
            />
          </motion.div>
        </motion.div>

        {/* === Stats Bar === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className={`flex flex-wrap justify-center gap-10 py-6 rounded-2xl backdrop-blur-lg ${
            theme === "dark" ? "bg-white/5" : "bg-white/60"
          }`}
        >
          {[
            { value: "99%", label: "Accuracy" },
            { value: "2s", label: "Response Time" },
            { value: "10K+", label: "Analyses" },
            { value: "100%", label: "Secure" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {stat.value}
              </p>
              <p
                className={
                  theme === "dark" ? "text-gray-400" : "text-gray-700"
                }
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
