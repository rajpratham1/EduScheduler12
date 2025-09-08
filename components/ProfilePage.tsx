// components/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { getUser, upsertUser, AVATAR_LIST } from '../services/firebase.ts';
import type { User } from '../types.ts';

interface ProfilePageProps {
  user: any;
  onNavigate: (page: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate }) => {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [mobile, setMobile] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    async function load(){
      if (!user) return;
      // try to find user doc by uid in students/faculty/admins
      const possibleRoles = ['students','faculty','admins'];
      for (const r of possibleRoles){
        const doc = await getUser(r, user.uid || user.phoneNumber || user.email);
        if (doc){ setProfile({...doc, role: r}); setName(doc.name||''); setAvatar(doc.avatar||''); setMobile(doc.mobile||''); break;}
      }
    }
    load();
  },[user]);

  const handleSave = async (e:any) => {
    e?.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await upsertUser(profile.role==='faculty'?'faculty':profile.role==='admins'?'admins':'students', profile.uid, {
        name, avatar, mobile, updatedAt: Date.now()
      });
      alert('Profile saved');
      onNavigate('student'); // redirect to dashboard (could be improved)
    } catch (e:any){
      alert('Save failed: '+(e.message||e));
    } finally { setSaving(false); }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      {!profile ? <p>Loading...</p> : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile</label>
            <input value={mobile} onChange={e=>setMobile(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Choose Avatar</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {AVATAR_LIST.map(a=> (
                <button key={a} type="button" onClick={()=>setAvatar(a)} className={"p-1 rounded "+(avatar===a?'ring-2 ring-indigo-500':'')}>
                  <img src={a} alt="avatar" width="60" height="60" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-indigo-600 text-white">{saving?'Saving...':'Save'}</button>
            <button type="button" onClick={()=>onNavigate('student')} className="px-4 py-2 rounded border">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
