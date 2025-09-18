import React, { useState } from 'react'
import Students from './components/Students'
import Teachers from './components/Teachers'

export default function App(){
  const [screen, setScreen] = useState('students')
  return (
    <div className="container">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Desafio Escolar</h1>
        <nav className="flex gap-2">
          <button className={`btn ${screen==='students'?'opacity-100':'opacity-70'}`} onClick={()=>setScreen('students')}>Estudantes</button>
          <button className={`btn ${screen==='teachers'?'opacity-100':'opacity-70'}`} onClick={()=>setScreen('teachers')}>Professores</button>
        </nav>
      </header>

      {screen === 'students' ? <Students /> : <Teachers />}

      <footer className="mt-8 text-xs text-gray-500"></footer>
    </div>
  )
}
