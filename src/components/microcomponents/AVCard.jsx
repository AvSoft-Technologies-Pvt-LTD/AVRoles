import { useState, useEffect } from "react";
import { Stethoscope, QrCode, Heart, Activity, Pill, Syringe, ChevronFirst as FirstAid, User, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

const AVCard = ({ initialName, initialCardNumber, initialGender }) => {
  const [formData, setFormData] = useState({
    name: initialName,
    cardNumber: initialCardNumber,
    gender: initialGender,
  });

  useEffect(() => {
    setFormData({
      name: initialName,
      cardNumber: initialCardNumber,
      gender: initialGender,
    });
  }, [initialName, initialCardNumber, initialGender]);

  // Healthcare themed background icons
  const bgIcons = [
    { Icon: Heart, position: "top-4 right-28", size: 24 },
    { Icon: Pill, position: "bottom-8 left-12", size: 24 },
    // { Icon: FirstAid, position: "top-16 left-8", size: 24 },
    { Icon: Syringe, position: "bottom-22 right-26", size: 24 },
    // { Icon: Activity, position: "top-20 right-24", size: 16 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0.85, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-[380px] h-[240px] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#0E1630]/20 transition-shadow duration-300"
    >
      {/* Gradient Background */}
      <motion.div 
        animate={{
          background: [
            "linear-gradient(135deg,rgb(45, 163, 157) 0%, rgba(10,21,40,0.95) 50%, rgba(10, 40, 40, 0.9) 100%)",
          ],
        }}
        className="absolute inset-0"
      />
      
      {/* Background Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {bgIcons.map((icon, index) => (
          <motion.div
            key={`icon-${index}`}
            className={`absolute ${icon.position}`}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0],
              opacity: [0.12, 0.12, 0.16],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              delay: index * 0.8,
            }}
          >
            <icon.Icon size={icon.size} className="text-[#01D48C]" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative h-full p-8 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative group"
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-[#01D48C]/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(1,212,140,0.2)",
                    "0 0 0 15px rgba(1,212,140,0)",
                  ],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                }}
              >
                <Stethoscope className="w-8 h-8 text-[#01D48C]" />
              </motion.div>
            </motion.div>
            <div className="space-y-1">
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly
                className="w-full bg-transparent text-lg font-medium text-[#f5f5f5] tracking-wide"
                placeholder="Enter Name"
              />
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                readOnly
                className="w-full bg-transparent text-sm text-[#01D48C] tracking-wider font-medium"
                placeholder="Card Number"
              />
            </div>
          </div>
          {/* QR Code */}
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="flex flex-col items-center gap-1.5 bg-[#01D48C]/10 p-2.5 rounded-xl hover:bg-[#01D48C]/20 transition-colors duration-300"
          >
            <QrCode className="w-8 h-8 text-[#01D48C]" />
          </motion.div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 bg-[#01D48C]/10 p-3 rounded-xl hover:bg-[#01D48C]/20 transition-colors duration-300"
          >
            <User className="w-5 h-5 text-[#01D48C]" />
            <input
              type="text"
              name="gender"
              value={formData.gender}
              readOnly
              className="w-full bg-transparent text-sm text-[#f5f5f5] font-medium"
              placeholder="Gender"
            />
          </motion.div>

        </div>

        {/* Footer */}
        <motion.div 
          className="flex justify-end items-end mt-6" 
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-right">
            <div className="text-[#01D48C] font-bold text-xl tracking-wider flex items-center gap-2">
              AV SWASTHYA
              <motion.div
                animate={{
                  scale: [1, 1.3, 1, 0.9, 1],
                  transition: { duration: 1, repeat: Infinity }
                }}
              >
                <HeartPulse className="w-6 h-6 text-[#01D48C]" />
              </motion.div>
            </div>
            <div className="text-xs text-[#f5f5f5]/80 tracking-wider mt-1">Healthcare Solutions</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AVCard;



