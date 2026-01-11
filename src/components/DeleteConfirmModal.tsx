"use client";

import { useState } from "react";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  recipeName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function DeleteConfirmModal({
  isOpen,
  recipeName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const [error, setError] = useState<string>("");

  const handleConfirm = async () => {
    try {
      setError("");
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete recipe");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-2 border-red-500 rounded-lg p-6 max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold text-red-400">Delete Recipe?</h2>

        <p className="text-yellow-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold">&quot;{recipeName}&quot;</span>? This action cannot
          be undone.
        </p>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-yellow-300 font-semibold rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded transition-colors"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
