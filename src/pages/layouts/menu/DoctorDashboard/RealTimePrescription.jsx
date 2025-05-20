import React, { useState, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { jsPDF } from 'jspdf';
import 'react-calendar/dist/Calendar.css';
import AVLogo from '../../../../assets/AV.png'; // Your AV Swasthya logo path
const RealTimePrescription = ({ patientName, onSave, onClose }) => {
  const [date, setDate] = useState(new Date());
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);
  const [advice, setAdvice] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. ');
  const [diagnosis, setDiagnosis] = useState('');
  const [savedPdfUrl, setSavedPdfUrl] = useState(null);
  const sigCanvas = useRef();
  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };
  const clearSignature = () => sigCanvas.current.clear();
  const generatePDF = () => {
    const sigData = sigCanvas.current.toDataURL();
    const pdf = new jsPDF('p', 'mm', 'a4');
    // Modern Header Design
    pdf.setFillColor(41, 128, 185); // Professional blue
    pdf.rect(0, 0, 210, 40, 'F');
    // Hospital Name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('Helvetica', 'bold');
    pdf.text('AV Swasthya', 105, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Advanced Healthcare Solutions', 105, 30, { align: 'center' });
    // Doctor Info Section
    pdf.setTextColor(41, 128, 185);
    pdf.setFontSize(16);
    pdf.text(doctorName, 20, 55);
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text('MBBS, MD - General Medicine', 20, 62);
    pdf.text('Reg. No: AV-2024-001', 20, 68);
    // Patient Info Box
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, 75, 170, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Patient Name: ${patientName || "—"}`, 25, 83);
    pdf.text(`Date: ${date.toLocaleDateString()}`, 25, 90);
    // pdf.text(`Age: _______________`, 120, 83);
    // pdf.text(`Gender: _______________`, 120, 90);
    // Rx Symbol
    pdf.setFontSize(24);
    pdf.setFont('Times', 'italic');
    pdf.text('℞', 20, 115);
    // Medicines Section
    let yPosition = 125;
    pdf.setFontSize(11);
    pdf.setFont('Helvetica', 'normal');
    medicines.forEach((med, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`${index + 1}. ${med.name}`, 25, yPosition);
      pdf.text(`${med.dosage}`, 25, yPosition + 5, { align: 'left' });
      pdf.text(`Duration: ${med.duration}`, 120, yPosition + 5);
      yPosition += 15;
    });
    // Diagnosis & Advice
    yPosition += 10;
    pdf.setFont('Helvetica', 'bold');
    pdf.text('Diagnosis:', 20, yPosition);
    pdf.setFont('Helvetica', 'normal');
    pdf.text(diagnosis || "—", 60, yPosition);
    yPosition += 15;
    pdf.setFont('Helvetica', 'bold');
    pdf.text('Advice:', 20, yPosition);
    pdf.setFont('Helvetica', 'normal');
    pdf.text(advice || "—", 60, yPosition);
    // Signature
    if (sigData) {
      pdf.addImage(sigData, 'PNG', 130, 240, 50, 20);
      pdf.text("Doctor's Signature", 155, 265, { align: "center" });
    }
    // Footer
    pdf.setFillColor(41, 128, 185);
    pdf.rect(0, 280, 210, 17, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text('AV Swasthya Medical Center | 123 Healthcare Avenue | Contact: +91 123-456-7890 | www.avswasthya.com', 105, 288, { align: 'center' });
    return pdf;
  };
  const handleSave = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Please sign before saving.");
      return;
    }
    const pdf = generatePDF();
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setSavedPdfUrl(pdfUrl);
    onSave(pdfUrl);
  };
  const handleDownload = () => {
    if (!savedPdfUrl) {
      alert('Please save the prescription first.');
      return;
    }
    const link = document.createElement('a');
    link.href = savedPdfUrl;
    link.download = `Prescription-${patientName || 'Patient'}.pdf`;
    link.click();
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center text-blue-600">Create Prescription</h2>
      <div className="border p-4 rounded shadow-md bg-white">
        <input
          type="text"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          placeholder="Doctor Name"
          className="w-full border px-3 py-2 rounded mb-2"
        />
        {medicines.map((med, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={med.name}
              onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
              placeholder="Medicine Name"
              className="flex-1 border px-2 py-1 rounded"
            />
            <input
              type="text"
              value={med.dosage}
              onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
              placeholder="Dosage"
              className="w-24 border px-2 py-1 rounded"
            />
            <input
              type="text"
              value={med.duration}
              onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
              placeholder="Duration"
              className="w-24 border px-2 py-1 rounded"
            />
          </div>
        ))}
        <button onClick={addMedicine} className="text-blue-600 underline text-sm">
          + Add Another Medicine
        </button>
        <input
          type="text"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Diagnosis / Specialty"
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <textarea
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
          placeholder="General Advice"
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <div className="border p-2 rounded mb-2">
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{ className: 'w-full h-32 border rounded' }}
          />
          <button onClick={clearSignature} className="text-red-600 text-sm mt-2">
            Clear Signature
          </button>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          {savedPdfUrl && (
            <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded">
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default RealTimePrescription;












