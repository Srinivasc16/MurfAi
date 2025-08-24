import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, Zap, Mic, Volume2 } from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function MurfAIHome({ theme}) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    const isDark = theme === 'dark';

    const handleExploreClick = () => {
            navigate("/explore");
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className={`h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} relative overflow-hidden flex items-center justify-center transition-all duration-500`}>
            {/* Floating mouse effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className={`absolute w-96 h-96 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} blur-3xl transition-all duration-1000 ease-out`}
                    style={{
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                    }}
                />
                {/* Floating particles */}
                <div className={`absolute top-20 left-20 w-2 h-2 ${isDark ? 'bg-white/20' : 'bg-black/20'} rounded-full animate-pulse`} />
                <div className={`absolute top-40 right-32 w-1 h-1 ${isDark ? 'bg-white/30' : 'bg-black/30'} rounded-full animate-bounce`} />
                <div className={`absolute bottom-32 left-1/4 w-1.5 h-1.5 ${isDark ? 'bg-white/20' : 'bg-black/20'} rounded-full animate-ping`} />
                <div className={`absolute top-1/2 right-20 w-1 h-1 ${isDark ? 'bg-white/25' : 'bg-black/25'} rounded-full animate-pulse delay-1000`} />
            </div>

            <div className="relative z-10 container mx-auto px-8 text-center">
                {/* Brand Badge */}
                <div
                    className={`inline-flex items-center gap-2 ${isDark ? 'bg-white/10 backdrop-blur-sm' : 'bg-black/5'} rounded-full px-6 py-2 mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: '200ms' }}
                >
                    <Zap className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-black/60'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-black/80'} tracking-wide`}>
                        NEXT-GENERATION VOICE AI
                    </span>
                </div>

                {/* Main Title */}
                <h1
                    className={`text-8xl md:text-9xl lg:text-[10rem] font-black ${isDark ? 'text-white' : 'text-black'} mb-8 tracking-tighter leading-none transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{
                        transitionDelay: '400ms',
                        transform: `translateX(${mousePosition.x * 0.01}px) translateY(${mousePosition.y * 0.01}px)`
                    }}
                >
                    Murf
                    <span className={`block ${isDark ? 'text-white/70' : 'text-black/70'}`}>AI</span>
                </h1>

                {/* Subtitle */}
                <p
                    className={`text-xl md:text-2xl lg:text-3xl ${isDark ? 'text-white/60' : 'text-black/60'} max-w-4xl mx-auto leading-relaxed font-light mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{
                        transitionDelay: '600ms',
                        transform: `translateX(${mousePosition.x * 0.005}px) translateY(${mousePosition.y * 0.005}px)`
                    }}
                >
                    The future of voice technology. Intelligent. Elegant. Limitless possibilities.
                </p>

                {/* Feature Icons Row */}
                <div
                    className={`flex items-center justify-center gap-8 mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: '800ms' }}
                >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-black/5'} transition-all duration-300 hover:scale-110`}>
                        <Mic className={`w-6 h-6 ${isDark ? 'text-white/70' : 'text-black/70'}`} />
                    </div>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-black/5'} transition-all duration-300 hover:scale-110`}>
                        <Volume2 className={`w-6 h-6 ${isDark ? 'text-white/70' : 'text-black/70'}`} />
                    </div>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-black/5'} transition-all duration-300 hover:scale-110`}>
                        <Sparkles className={`w-6 h-6 ${isDark ? 'text-white/70' : 'text-black/70'}`} />
                    </div>
                </div>

                {/* CTA Button */}
                <div
                    className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{
                        transitionDelay: '1000ms',
                        transform: `translateX(${mousePosition.x * 0.003}px) translateY(${mousePosition.y * 0.003}px)`
                    }}
                >
                    <button
                        onClick={handleExploreClick}
                        className={`group inline-flex items-center gap-4 ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'} px-12 py-5 rounded-full font-semibold text-xl transition-all duration-500 hover:gap-6 hover:pr-16 hover:scale-105 hover:shadow-2xl`}
                    >
                        <span>Explore Features</span>
                        <ArrowRight className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-2" />
                    </button>
                </div>

                {/* Decorative elements */}
                <div
                    className={`mt-20 flex justify-center transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: '1200ms' }}
                >
                    <div className={`h-px w-32 bg-gradient-to-r from-transparent ${isDark ? 'via-white/30' : 'via-black/30'} to-transparent`} />
                </div>

                {/* Stats or additional info */}
                <div
                    className={`mt-12 flex items-center justify-center gap-12 text-sm ${isDark ? 'text-white/50' : 'text-black/50'} font-medium transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: '1400ms' }}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/40' : 'bg-black/40'} animate-pulse`} />
                        <span>AI POWERED</span>
                    </div>
                    <div className={`w-px h-4 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/40' : 'bg-black/40'} animate-pulse delay-500`} />
                        <span>REAL-TIME</span>
                    </div>
                    <div className={`w-px h-4 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/40' : 'bg-black/40'} animate-pulse delay-1000`} />
                        <span>LIMITLESS</span>
                    </div>
                </div>
            </div>

            {/* Corner decorations */}
            <div className={`absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 ${isDark ? 'border-white/20' : 'border-black/20'} transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1600ms' }} />
            <div className={`absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 ${isDark ? 'border-white/20' : 'border-black/20'} transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1600ms' }} />
            <div className={`absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 ${isDark ? 'border-white/20' : 'border-black/20'} transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1600ms' }} />
            <div className={`absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 ${isDark ? 'border-white/20' : 'border-black/20'} transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1600ms' }} />

            {/* Bottom decoration */}
            <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-black/20'} to-transparent`} />
        </div>
    );
}