import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
const doctorName = 'Dr.Anjali Mehra';
const notify = async (name, phone, message, btn = false) =>
  axios.post('https://67e631656530dbd3110f0322.mockapi.io/notify', { name, phone, message, showPayButton: btn, doctorName, createdAt: new Date().toISOString() }).catch(() => toast.error('Notification failed'));
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState(() => JSON.parse(localStorage.getItem('appointments')) || []);
  const [loading, setLoading] = useState(true), [tab, setTab] = useState('pending'), [rejectId, setRejectId] = useState(null), [rescheduleId, setRescheduleId] = useState(null);
  const [reasons, setReasons] = useState({}), [reschedule, setReschedule] = useState({ date: '', time: '' });
  const updateStatus = (id, fn) => setAppointments(prev => {
    const updated = prev.map(a => a.id === id ? (typeof fn === 'function' ? fn(a) : { ...a, ...fn }) : a);
    localStorage.setItem('appointments', JSON.stringify(updated));
    return updated;
  });
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://67e3e1e42ae442db76d2035d.mockapi.io/register/book');
      const appts = res.data.filter(i => i.doctorName === doctorName).map(i => ({
        id: i.id, name: i.name || 'Unknown', phone: i.phone || 'N/A', date: i.date, time: i.time,
        reason: i.symptoms, specialty: i.specialty, type: i.consultationType, status: 'Pending',
        prescription: '', link: '', rejectReason: '', linkSent: false, rescheduleCount: 0
      }));
      const merged = appts.map(appt => ({ ...appt, ...appointments.find(a => a.id === appt.id) }));
      setAppointments(merged);
      localStorage.setItem('appointments', JSON.stringify(merged));
    } catch (err) {
      console.error(err); toast.error('Failed to fetch appointments');
    } finally { setLoading(false); }
  };
