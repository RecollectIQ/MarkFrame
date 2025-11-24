import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Tilt } from 'react-tilt';

import { Moon, Sun, Monitor } from 'lucide-react';

const LandingPage = ({ onEnter, uiTheme, setUiTheme }) => {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    const defaultOptions = {
        reverse: false,  // reverse the tilt direction
        max: 35,     // max tilt rotation (degrees)
        perspective: 1000,   // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1.1,    // 2 = 200%, 1.5 = 150%, etc..
        speed: 1000,   // Speed of the enter/exit transition
        transition: true,   // Set a transition on enter/exit.
        axis: null,   // What axis should be disabled. Can be X or Y.
        reset: true,   // If the tilt effect has to be reset on exit.
        easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    };

    const isDark = uiTheme === 'dark' || (uiTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className={`relative w-full h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#212121]' : 'bg-slate-50'}`}>
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: "push",
                            },
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                            resize: true,
                        },
                        modes: {
                            push: {
                                quantity: 4,
                            },
                            repulse: {
                                distance: 100,
                                duration: 0.4,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: isDark ? "#ffffff" : "#1e293b", // White in dark mode, Dark slate in light
                        },
                        links: {
                            color: isDark ? "#ffffff" : "#1e293b",
                            distance: 150,
                            enable: true,
                            opacity: 0.2,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 2,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 80,
                        },
                        opacity: {
                            value: 0.3,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 3 },
                        },
                    },
                    detectRetina: true,
                }}
                className="absolute inset-0 z-0"
            />

            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={() => setUiTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light')}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-700 dark:text-slate-200 hover:bg-white/20 transition-all shadow-lg"
                    title={`Theme: ${uiTheme}`}
                >
                    {uiTheme === 'light' ? <Sun className="w-6 h-6" /> : uiTheme === 'dark' ? <Moon className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                </button>
            </div>

            <div className="z-10 flex flex-col items-center gap-8">
                <Tilt options={defaultOptions} className="cursor-pointer" >
                    <div onClick={onEnter} className="flex flex-col items-center">
                        <div
                            className="w-32 h-32 md:w-64 md:h-64 drop-shadow-2xl opacity-90"
                            style={{
                                backgroundColor: isDark ? '#ffffff' : '#475568',
                                maskImage: 'url(/logo-new.png)',
                                maskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                WebkitMaskImage: uiTheme === 'dark' || (uiTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'url(/logo-dark.png)' : 'url(/logo-new.png)',
                                WebkitMaskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center'
                            }}
                        />
                        {/* Adjusted text sizes for mobile */}
                        <h1 className={`mt-8 text-4xl md:text-8xl font-black tracking-[0.2em] uppercase select-none transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#475568]'}`}>
                            MarkFrame
                        </h1>
                        <p className={`mt-4 text-sm md:text-xl font-medium tracking-[0.3em] uppercase transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-[#94a3b8]'}`}>
                            Click to Enter
                        </p>
                    </div>
                </Tilt>
            </div>
        </div>
    );
};

export default LandingPage;