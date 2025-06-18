import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTh, FaUserMd, FaDesktop, FaCog, FaVial, FaProcedures, FaFileMedical, FaCapsules, FaRobot } from "react-icons/fa";
const modules = [
  { name: "Frontdesk", icon: FaDesktop },
  { name: "Admin", icon: FaUserMd },
  { name: "Lab", icon: FaVial },
  { name: "Pharmacy", icon: FaCapsules },
];
export default function ModulesMenu() {
  const [open, setOpen] = useState(false), menuRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const handleModuleClick = (name) => {
    setOpen(false);
    if (name === "Admin") {
      navigate("/doctordashboard/dr-admin"); // or "/staff-management"
    } else {
      console.log("Navigate to", name);
    }
  };
  return (
    <div className="relative z-50" ref={menuRef}>
      <button onClick={() => setOpen(o => !o)} className="p-3 bg-[var(--primary-color)] text-white rounded-full hover:bg-[var(--accent-color)] transition">
        <FaTh size={20} />
      </button>
      {open && (
        <div className="absolute top-14 right-0 bg-white rounded-xl shadow-xl px-5 py-3">
          <div className="flex gap-4">
            {modules.map(({ name, icon: Icon }, idx) => (
              <button
                key={name}
                onClick={() => handleModuleClick(name)}
                className="relative group transition-all duration-300"
                style={{ animation: `slideUpFadeIn 0.5s ${idx * 0.02}s both` }}  >
                <div
                  className="mb-2 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1CA4AC]/20 to-[#68C723]/20 text-[var(--primary-color)] group-hover:from-[#1CA4AC] group-hover:to-[#68C723] group-hover:text-white shadow-md group-hover:scale-110 transition-all duration-300 bounce-twice"
                  style={{ animationDelay: `${idx * 80}ms` }}  >
                  <Icon className="text-2xl" />
                </div>
                <span className="paragraph gap-3 text-[var(--primary-color)] group-hover:text-[var(--accent-color)]">
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}






