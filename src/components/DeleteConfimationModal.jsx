import React from 'react';

export default function DeleteConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
        <p className="mb-4">Tem certeza de que deseja excluir este relacionamento? Esta ação é irreversível.</p>
        <div className="flex justify-end gap-2">
          <button className="btn bg-gray-300 hover:bg-gray-400" onClick={onCancel}>Cancelar</button>
          <button className="btn bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
}