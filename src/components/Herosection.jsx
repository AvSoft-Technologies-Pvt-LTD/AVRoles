import { useState, useEffect, useCallback } from 'react';
import { UserRound, Users, FlaskRound as Flask, Building2, Phone, Activity, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Counter = ({ end, duration = 2000, label, icon: Icon, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`counter-${label}`);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [label]);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          setCount(Math.floor(end * progress));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [end, duration, delay, isVisible]);

  return (
    <div
      id={`counter-${label}`}
      className={`flex flex-col items-center p-4 rounded-2xl shadow-lg transform transition-all duration-500 backdrop-blur-sm
    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
    bg-white/90 hover:shadow-[#01D48C]/20 hover:scale-105`}
    >
      <div className="relative">
        <div className="absolute -inset-1 rounded-full animate-pulse"></div>
        <Icon className="text-[#0E1630] w-6 h-6 relative" strokeWidth={2} />
      </div>
      <div className="text-2xl font-bold text-[#0E1630] mt-2">{count}+</div>
      <div className="text-xs text-[#0E1630]/70 font-medium text-center mt-0.5">{label}</div>
    </div>

  );
};

function App() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const navigate = useNavigate();

  const messages = [
    'schedule online consultations',
    'book lab tests',
    'get health insights',
    'connect with experts'
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.hero-content');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const wordDelay = 2000;

    const type = () => {
      const currentMessage = messages[messageIndex];

      if (isDeleting) {
        setDisplayText(currentMessage.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }
      } else {
        setDisplayText(currentMessage.substring(0, displayText.length + 1));
        if (displayText.length === currentMessage.length) {
          setTimeout(() => setIsDeleting(true), wordDelay);
        }
      }
    };

    const timer = setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, messageIndex]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] overflow-hidden relative py-12 px-4 md:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 rotate-bg">
        {/* <div className="absolute top-0 left-0 w-full h-full bg-[#0E1630]/5"></div> */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#01D48C]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-20 w-[30rem] h-[30rem] bg-[#01D48C]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content Section */}
          <div className="lg:w-1/2 space-y-10 hero-content">
            <div className={`space-y-6 transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              {/* <div className="inline-flex  items-center animate-shimme">
  <Sparkles className="text-[#01D48C] w-6 h-6 mr-3 animate-pulse" />
  <span className="text-[#0E1630] text-base lg:text-lg font-semibold tracking-wide">
    Your Health, Our Priority
  </span>
</div> */}

              <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-[#0E1630] leading-tight">
                Your Digital
                <span className="block text-[#01D48C]">
                  Healthcare Partner
                </span>
              </h1>

              <div className="flex items-center text-lg backdrop-blur-sm px-4 py-2 ">
                <Activity className="text-[#01D48C] w-6 h-6 mr-2" />
                <span className="text-[#0E1630] font-medium">
                  {displayText}
                </span>
                <span className="animate-blink border-r-4 border-[#01D48C] h-6 ml-1"></span>
              </div>

              <p className="text-[#0E1630]/70 text-lg leading-relaxed">
                Experience modern healthcare solutions at your fingertips. We bring quality
                medical services right to your doorstep with advanced technology and expert care.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Counter end={500} label="Expert Doctors" icon={UserRound} delay={0} />
              <Counter end={25000} label="Happy Patients" icon={Users} delay={200} />
              <Counter end={1000} label="Lab Tests" icon={Flask} delay={400} />
              <Counter end={50} label="Medical Centers" icon={Building2} delay={600} />
            </div>

            <button

              className="group flex items-center gap-3 px-8 py-4 text-white bg-[#0E1630] rounded-full transition-all duration-300 pulse-shadow hover:scale-105">
              <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span
                className="font-semibold text-white-600  cursor-pointer"
                onClick={() => navigate('/bookconsultation')}
              >
                Book Consultation
              </span>

            </button>
          </div>

          {/* Right Image Section */}
          <div className="relative w-full lg:w-1/2 aspect-square max-w-2xl">
            <div className="absolute inset-0 rounded-[40%_60%_27%_73%/46%_40%_54%_54%] shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-[#0E1630]/10"></div>
              <img
                src="src/assets/output.jpg"
                alt="Digital Healthcare"
                className="w-full h-full object-cover scale-in"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;