// ... existing code ...
const handleAccept = async id => {
  const appointment = appointments.find(x => x.id === id);
  if (!appointment) return;
  try {
    // First update to Confirmed and stay in confirmed tab
    const confirmedAppointment = {
      ...appointment,
      status: 'Confirmed',
      confirmedAt: new Date().toISOString(),
      doctorName: doctorName,
      isVisible: false // Keep hidden from PatientList initially
    };
    // Update in localStorage
    const updatedAppointments = appointments.map(a =>
      a.id === id ? confirmedAppointment : a
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    // Update in API
    await axios.put(`https://67e3e1e42ae442db76d2035d.mockapi.io/register/book/${id}`, confirmedAppointment);
    // Notify patient
    await notify(
  appointment.name,
  appointment.phone,
  `✅ Appointment confirmed with ${doctorName} on ${appointment.date} at ${appointment.time}.`,
  true
);
    toast.success('Appointment moved to confirmed tab');
    // Show transfer in progress toast
    const transferToast = toast.loading('Preparing for OPD list...');
    // Add 10 second delay before transferring to OPD list
    setTimeout(async () => {
      try {
        const transferData = {
          ...confirmedAppointment,
          patientListId: `PL_${id}`,
          transferredFrom: id,
          type: 'OPD',
          consultationStarted: false,
          consultationCompleted: false,
          advice: null,
          prescription: null,
          movedDate: null,
          isVisible: true // Make it visible in PatientList after delay
        };
        // Update in API
        await axios.put(`https://67e3e1e42ae442db76d2035d.mockapi.io/register/book/${id}`, transferData);
        // Update in localStorage
        const finalAppointments = appointments.map(a =>
          a.id === id ? transferData : a
        );
        setAppointments(finalAppointments);
        localStorage.setItem('appointments', JSON.stringify(finalAppointments));
        // Update toast to success
        toast.dismiss(transferToast);
        toast.success('Appointment now visible in OPD list');
      } catch (error) {
        console.error('Error transferring appointment:', error);
        toast.dismiss(transferToast);
        toast.error('Failed to transfer appointment. Please try again.');
      }
    }, 10000); // 10 seconds delay
  } catch (error) {
    console.error('Error accepting appointment:', error);
    toast.error('Failed to accept appointment');
  }
};
// ... existing code ...
  const handleReject = async id => {
    const reason = reasons[id] || 'No reason given', a = appointments.find(x => x.id === id);
    updateStatus(id, { status: 'Rejected', rejectReason: reason });
    await axios.put(`https://67e3e1e42ae442db76d2035d.mockapi.io/register/book/${id}`, { status: 'Rejected', rejectReason: reason });
    await notify(a.name, a.phone, `:x: Appointment rejected.\nReason: ${reason}`);
    setRejectId(null); toast.success('Appointment rejected');
  };
  const handleReschedule = async id => {
    const { date, time } = reschedule, a = appointments.find(x => x.id === id);
    if (!date || !time) return;
    if (a.rescheduleCount >= 2) {
      updateStatus(id, { status: 'Rejected', rejectReason: 'Auto-cancelled after 2 reschedules' });
      await axios.put(`https://67e3e1e42ae442db76d2035d.mockapi.io/register/book/${id}`, { status: 'Rejected', rejectReason: 'Auto-cancelled after 2 reschedules' });
      await notify(a.name, a.phone, `:x: Appointment automatically cancelled after 2 reschedules.`);
      toast.success('Appointment automatically cancelled after 2 reschedules');
    } else {
      updateStatus(id, { date, time, rescheduleCount: a.rescheduleCount + 1 });
      await axios.put(`https://67e3e1e42ae442db76d2035d.mockapi.io/register/book/${id}`, { date, time, rescheduleCount: a.rescheduleCount + 1 });
      await notify(a.name, a.phone, `:calendar: Rescheduled to ${date} at ${time}`);
      setRescheduleId(null); setReschedule({ date: '', time: '' }); toast.success('Appointment rescheduled');
    }
  };
  const handleDeleteRejected = id => {
    updateStatus(id, () => null);
    const filtered = appointments.filter(a => a.id !== id);
    setAppointments(filtered);
    localStorage.setItem('appointments', JSON.stringify(filtered));
    toast.success('Rejected appointment deleted');
  };
  useEffect(() => { fetchAppointments(); }, []);
  const renderRow = (appt, type) => (
    <tr key={appt.id} className='text-center'>
      <td className="px-3 py-2">{appt.name}</td><td className="px-3 py-2">{appt.date}</td>
      <td className="px-3 py-2">{appt.time}</td><td className="px-3 py-2">{appt.reason}</td>
      <td className="px-3 py-2">{appt.type}</td>
      <td className="px-3 py-2">
        {type === 'pending' && <>
          <button onClick={() => handleAccept(appt.id)} className="bg-[#0E1630] text-white px-2 py-1 rounded">Accept</button>
          <button onClick={() => setRejectId(appt.id)} className="border-2 border-[#F4C430] text-[#0E1630] px-2 py-1 rounded ml-2">Reject</button>
        </>}
        {type === 'confirmed' && <button onClick={() => setRescheduleId(appt.id)} className="bg-yellow-500 text-black px-2 py-1 rounded">Reschedule</button>}
        {type === 'rejected' && <p className="text-sm text-red-500">Reason: {appt.rejectReason}
          <button onClick={() => handleDeleteRejected(appt.id)} className="bg-red-600 text-white mt-2 text-sm px-2 py-1 rounded ml-2">Delete</button></p>}
      </td>
    </tr>
  );
  return (
    <div className="p-6 min-h-screen">
      <Toaster />
      <h1 className="text-xl font-bold mb-6">{doctorName}'s Appointments</h1>
      <div className="flex gap-3 mb-4">
        {['pending', 'confirmed', 'rejected'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === t ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <table className="min-w-full bg-white border">
        <thead className="bg-[#0E1630] text-white">
          <tr>{['Name', 'Date', 'Time', 'Reason', 'Type', 'Action'].map(h => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
        </thead>
        <tbody>
          {appointments
            .filter(a => a?.status === tab.charAt(0).toUpperCase() + tab.slice(1))
            .slice(0, 4) // Limit to 4 recent appointments
            .map(appt => renderRow(appt, tab))}
        </tbody>
      </table>
      {rejectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Reject Appointment</h2>
            <textarea className="w-full border p-2 rounded" rows={3} placeholder="Reason for rejection" value={reasons[rejectId] || ''} onChange={e => setReasons(prev => ({ ...prev, [rejectId]: e.target.value }))} />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRejectId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
              <button onClick={() => handleReject(rejectId)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
            </div>
          </div>
        </div>
      )}
      {rescheduleId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Reschedule Appointment</h2>
            <input type="date" value={reschedule.date} onChange={e => setReschedule({ ...reschedule, date: e.target.value })} className="w-full mb-2 border p-2 rounded" />
            <input type="time" value={reschedule.time} onChange={e => setReschedule({ ...reschedule, time: e.target.value })} className="w-full border p-2 rounded" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRescheduleId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
              <button onClick={() => handleReschedule(rescheduleId)} className="bg-green-500 text-white px-3 py-1 rounded">Reschedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DoctorAppointments;