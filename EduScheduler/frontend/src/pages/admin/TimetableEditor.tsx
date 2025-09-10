import { useState } from 'react'
import api from '@/api/client'

export default function TimetableEditor() {
  const [name, setName] = useState('Semester Plan')
  const [department, setDepartment] = useState('CSE')
  const [slots, setSlots] = useState<any[]>([])
  const addSlot = () => {
    setSlots(s => [...s, { day: 'Mon', startTime: '09:00', endTime: '09:50', courseCode:'C101', courseName:'Course', facultyId:'FAC1', roomId:'R101', batch:'B1' }])
  }
  const save = async () => { await api.post('/admin/timetable', { name, department, slots }); alert('Saved') }
  const generate = async () => {
    const payload = { department, semester:'S1', year:2025, use_gemini:true, courses:[{ code:'C101', name:'Course', perWeek:2, facultyId:'FAC1', batch:'B1' }], rooms:[{ id:'R101', capacity:60 }], faculty:[{ id:'FAC1'}], batches:[{ id:'B1'}], constraints:{} }
    const { data } = await api.post('/schedule/generate', payload)
    if (data.options?.[0]) { setSlots(data.options[0].slots || []) }
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Timetable Editor</h2>
      <div className="grid gap-3 max-w-2xl">
        <input className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" value={name} onChange={e=>setName(e.target.value)} />
        <input className="px-3 py-2 rounded bg-neutral-100 dark:bg-neutral-800" value={department} onChange={e=>setDepartment(e.target.value)} />
        <div className="flex gap-2">
          <button onClick={addSlot} className="px-3 py-2 rounded bg-neutral-200 dark:bg-neutral-800 w-fit">Add slot</button>
          <button onClick={generate} className="px-3 py-2 rounded bg-brand text-white">Generate (AI)</button>
        </div>
        <div className="grid gap-2">
          {slots.map((sl, i)=> (
            <div key={i} className="p-3 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-2 items-center">
              <input value={sl.day} onChange={e=>setSlots(prev=>prev.map((x,ix)=>ix===i?{...x, day:e.target.value}:x))} className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 w-20" />
              <input value={sl.startTime} onChange={e=>setSlots(prev=>prev.map((x,ix)=>ix===i?{...x, startTime:e.target.value}:x))} className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 w-24" />
              <input value={sl.endTime} onChange={e=>setSlots(prev=>prev.map((x,ix)=>ix===i?{...x, endTime:e.target.value}:x))} className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 w-24" />
              <input value={sl.courseCode} onChange={e=>setSlots(prev=>prev.map((x,ix)=>ix===i?{...x, courseCode:e.target.value}:x))} className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 w-24" />
              <input value={sl.roomId} onChange={e=>setSlots(prev=>prev.map((x,ix)=>ix===i?{...x, roomId:e.target.value}:x))} className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 w-24" />
              <input value={sl.facultyId} onChange={e=>setSlots(prev=>prev.map((x,ix)=>ix===i?{...x, facultyId:e.target.value}:x))} className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 w-24" />
              <input value={sl.batch||''} onChange={e=>setSlots(prev=>prev.map((x,ix)=>ix===i?{...x, batch:e.target.value}:x))} className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 w-24" />
            </div>
          ))}
        </div>
        <button onClick={save} className="px-4 py-2 rounded bg-brand text-white w-fit">Save timetable</button>
      </div>
    </div>
  )
}

