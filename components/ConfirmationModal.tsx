import React from 'react';
import { WarningIcon } from './icons/WarningIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-2xl p-8 shadow-2xl w-full max-w-md animate-fade-in-up border border-border">
        <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
                <WarningIcon className="w-10 h-10 text-danger"/>
            </div>
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            <p className="text-text-secondary my-4">
              Você tem certeza que deseja deletar <br/><span className="font-bold text-text-primary">"{itemName}"</span>?
              <br/>Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center space-x-4 mt-4 w-full">
              <button onClick={onClose} className="w-full px-4 py-2.5 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 font-semibold transition-colors">
                Cancelar
              </button>
              <button onClick={onConfirm} className="w-full px-4 py-2.5 bg-danger text-white rounded-lg hover:bg-danger-hover font-semibold transition-colors">
                Deletar
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;