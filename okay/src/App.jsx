import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sun, Moon, Monitor } from "lucide-react";
import MurfAIHome from "./Home";
import ExplorePage from "./Explore.jsx";
import Voice from "./Voice.jsx";
export default function App() {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme;
        }
        // Detect system theme
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    const [systemTheme, setSystemTheme] = useState(() => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleSystemThemeChange = (e) => {
            setSystemTheme(e.matches ? "dark" : "light");
            // If user hasn't manually set a theme, follow system
            if (!localStorage.getItem("theme")) {
                setTheme(e.matches ? "dark" : "light");
            }
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const resetToSystemTheme = () => {
        localStorage.removeItem("theme");
        setTheme(systemTheme);
    };

    return (
        <Router>
            <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                {/* Theme Toggle Button */}
                <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
                    {/* Main Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`group relative p-4 rounded-2xl transition-all duration-500 backdrop-blur-xl border hover:scale-110 hover:-translate-y-1 active:scale-95 ${
                            theme === "dark"
                                ? "bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/20"
                                : "bg-black/5 border-black/10 hover:border-black/30 hover:bg-black/10"
                        }`}
                        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    >
                        <div className="relative w-6 h-6">
                            {/* Sun Icon */}
                            <Sun
                                className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
                                    theme === "dark"
                                        ? "opacity-0 rotate-90 scale-0"
                                        : "opacity-100 rotate-0 scale-100 text-amber-500"
                                }`}
                            />
                            {/* Moon Icon */}
                            <Moon
                                className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
                                    theme === "dark"
                                        ? "opacity-100 rotate-0 scale-100 text-blue-300"
                                        : "opacity-0 -rotate-90 scale-0"
                                }`}
                            />
                        </div>

                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                            theme === "dark" ? "bg-white/5" : "bg-black/5"
                        }`} />
                    </button>

                    {/* System Theme Indicator & Reset */}
                    <button
                        onClick={resetToSystemTheme}
                        className={`group relative p-2 rounded-xl transition-all duration-500 backdrop-blur-xl border text-xs font-medium hover:scale-105 active:scale-95 ${
                            theme === systemTheme
                                ? (theme === "dark"
                                    ? "bg-white/20 border-white/30 text-white/80"
                                    : "bg-black/10 border-black/20 text-black/80")
                                : (theme === "dark"
                                    ? "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20"
                                    : "bg-black/5 border-black/10 text-black/50 hover:bg-black/10 hover:border-black/20")
                        }`}
                        title={`System theme: ${systemTheme}. Click to sync with system`}
                    >
                        <div className="flex items-center gap-1.5 px-2 py-1">
                            <Monitor className="w-3 h-3" />
                            <span className="capitalize">{systemTheme}</span>
                            {theme === systemTheme && (
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                    theme === "dark" ? "bg-white/60" : "bg-black/60"
                                }`} />
                            )}
                        </div>
                    </button>
                </div>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<MurfAIHome theme={theme} />} />
                    <Route path="/explore" element={<ExplorePage theme={theme} />} />
                    <Route path="/voice" element={<Voice theme={theme} />} />
                </Routes>
            </div>
        </Router>
    );
}