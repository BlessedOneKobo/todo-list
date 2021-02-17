import { emit } from '../../../events';

import { createBaseModal } from './index.js';

import {
  createFormGroupElm,
  createFormInputHeadingElm,
  createSubmitBtnElm
} from '../../utils';


function _onSubmitCreateProject(event) {
  event.preventDefault();

  const [ inputElm ] = event.target.elements;
  let { value } = inputElm;
  value = value.trim();

  if (!value) {
    return;
  }

  inputElm.value = '';
  emit('createProject', { projectName: value });
  emit('hideModal');
}

export function getCreateProjectModal() {
  const { frag, modalHeading, form } = createBaseModal();

  modalHeading.textContent = 'Create Project';
  form.addEventListener('submit', _onSubmitCreateProject);

  const projectNameHeadingElm = createFormInputHeadingElm({ textContent: 'Project Name ' });
  const projectNameInputElm = document.createElement('input');
  projectNameInputElm.setAttribute('type', 'text');
  projectNameInputElm.className = 'form-input';
  const projectNameGroup = createFormGroupElm({
    children: [ projectNameHeadingElm, projectNameInputElm ]
  })

  const submitBtn = createSubmitBtnElm('Create');

  form.appendChild(projectNameGroup);
  form.appendChild(submitBtn);

  frag.appendChild(modalHeading);
  frag.appendChild(form);

  return frag;
}