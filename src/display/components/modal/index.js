import { on } from '../../../events';

import { getCreateProjectModal } from './project';
import { getCreateTaskModal } from './task';

import './style.css';

const modal = document.createElement('div');
modal.className = 'modal hide';

let _modalContent = document.createElement('div');
_modalContent.className = 'modal-content';
_modalContent.appendChild(getCreateProjectModal());

modal.appendChild(_modalContent);

modal.addEventListener('click', (event) => {
  const { target } = event;

  if (target.classList.contains('show')) {
    _hideModal();
  }
});

on('openCreateProjectModal', () => {
  _clearModalContent();
  _modalContent.appendChild(getCreateProjectModal());
  _showModal();
});

on('openCreateTaskModal', () => {
  _clearModalContent();
  _modalContent.appendChild(getCreateTaskModal());
  _showModal();
  _modalContent.firstElementChild.scrollIntoView();
});

on('showModal', () => {
  _showModal();
});

on('hideModal', () => {
  _hideModal();
});

function _clearModalContent() {
  const modalContentChildren = Array.from(_modalContent.children);

  modalContentChildren.forEach((childElm) => {
    _modalContent.removeChild(childElm);
  });
}

function _showModal() {
  modal.classList.remove('hide');
  modal.classList.add('show');
}

function _hideModal() {
  modal.classList.remove('show');
  modal.classList.add('hide');
}

export function createBaseModal() {
  const frag = document.createDocumentFragment();

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.className = 'btn delete close';
  closeBtn.addEventListener('click', _hideModal);
  frag.appendChild(closeBtn);

  const modalHeading = document.createElement('h2');
  modalHeading.className = 'heading';
  frag.appendChild(modalHeading);

  const form = document.createElement('form');
  form.className = 'form create-form';
  form.setAttribute('novalidate', '');

  return { frag, modalHeading, form };
}

export default modal;
