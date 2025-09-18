import React, { useEffect, useMemo, useState } from "react";
import relationshipsData from "../data/relationships.json";
import teachersData from "../data/teachers.json";
import mattersData from "../data/matters.json";
import degreesData from "../data/degrees.json";
import studentsData from "../data/students.json";
import classesData from "../data/classes.json";
import StudentsModal from "./Student";
import DeleteConfirmationModal from "./DeleteConfimationModal";

const degrees = degreesData;
const classes = classesData.classes;

export function getDegreeName(id) {
  const d = degrees.find((x) => x.id === id);
  return d ? d.name : "—";
}

function getClassName(posOrId) {
  const idx = Number(posOrId) - 1;
  return classes[idx] ? classes[idx].name : "#" + posOrId;
}

export default function Teachers() {
  const [relationships, setRelationships] = useState(() => {
    const savedRelationships = localStorage.getItem("relationships");
    return savedRelationships
      ? JSON.parse(savedRelationships)
      : relationshipsData;
  });
  const [filterDegree, setFilterDegree] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");
    return savedStudents ? JSON.parse(savedStudents) : studentsData;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDegreeStudents, setSelectedDegreeStudents] = useState([]);
  const [selectedDegreeId, setSelectedDegreeId] = useState(null);

  const [relationshipToDelete, setRelationshipToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("relationships", JSON.stringify(relationships));
  }, [relationships]);

  const visible = useMemo(() => {
    return relationships.filter((r) => {
      if (filterDegree) {
        const has = r.degrees.some(
          (d) => String(d.degreeId) === String(filterDegree)
        );
        if (!has) return false;
      }
      if (filterClass) {
        const has = r.degrees.some((d) =>
          d.classes.some(
            (c) => String(c.classPosition || c.classId) === String(filterClass)
          )
        );
        if (!has) return false;
      }
      return true;
    });
  }, [relationships, filterDegree, filterClass]);

  function showStudentsOfDegree(degreeId) {
    const list = students.filter(
      (s) => String(s.degreeId) === String(degreeId)
    );
    setSelectedDegreeStudents(list);
    setSelectedDegreeId(degreeId);
    setIsModalOpen(true);
  }

  function addRelationship(newRel) {
    // naive id
    const id = relationships.length
      ? Math.max(...relationships.map((r) => r.id)) + 1
      : 1;
    setRelationships((prev) => [{ ...newRel, id }, ...prev]); // Adiciona no início
  }

  function removeRelationship(id) {
    setRelationships((prev) => prev.filter((r) => r.id !== id));
    setIsDeleteModalOpen(false); // Fecha o modal de confirmação
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="card flex items-start justify-between w-[1250px]">
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

        <div>
          <RelationshipForm onAdd={addRelationship} />
        </div>
      </div>

      <div className="card w-[1250px]">
        <table className="table">
          <thead>
            <tr>
              <th>Professor</th>
              <th>Matéria</th>
              <th>Grau</th>
              <th>Classes</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const teacher = teachersData.find((t) => t.id === r.teacherId);
              const matter = mattersData.find((m) => m.id === r.matterId);
              return (
                <tr key={r.id}>
                  <td>{teacher ? teacher.name : "—"}</td>
                  <td>{matter ? matter.name : "—"}</td>
                  <td>
                    {r.degrees.map((d) => (
                      <div key={d.degreeId}>{getDegreeName(d.degreeId)}</div>
                    ))}
                  </td>
                  <td>
                    {r.degrees.map((d) => (
                      <div key={d.degreeId} className="mb-1">
                        <strong>{getDegreeName(d.degreeId)}:</strong>{" "}
                        {d.classes
                          .map((c) =>
                            getClassName(c.classPosition || c.classId)
                          )
                          .join(", ")}
                      </div>
                    ))}
                  </td>
                  <td>
                    <button
                      className="btn mr-2"
                      onClick={() =>
                        showStudentsOfDegree(r.degrees[0].degreeId)
                      }
                    >
                      Mostrar Alunos
                    </button>
                    <button
                      className="btn bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => {
                        setRelationshipToDelete(r.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Nenhum relacionamento
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <StudentsModal
          students={selectedDegreeStudents}
          onClose={() => setIsModalOpen(false)}
          degreeId={selectedDegreeId}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={() => removeRelationship(relationshipToDelete)}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

function RelationshipForm({ onAdd }) {
  const [teacherId, setTeacherId] = useState("");
  const [matterId, setMatterId] = useState("");
  const [degreeId, setDegreeId] = useState("");
  const [classPosition, setClassPosition] = useState("1");

  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!teacherId) newErrors.teacherId = "Selecione um professor.";
    if (!matterId) newErrors.matterId = "Selecione uma matéria.";
    if (!degreeId) newErrors.degreeId = "Selecione um grau.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function submit(e) {
    e.preventDefault();
    if (validate()) {
      const payload = {
        teacherId: Number(teacherId),
        matterId: Number(matterId),
        degrees: [
          {
            degreeId: Number(degreeId),
            classes: [{ classPosition: Number(classPosition) }],
          },
        ],
      };
      onAdd(payload);
      setTeacherId("");
      setMatterId("");
      setDegreeId("");
      setClassPosition("1");
      setErrors({});
    }
  }

  return (
    <form onSubmit={submit} className="flex items-start gap-2">
      <div className="flex flex-col ml-2">
        <select
          className="select"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        >
          <option value="">Professor</option>
          {teachersData.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {errors.teacherId && (
          <span className="text-red-500 text-xs mt-1">{errors.teacherId}</span>
        )}
      </div>
      <div className="flex flex-col">
        <select
          className="select"
          value={matterId}
          onChange={(e) => setMatterId(e.target.value)}
        >
          <option value="">Matéria</option>
          {mattersData.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        {errors.matterId && (
          <span className="text-red-500 text-xs mt-1">{errors.matterId}</span>
        )}
      </div>
      <div className="flex flex-col">
        <select
          className="select"
          value={degreeId}
          onChange={(e) => setDegreeId(e.target.value)}
        >
          <option value="">Grau</option>
          {degrees.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        {errors.degreeId && (
          <span className="text-red-500 text-xs mt-1">{errors.degreeId}</span>
        )}
      </div>
      <select
        className="select"
        value={classPosition}
        onChange={(e) => setClassPosition(e.target.value)}
      >
        {classes.map((c, idx) => (
          <option key={idx} value={idx + 1}>
            {c.name}
          </option>
        ))}
      </select>
      <button className="btn" type="submit">
        Adicionar
      </button>
    </form>
  );
}
