import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface StoreSwitchConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const StoreSwitchConfirmDialog: React.FC<StoreSwitchConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-orange-600" size={24} />
          <h2 className="text-lg font-semibold text-gray-900">Switch Stores?</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Switching stores will clear your current cart. Do you want to continue?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Keep Shopping
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Switching...' : 'Switch Store'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSwitchConfirmDialog;
