import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, confirmText = "Confirm", onConfirm, loading = false, danger = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col relative"
            >
              {title && <h3 className="text-xl font-bold text-white mb-4">{title}</h3>}
              
              <div className="text-textMuted mb-6 flex-1">
                {children}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                {onConfirm && (
                  <Button 
                    variant={danger ? 'danger' : 'primary'} 
                    onClick={onConfirm} 
                    isLoading={loading}
                  >
                    {confirmText}
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
