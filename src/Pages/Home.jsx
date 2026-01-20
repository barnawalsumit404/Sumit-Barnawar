import React, { useState, useEffect, useCallback, memo } from "react"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Memoized Components
const StatusBadge = memo(() => {
  // Floating animation using CSS keyframes and JS for random movement
  const [pos, setPos] = React.useState({ top: 120, left: 40 });
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    let raf;
    let direction = { x: 1, y: 1 };
    let speed = 0.25 + Math.random() * 0.15;
    let bounds = { minX: 20, maxX: window.innerWidth - 180, minY: 80, maxY: window.innerHeight - 80 };
    function animate() {
      if (!paused) {
        setPos(prev => {
          let next = { ...prev };
          next.left += direction.x * speed * (Math.random() * 2 + 1);
          next.top += direction.y * speed * (Math.random() * 2 + 1);
          if (next.left < bounds.minX || next.left > bounds.maxX) direction.x *= -1;
          if (next.top < bounds.minY || next.top > bounds.maxY) direction.y *= -1;
          next.left = Math.max(bounds.minX, Math.min(bounds.maxX, next.left));
          next.top = Math.max(bounds.minY, Math.min(bounds.maxY, next.top));
          return next;
        });
      }
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    window.addEventListener('resize', () => {
      bounds = { minX: 20, maxX: window.innerWidth - 180, minY: 80, maxY: window.innerHeight - 80 };
    });
    return () => cancelAnimationFrame(raf);
  }, [paused]);
  // Mobile: pause on touchstart, resume on touchend
  const handleTouchStart = () => setPaused(true);
  const handleTouchEnd = () => setPaused(false);
  return (
    <div
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, pointerEvents: 'auto' }}
      className="animate-float"
      data-aos="zoom-in"
      data-aos-delay="400"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="relative group">
        <button
          className="relative px-4 py-2 rounded-full bg-[#DBEAFE] border border-blue-300 text-blue-700 font-medium flex items-center hover:bg-blue-100 transition shadow-lg"
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
          onClick={() => window.dispatchEvent(new CustomEvent('openHireMe'))}
          tabIndex={0}
        >
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-600" />
          Hire Me
        </button>
      </div>
    </div>
  );
});

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="text-[#0F172A]">
          Frontend
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          Developer
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-[#FFFFFF] border border-[#E5E7EB] text-sm text-[#475569] hover:border-blue-300 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="relative h-11 bg-white border border-[#E5E7EB] rounded-lg leading-none overflow-hidden hover:border-blue-300 transition-all duration-300 group-hover:bg-[#F8FAFC]">
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="text-[#0F172A] font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-blue-600 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      <div className="relative rounded-xl bg-white p-2 flex items-center justify-center border border-[#E5E7EB] group-hover:border-blue-300 transition-all duration-300 hover:bg-[#F8FAFC]">
        <Icon className="w-5 h-5 text-[#475569] group-hover:text-blue-600 transition-colors" />
      </div>
    </button>
  </a>
));

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["I am Sumit Barnawal", "I am a College Student", "I am a Coder", "I am a Web Developer", "I am a Graphic Designer"];
const TECH_STACK = ["Code", "Create", "Eat", "Sleep"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/barnawalsumit404" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/barnawalsumit404" },
  { icon: Instagram, link: "https://www.instagram.com/barnawalsumit404" }
];

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [showHireMe, setShowHireMe] = useState(false);
  const [HireMeComponent, setHireMeComponent] = useState(null);

  useEffect(() => {
    const handler = async () => {
      if (!HireMeComponent) {
        const mod = await import('./HireMe.jsx');
        setHireMeComponent(() => mod.default);
      }
      setShowHireMe(true);
    };
    window.addEventListener('openHireMe', handler);
    return () => window.removeEventListener('openHireMe', handler);
  }, []);

  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
       
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  // Lottie configuration
  // Lottie animation removed due to missing file

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-hidden" id="Home">
      {showHireMe && HireMeComponent && (
        <HireMeComponent onClose={() => setShowHireMe(false)} />
      )}
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto px-[5%] sm:px-6 lg:px-[0%] min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-0 sm:gap-12 lg:gap-20">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4 sm:space-y-6">
                <StatusBadge />
                <MainTitle />

                {/* Typing Effect */}
                <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-xl md:text-2xl text-gray-800 font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-6 bg-blue-600 ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-800 max-w-xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  I am Sumit Barnawal a student who loves to learn new technology.
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {TECH_STACK.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-3 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="hidden sm:flex gap-4 justify-start" data-aos="fade-up" data-aos-delay="1600">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Animation removed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);