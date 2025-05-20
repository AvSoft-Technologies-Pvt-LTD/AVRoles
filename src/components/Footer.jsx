import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import axios from 'axios';


const Footer = () => {
  const healthCheckHandle = async () => {
    try {
      const response = await axios.get('http//localhost:8080/api/public/healthcheck');
      console.log('Healthcheck successful:', response.data);
      alert(response.data);
    } catch (error) {
      console.error('Healthcheck failed:', error);
    }
  };
  return (
    <footer className="bg-[#0E1630] text-[#f5f5f5] px-1 py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        {/* Column 1 - About */}
        <div>
          <h3 className="font-semibold text-[#01D48C] text-lg mb-4">AVSwasthya</h3>
          <p className="text-[#f5f5f5]/80">Experience personalized medical care from the comfort of your home.</p>
          <p className="mt-4 text-[#01D48C]">9144-784-724</p>
          <a href="mailto:info@avswasthya.com" className="text-[#01D48C] hover:text-[#01D48C]/80 transition-colors">info@avswasthya.com</a>
        </div>

        {/* Column 2 - AVSwasthya Links */}
        <div>
          <h3 className="font-semibold text-[#01D48C] text-lg mb-4">AVSwasthya</h3>
          <ul className="space-y-2">
            <li><a href="/home" className="hover:text-[#01D48C] transition-colors">Home</a></li>
            <li><a href="/about" className="hover:text-[#01D48C] transition-colors">AboutUs</a></li>
            <li><a href="/blog" className="hover:text-[#01D48C] transition-colors">Blog</a></li>
            <li><a href="/contact" className="hover:text-[#01D48C] transition-colors">ContactUs</a></li>
          </ul>
        </div>

        {/* Column 3 - User Services */}
        <div>
          <h3 className="font-semibold text-[#01D48C] text-lg mb-4">User Services</h3>
          <ul className="space-y-2">
            <li><a href="/healthcard" className="hover:text-[#01D48C] transition-colors">My Health Card</a></li>
            <li><a href="/consultation" className="hover:text-[#01D48C] transition-colors">Online Consultation</a></li>
            <li><a href="/ecommerce" className="hover:text-[#01D48C] transition-colors">Medical Ecommerce</a></li>
            <li><a href="/doctors" className="hover:text-[#01D48C] transition-colors">Search For Doctors</a></li>
            <li><a href="/hospitals" className="hover:text-[#01D48C] transition-colors">Search For Hospitals</a></li>
            <li><a href="/clinics" className="hover:text-[#01D48C] transition-colors">Search For Clinics</a></li>
            <li><a href="/lab-tests" className="hover:text-[#01D48C] transition-colors">Lab Test Bookings</a></li>
            <li><a href="/pharmacies" className="hover:text-[#01D48C] transition-colors">Nearby Pharmacies</a></li>
          </ul>
        </div>

        {/* Column 4 - Support */}
        <div>
          <h3 className="font-semibold text-[#01D48C] text-lg mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="/faqs" className="hover:text-[#01D48C] transition-colors">FAQs</a></li>
            <li><a href="/report" className="hover:text-[#01D48C] transition-colors">Report An Issue</a></li>
            <li><a href="/helpdesk" className="hover:text-[#01D48C] transition-colors">Contact Help Desk</a></li>
        </ul>
        </div>

        {/* Column 5 - Legal */}
        <div>
          <h3 className="font-semibold text-[#01D48C] text-lg mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="/terms" className="hover:text-[#01D48C] transition-colors">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-[#01D48C] transition-colors">Privacy Policy</a></li>
            <li><a href="/cookies" className="hover:text-[#01D48C] transition-colors">Cookie Preferences</a></li>
            <li><a href="/trust" className="hover:text-[#01D48C] transition-colors">Trust Center</a></li>
          </ul>
        </div>
      </div>

      {/* Social + Bottom */}
      <div className="border-t border-[#f5f5f5]/10 mt-8 pt-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        {/* Social Icons */}
        <div className="flex space-x-6 mb-6 md:mb-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#f5f5f5] hover:text-[#01D48C] transition-colors">
            <FaFacebookF size={22} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#f5f5f5] hover:text-[#01D48C] transition-colors">
            <FaTwitter size={22} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#f5f5f5] hover:text-[#01D48C] transition-colors">
            <FaInstagram size={22} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#f5f5f5] hover:text-[#01D48C] transition-colors">
            <FaLinkedinIn size={22} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right">
          <span className="text-[#01D48C] font-semibold">AVSwasthya</span>
          <p className="text-[#f5f5f5]/60 text-sm mt-1">
            Copyright © 2025, AVSwasthya. All rights reserved.
          </p>
          <li> <a href="/healthcheck" onClick={healthCheckHandle} className="text-slate-700 hover:underline text-sm">
            HealthCheck @Testing
          </a></li>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
