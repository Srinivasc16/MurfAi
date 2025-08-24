import React, { useState, useEffect } from "react";
import { Newspaper, Mic, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function ExplorePage({ theme = 'light' }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const isDark = theme === 'dark';

    const features = [
        {
            title: "Voice News Reader",
            subtitle: "Stay Informed",
            description: "Experience news like never before with AI-powered voice synthesis that brings headlines to life with natural, engaging narration.",
            icon: <Newspaper className="w-8 h-8" />,
            buttonText: "Start Reading",
            navLink:"voicenews",
            onClick: () => navigate("/voice"),
        },
        {
            title: "Real-time Translator",
            subtitle: "Break Barriers",
            description: "Speak naturally and watch language barriers disappear with instant, high-quality voice translation powered by advanced AI.",
            icon: <Mic className="w-8 h-8" />,
            buttonText: "Begin Translation",
            navLink:"translation",
            onClick: () => navigate("/translation"),
        },
        {
            title: "AI Storyteller",
            subtitle: "Unleash Imagination",
            description: "Transform your ideas into captivating stories with AI creativity and bring them to life through beautiful voice narration.",
            icon: <BookOpen className="w-8 h-8" />,
            buttonText: "Create Story",
            navLink:"create-story",
            onClick: () => navigate("/story"),
        },
    ];

    return (
        <div className={`h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} relative overflow-hidden flex items-center justify-center`}>
            {/* Floating mouse effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className={`absolute w-96 h-96 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} blur-3xl transition-all duration-1000 ease-out`}
                    style={{
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                    }}
                />
                {/* Floating particles */}
                <div className={`absolute top-20 left-20 w-2 h-2 ${isDark ? 'bg-white/20' : 'bg-black/20'} rounded-full animate-pulse`} />
                <div className={`absolute top-40 right-32 w-1 h-1 ${isDark ? 'bg-white/30' : 'bg-black/30'} rounded-full animate-bounce`} />
                <div className={`absolute bottom-32 left-1/4 w-1.5 h-1.5 ${isDark ? 'bg-white/20' : 'bg-black/20'} rounded-full animate-ping`} />
            </div>

            <div className="relative z-10 container mx-auto px-8 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-white/10' : 'bg-black/5'} rounded-full px-6 py-2 mb-8 backdrop-blur-sm`}>
                        <Sparkles className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-black/60'}`} />
                        <span className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-black/80'} tracking-wide`}>
                            POWERED BY MURF AI
                        </span>
                    </div>

                    <h1 className={`text-8xl md:text-9xl font-black ${isDark ? 'text-white' : 'text-black'} mb-6 tracking-tighter leading-none`}>
                        Explore
                    </h1>

                    <p className={`text-xl md:text-2xl ${isDark ? 'text-white/60' : 'text-black/60'} max-w-2xl mx-auto leading-relaxed font-light`}>
                        Discover the future of voice technology with our cutting-edge AI features
                    </p>

                    {/* Decorative line */}
                    <div className="mt-12 flex justify-center">
                        <div className={`h-px w-24 bg-gradient-to-r from-transparent ${isDark ? 'via-white/40' : 'via-black/40'} to-transparent`} />
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative"
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Card */}
                            <div className={`relative ${isDark ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-white border-black/10 hover:border-black/30'} border rounded-3xl p-8 h-full transition-all duration-700 ease-out hover:shadow-2xl hover:-translate-y-2`}>
                                {/* Background gradient on hover */}
                                <div className={`absolute inset-0 rounded-3xl ${isDark ? 'bg-white/5' : 'bg-black/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                {/* Icon */}
                                <div className="relative mb-6">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${isDark ? 'bg-white/10 group-hover:bg-white group-hover:text-black' : 'bg-black/5 group-hover:bg-black group-hover:text-white'} transition-all duration-500 group-hover:scale-110`}>
                                        {feature.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative space-y-4">
                                    <div>
                                        <div className={`text-sm font-medium ${isDark ? 'text-white/50' : 'text-black/50'} mb-1 tracking-wide uppercase`}>
                                            {feature.subtitle}
                                        </div>
                                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'} group-hover:${isDark ? 'text-white' : 'text-black'} transition-colors duration-300`}>
                                            {feature.title}
                                        </h3>
                                    </div>

                                    <p className={`${isDark ? 'text-white/70' : 'text-black/70'} leading-relaxed text-base`}>
                                        {feature.description}
                                    </p>

                                    {/* Button */}
                                    <div className="pt-6">
                                        <button
                                            onClick={feature.onClick}
                                            className={`group/btn inline-flex items-center gap-3 ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'} px-6 py-3 rounded-full font-medium transition-all duration-300 hover:gap-4 hover:pr-8`}
                                        >
                                            <span>{feature.buttonText}</span>
                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>
                                </div>

                                {/* Hover effect overlay */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${isDark ? 'from-white/5' : 'from-black/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                            </div>

                            {/* Floating number */}
                            <div className={`absolute -top-4 -right-4 w-8 h-8 ${isDark ? 'bg-white text-black' : 'bg-black text-white'} rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0`}>
                                {String(index + 1).padStart(2, '0')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom decoration */}
            <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-black/20'} to-transparent`} />
        </div>
    );
}