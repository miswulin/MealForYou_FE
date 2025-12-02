import React from 'react';
import styles from './TermsModal.module.css';

const TermsModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        <div className={styles.modalContent}>
          {content}
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.confirmButton}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
