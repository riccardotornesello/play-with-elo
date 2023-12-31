import { ModalButton } from './ModalButton';

export default {
  title: 'ModalButton',
};

export const Usage = () => (
  <ModalButton title="Example modal title" content={<div>Content</div>} h="100%">
    Open example modal
  </ModalButton>
);
