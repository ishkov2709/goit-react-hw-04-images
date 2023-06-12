import { Img, ModalBox, Overlay } from './Modal.styled';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ url, value, reset }) => {
  useEffect(() => {
    const handleKeyCloseModal = ({ code }) => {
      if (code === 'Escape') return reset();
    };
    window.addEventListener('keydown', handleKeyCloseModal);
    return () => {
      window.removeEventListener('keydown', handleKeyCloseModal);
    };
  }, [reset]);

  const handleClickCloseModal = ({ currentTarget, target }) => {
    if (currentTarget === target) return reset();
  };

  return createPortal(
    <Overlay onClick={handleClickCloseModal}>
      <ModalBox>
        <Img src={url} alt={value} />
      </ModalBox>
    </Overlay>,
    modalRoot
  );
};

export default Modal;

Modal.propTypes = {
  url: PropTypes.string,
  value: PropTypes.string,
  reset: PropTypes.func,
};
