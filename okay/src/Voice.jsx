import React, { useState, useEffect, useRef } from "react";
import { Volume2, Loader2, Square, Newspaper, Play, Pause, Sparkles } from "lucide-react";

export default function NewsReader({ theme = 'light' }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [speakingId, setSpeakingId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredCard, setHoveredCard] = useState(null);
    const audioRef = useRef(new Audio());

    const isDark = theme === 'dark';
    const NEWS_API_KEY = "49be7999a0c342e38e22b8cced566f5f";

    // Mouse tracking for interactive effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Generate AI summary (simplified version)
    const generateSummary = (text) => {
        if (!text) return "Breaking news update...";
        const words = text.split(' ');
        if (words.length <= 20) return text;
        return words.slice(0, 20).join(' ') + '...';
    };

    // Fetch news data
    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`
                );
                const data = await res.json();
                const articlesWithSummaries = (data.articles || []).map(article => ({
                    ...article,
                    aiSummary: generateSummary(article.description || article.title)
                }));
                setNews(articlesWithSummaries);
            } catch (error) {
                console.error("Error fetching news:", error);
                // Fallback data for demo
                setNews([
                    {
                        title: "AI Technology Breakthrough Announced",
                        description: "Major tech companies unveil revolutionary AI advancement that could change industry standards.",
                        aiSummary: "Major tech companies unveil revolutionary AI advancement that could change industry standards...",
                        urlToImage: null,
                        source: { name: "Tech News" }
                    },
                    {
                        title: "Global Climate Summit Reaches Agreement",
                        description: "World leaders commit to ambitious climate goals in historic international environmental accord.",
                        aiSummary: "World leaders commit to ambitious climate goals in historic international environmental accord...",
                        urlToImage: null,
                        source: { name: "Global News" }
                    },
                    {
                        title: "Space Exploration Mission Success",
                        description: "International space agency achieves milestone in deep space exploration with successful mission.",
                        aiSummary: "International space agency achieves milestone in deep space exploration with successful mission...",
                        urlToImage: null,
                        source: { name: "Space News" }
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Enhanced speech function with better error handling
    const speakNews = async (title, aiSummary, id) => {
        console.log("🎙️ speakNews called with:", { title, aiSummary, id });

        try {
            // Stop any existing audio/speech immediately
            stopAudio();

            console.log("🔄 Setting speaking state...");
            setSpeakingId(id);
            setIsPlaying(true);

            // Prepare text for speech - combine title and summary
            const textToSpeak = `${title}. ${aiSummary}`;
            console.log("📝 Text to speak:", textToSpeak);

            console.log("📡 Attempting Murf API...");

            // Try Murf API first
            const response = await fetch("http://127.0.0.1:8081/api/tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    voiceId: "en-US-cooper",
                    text: textToSpeak,
                    style: "Conversational",
                }),
            });

            console.log("📊 Murf API Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Murf API error:", errorText);
                throw new Error(`Murf API failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("✅ Murf API response:", data);

            if (!data.audioUrl) {
                throw new Error("Murf API did not return a valid audio URL");
            }

            // Set up audio element with proper event handlers
            audioRef.current.src = data.audioUrl;
            audioRef.current.crossOrigin = "anonymous";

            // Remove any existing event listeners to prevent duplicates
            audioRef.current.onloadstart = null;
            audioRef.current.oncanplay = null;
            audioRef.current.onerror = null;
            audioRef.current.onended = null;

            // Add fresh event listeners
            audioRef.current.onloadstart = () => {
                console.log("🎵 Audio loading started...");
            };

            audioRef.current.oncanplay = () => {
                console.log("▶️ Audio ready to play...");
            };

            audioRef.current.onerror = (e) => {
                console.error("💥 Audio playback error:", e);
                // Fallback to browser TTS on audio error
                fallbackToBrowserTTS(textToSpeak);
            };

            audioRef.current.onended = () => {
                console.log("🏁 Murf audio playback ended");
                cleanupAudioState();
            };

            // Start playback
            await audioRef.current.play();
            console.log("🎶 Murf audio playback started successfully");

        } catch (error) {
            console.error("💥 Murf TTS Error:", error);
            // Fallback to browser TTS
            fallbackToBrowserTTS(`${title}. ${aiSummary}`);
        }
    };

    // Fallback to browser TTS
    const fallbackToBrowserTTS = (textToSpeak) => {
        console.log("🔄 Falling back to browser TTS...");
        try {
            // Make sure previous synthesis is cancelled
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.rate = 0.8;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => {
                console.log("🗣️ Browser TTS started");
            };

            utterance.onend = () => {
                console.log("✅ Browser TTS ended");
                cleanupAudioState();
            };

            utterance.onerror = (e) => {
                console.error("❌ Browser TTS error:", e);
                cleanupAudioState();
                alert("Speech synthesis failed. Please try again.");
            };

            // Ensure we're still in speaking state before starting
            if (isPlaying) {
                speechSynthesis.speak(utterance);
                console.log("🎤 Browser TTS initiated");
            }
        } catch (fallbackError) {
            console.error("💥 Fallback TTS also failed:", fallbackError);
            cleanupAudioState();
            alert("Speech synthesis failed. Please check your browser settings and try again.");
        }
    };

    // Clean up audio state
    const cleanupAudioState = () => {
        console.log("🧹 Cleaning up audio state...");
        setIsPlaying(false);
        setSpeakingId(null);
    };

    // Stop all audio/speech
    const stopAudio = () => {
        console.log("🛑 Stopping all audio...");

        // Stop browser TTS
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            console.log("🤐 Browser TTS cancelled");
        }

        // Stop Murf audio
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = "";
            console.log("⏹️ Murf audio stopped");
        }

        // Clean up state
        cleanupAudioState();
    };

    // Handle listen button click
    const handleListenClick = (e, title, aiSummary, index) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("🎯 Listen button clicked!", { title, index });
        speakNews(title, aiSummary, index);
    };

    // Handle stop button click
    const handleStopClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("🛑 Stop button clicked!");
        stopAudio();
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, []);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'} relative overflow-hidden`}>
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

            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-white/10' : 'bg-black/5'} rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm`}>
                        <Newspaper className={`w-3 h-3 ${isDark ? 'text-white/60' : 'text-black/60'}`} />
                        <span className={`text-xs font-medium ${isDark ? 'text-white/80' : 'text-black/80'} tracking-wide`}>
                            AI-POWERED NEWS
                        </span>
                    </div>

                    <h1 className={`text-5xl md:text-6xl font-black ${isDark ? 'text-white' : 'text-black'} mb-4 tracking-tighter leading-none`}>
                        Voice News
                    </h1>

                    <p className={`text-lg md:text-xl ${isDark ? 'text-white/60' : 'text-black/60'} max-w-2xl mx-auto leading-relaxed font-light`}>
                        Stay informed with AI-generated summaries and voice narration
                    </p>

                    {/* Decorative line */}
                    <div className="mt-6 flex justify-center">
                        <div className={`h-px w-24 bg-gradient-to-r from-transparent ${isDark ? 'via-white/40' : 'via-black/40'} to-transparent`} />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center mb-4`}>
                            <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-white/60' : 'text-black/60'}`} />
                        </div>
                        <p className={`text-lg font-medium ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                            Fetching latest news...
                        </p>
                    </div>
                ) : (
                    /* News Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {news.slice(0, 6).map((article, index) => (
                            <div
                                key={index}
                                className="group relative"
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Card */}
                                <div className={`relative ${isDark ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-white border-black/10 hover:border-black/30'} border rounded-2xl overflow-hidden h-full transition-all duration-700 ease-out hover:shadow-2xl hover:-translate-y-2 flex flex-col`}>
                                    {/* Background gradient on hover */}
                                    <div className={`absolute inset-0 ${isDark ? 'bg-white/5' : 'bg-black/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                    {/* Image */}
                                    {article.urlToImage ? (
                                        <div className="relative h-48 overflow-hidden flex-shrink-0">
                                            <img
                                                src={article.urlToImage}
                                                alt="news"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/40 to-transparent' : 'from-white/40 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                        </div>
                                    ) : (
                                        <div className={`h-48 flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-black/5'} flex-shrink-0`}>
                                            <Newspaper className={`w-12 h-12 ${isDark ? 'text-white/30' : 'text-black/30'}`} />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1 relative z-10">
                                        {/* Source */}
                                        <div className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-black/50'} mb-2 tracking-wide uppercase`}>
                                            {article.source?.name || 'News Source'}
                                        </div>

                                        {/* Title */}
                                        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'} mb-3 line-clamp-3 flex-1`}>
                                            {article.title}
                                        </h2>

                                        {/* AI Summary */}
                                        <div className="mb-4">
                                            <div className={`inline-flex items-center gap-1 text-xs ${isDark ? 'text-white/40' : 'text-black/40'} mb-1`}>
                                                <Sparkles className="w-3 h-3" />
                                                <span>AI Summary</span>
                                            </div>
                                            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-black/70'} leading-relaxed`}>
                                                {article.aiSummary}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-auto relative z-20">
                                            {speakingId !== index || !isPlaying ? (
                                                // Listen Button (Not Playing)
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleListenClick(e, article.title, article.aiSummary, index)}
                                                    disabled={isPlaying && speakingId !== index}
                                                    className={`group/btn flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex-1 justify-center hover:scale-105 cursor-pointer ${
                                                        isPlaying && speakingId !== index
                                                            ? `${isDark ? 'bg-white/20 text-white/50' : 'bg-black/20 text-black/50'} cursor-not-allowed`
                                                            : `${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'}`
                                                    }`}
                                                    aria-label={`Listen to ${article.title}`}
                                                >
                                                    <Play className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
                                                    <span>{isPlaying && speakingId !== index ? 'Waiting...' : 'Listen'}</span>
                                                </button>
                                            ) : (
                                                // Speaking State (Currently Playing)
                                                <>
                                                    {/* Speaking Status */}
                                                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm flex-1 justify-center ${
                                                        isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/20 text-blue-600'
                                                    }`}>
                                                        <Volume2 className="w-4 h-4 animate-pulse" />
                                                        <span>Speaking...</span>
                                                    </div>

                                                    {/* Stop Button */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleStopClick(e)}
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-all duration-300 hover:scale-105 cursor-pointer relative z-30"
                                                        title="Stop audio playback"
                                                        aria-label="Stop audio playback"
                                                    >
                                                        <Square className="w-4 h-4" />
                                                        <span>Stop</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating indicator */}
                                <div className={`absolute -top-3 -right-3 w-7 h-7 ${isDark ? 'bg-white text-black' : 'bg-black text-white'} rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 pointer-events-none`}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom decoration */}
            <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-white/20' : 'via-black/20'} to-transparent`} />
        </div>
    );
}