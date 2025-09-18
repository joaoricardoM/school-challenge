import React, { useState } from 'react';
import { getDegreeName } from './Teachers'; // Importa a função do arquivo Teachers.jsx

const studentsPerPage = 20;

export default function StudentsModal({ students, onClose, degreeId }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (!students || students.length === 0) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Alunos</h2>
            <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
              &times;
            </button>
          </div>
          <p className="text-center text-gray-600">Nenhum aluno encontrado para este curso.</p>
        </div>
      </div>
    );
  }

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(students.length / studentsPerPage);
  const degreeName = getDegreeName(degreeId);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Alunos para {degreeName}</h2>
          <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <table className="table w-full mb-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>RA</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.ra}</td>
                <td>{s.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn"
            >
              Anterior 
            </button>
            <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn"
            >
              Proximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}