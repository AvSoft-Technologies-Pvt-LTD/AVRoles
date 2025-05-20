import React, { useEffect, useState } from 'react';
import { Users, FlaskRound as Flask, Star, Stethoscope } from 'lucide-react';

function Statusbar() {
  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3" style={{ color: '#0E1630' }}>
            Making Healthcare Better
          </h2>
          <div className="w-24 h-1 mx-auto" style={{ backgroundColor: '#01D48C' }}></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatsCard 
            number={746}
            suffix="k"
            description="Successful Healthcard Registration"
            icon={<Users className="w-7 h-7" />}
            color="#0E1630"
          />
          <StatsCard 
            number={850}
            suffix=""
            description="Lab & Pharmacies integrated"
            icon={<Flask className="w-7 h-7" />}
            color="#01D48C"
          />
          <StatsCard 
            number={93}
            suffix="%"
            description="Patient Satisfaction Rate"
            icon={<Star className="w-7 h-7" />}
            color="#0E1630"
          />
          <StatsCard 
            number={275}
            suffix="+"
            description="Top Specialists"
            icon={<Stethoscope className="w-7 h-7" />}
            color="#01D48C"
          />
        </div>
      </div>
    </div>
  );
}

function StatsCard({ number, suffix = "", description, icon, color }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = number;
    if (start === end) return;

    const duration = 2000;
    const incrementTime = 20;
    const increment = (end / (duration / incrementTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.ceil(start));
    }, incrementTime);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <div className="relative p-6 rounded-2xl bg-[#F5F5F5]">
      <div 
        className="absolute -top-4 left-6 w-14 h-14 flex items-center justify-center rounded-2xl"
        style={{ 
          color: color,
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {icon}
      </div>
      <div className="mt-6">
        <div className="flex items-baseline space-x-1 mb-3">
          <span 
            className="text-4xl font-extrabold"
            style={{ color: color }}
          >
            {count}
          </span>
          <span 
            className="text-2xl font-bold"
            style={{ color: color }}
          >
            {suffix}
          </span>
        </div>
        <p className="text-gray-600 text-sm font-semibold">
          {description}
        </p>
      </div>
      <div 
        className="absolute top-0 right-0 w-2 h-full rounded-r-2xl"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export default Statusbar;