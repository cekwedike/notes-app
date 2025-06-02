import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} className="confirm-dialog">
      <h3 className="confirm-dialog-title">{title}</h3>
      <p className="confirm-dialog-message">{message}</p>
      <div className="confirm-dialog-actions">
        <button onClick={onClose} className="cancel-btn">Cancel</button>
        <button onClick={handleConfirm} className="delete-btn">Delete</button>
      </div>
    </dialog>
  );
}; 