// components/AdminPanel.tsx
import React from 'react';

const AdminPanel: React.FC = () => {
    return (
        <div>
            {/* This component is deprecated and replaced by AdminDashboard. */}
        </div>
    );
};

export default AdminPanel;


/* --- Added section: Admin quick actions --- */
import React, { useState } from 'react';
import { generateUniqueId, upsertUser } from '../services/firebase.ts';
import { setScheduleConfig } from '../services/api.ts';

export const AdminQuickActions: React.FC = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'faculty'|'student'>('faculty');
  const [mobile, setMobile] = useState('');
  const [days, setDays] = useState('Monday,Tuesday,Wednesday,Thursday,Friday');
  const [times, setTimes] = useState('09:00,10:00,11:00,12:00');

  const handleCreate = async () => {
    const uid = generateUniqueId(role==='faculty'?'FAC':'STD');
    await upsertUser(role==='faculty'?'faculty':'students', uid, { uid, name, mobile, createdAt: Date.now() });
    alert('Created: '+uid);
  };

  const handleSaveConfig = async () => {
    const daysArr = days.split(',').map(s=>s.trim()).filter(Boolean);
    const timesArr = times.split(',').map(s=>s.trim()).filter(Boolean);
    await setScheduleConfig(daysArr, timesArr);
    alert('Schedule config saved');
  };

  return (
    <div className="p-4 border rounded mt-4">
      <h3 className="font-semibold mb-2">Admin Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="p-2 border rounded" />
        <input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Mobile" className="p-2 border rounded" />
        <select value={role} onChange={e=>setRole(e.target.value as any)} className="p-2 border rounded">
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
        <button onClick={handleCreate} className="p-2 bg-indigo-600 text-white rounded">Create User</button>
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Schedule config (days,times)</h4>
        <input value={days} onChange={e=>setDays(e.target.value)} className="mt-1 p-2 w-full border rounded" />
        <input value={times} onChange={e=>setTimes(e.target.value)} className="mt-1 p-2 w-full border rounded" />
        <button onClick={handleSaveConfig} className="mt-2 p-2 bg-green-600 text-white rounded">Save Schedule Config</button>
      </div>
    </div>
  );
};

export default AdminPanel;
