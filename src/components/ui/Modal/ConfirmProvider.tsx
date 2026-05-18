import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';
import './ConfirmModal.css';

export type ConfirmType = 'danger' | 'warning' | 'info';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions | null;
  }>({
    isOpen: false,
    options: null,
  });

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    setModalState({
      isOpen: true,
      options: {
        title: options.title || 'Confirm Action',
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'info',
      },
    });

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    if (resolverRef.current) {
      resolverRef.current(true);
    }
    setModalState({ isOpen: false, options: null });
  };

  const handleCancel = () => {
    if (resolverRef.current) {
      resolverRef.current(false);
    }
    setModalState({ isOpen: false, options: null });
  };

  const { isOpen, options } = modalState;

  /* Scroll Lock Logic */
  useScrollLock(isOpen);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {isOpen && options && (
          <div className="confirm-modal-portal">
            <motion.div
              className="confirm-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
            />
            <div className="confirm-modal-wrapper">
              <motion.div
                className={`confirm-modal-box confirm-modal-box--${options.type}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
              >
                <div className="confirm-modal-icon-container">
                  {options.type === 'danger' && <AlertTriangle className="confirm-modal-icon" />}
                  {options.type === 'warning' && <AlertTriangle className="confirm-modal-icon" />}
                  {options.type === 'info' && <Info className="confirm-modal-icon" />}
                </div>

                <div className="confirm-modal-content">
                  <h3 className="confirm-modal-title">{options.title}</h3>
                  <p className="confirm-modal-message">{options.message}</p>
                </div>

                <div className="confirm-modal-actions">
                  <button className="confirm-modal-btn confirm-modal-btn--cancel" onClick={handleCancel}>
                    {options.cancelText}
                  </button>
                  <button 
                    className={`confirm-modal-btn confirm-modal-btn--confirm confirm-modal-btn--${options.type}`} 
                    onClick={handleConfirm}
                  >
                    {options.confirmText}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
};
