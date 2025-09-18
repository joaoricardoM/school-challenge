import React, { useEffect, useMemo, useState } from "react";
import degreesData from "../data/degrees.json";
import classesData from "../data/classes.json";
import studentsData from "../data/students.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDegreeName } from "./Teachers"; // Importação corrigida

const classes = classesData.classes;

const studentsPerPage = 10;

function getClassName(id) {
  const c = classes[id - 1];
  return c ? c.name : "#" + id;
}

export default function Students() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");
    return savedStudents ? JSON.parse(savedStudents) : studentsData;
  });
  const [filterDegree, setFilterDegree] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

   useEffect(()=>{
    // load initial students (deep copy)
    setStudents(studentsData.map(s=>({...s})))
  },[])


  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const filtered = useMemo(() => {
    setCurrentPage(1);
    return students.filter((s) => {
      if (filterDegree && String(s.degreeId) !== String(filterDegree))
        return false;
      if (filterClass && String(s.classId) !== String(filterClass))
        return false;
      return true;
    });
  }, [students, filterDegree, filterClass]);

  const totalPages = Math.ceil(filtered.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filtered.slice(indexOfFirstStudent, indexOfLastStudent);

  function updateStudent(id, patch) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  }

  function add300() {
    const startId = students.length
      ? Math.max(...students.map((s) => s.id)) + 1
      : 1;
    const newStudents = Array.from({ length: 300 }).map((_, i) => {
      const id = startId + i;
      const degree =
        degreesData[Math.floor(Math.random() * degreesData.length)];
      const classId = Math.floor(Math.random() * classes.length) + 1;
      return {
        id,
        ra: Math.floor(100000 + Math.random() * 900000),
        name: `Aluno ${id}`,
        degreeId: degree.id,
        classId,
      };
    });
    setStudents((prev) => [...prev, ...newStudents]);
  }

  const chartData = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      const name = getDegreeName(s.degreeId);
      map[name] = (map[name] || 0) + 1;
    });
    return Object.keys(map).map((k) => ({ name: k, students: map[k] }));
  }, [students]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            <select
              className="select"
              value={filterDegree}
              onChange={(e) => setFilterDegree(e.target.value)}
            >
              <option value="">— Todos os graus —</option>
              {degreesData.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              className="select"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">— Todas as salas —</option>
              {classes.map((c, idx) => (
                <option key={idx} value={idx + 1}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <button className="btn" onClick={add300}>
              Adicionar estudantes
            </button>
            <div className="text-sm text-gray-600">
              Total: {students.length}
            </div>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Grau</th>
              <th>Aulas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((s) => (
              <Row
                key={s.id}
                student={s}
                onChange={(patch) => updateStudent(s.id, patch)}
              />
            ))}
            {currentStudents.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Nenhum Estudante
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
              className="btn"
            >
              Anterior
            </button>
            <span className="text-gray-600">Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              className="btn"
            >
              Próximo
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Alunos por grau</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Row({ student, onChange }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [classId, setClassId] = useState(student.classId);

  useEffect(() => {
    setName(student.name);
    setClassId(student.classId);
  }, [student.name, student.classId]);

  function save() {
    onChange({ name, classId: Number(classId) });
    setEditing(false);
  }

  return (
    <tr>
      <td>{student.id}</td>
      <td>
        {editing ? (
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          student.name
        )}
      </td>
      <td>{getDegreeName(student.degreeId)}</td>
      <td>
        {editing ? (
          <select
            className="select"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <option key={i} value={i + 1}>
                {getClassName(i + 1)}
              </option>
            ))}
          </select>
        ) : (
          getClassName(student.classId)
        )}
      </td>
      <td>
        {editing ? (
          <>
            <button className="btn mr-2" onClick={save}>
              Salvar
            </button>
            <button
              className="inline-block px-3 py-1 border rounded"
              onClick={() => setEditing(false)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            className="inline-block px-3 py-1 border rounded"
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
        )}
      </td>
    </tr>
  );
}
