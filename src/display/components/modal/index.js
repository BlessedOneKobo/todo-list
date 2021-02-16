import { emit, on } from '../../../events';

import {
  createFormInputHeadingElm,
  createSubmitBtnElm,
  createFormGroupElm,
  createErrorMsgElm
} from '../../utils';

import './style.css';

const modal = document.createElement('div');
modal.className = 'modal hide'

let _modalContent = document.createElement('div');
_modalContent.className = 'modal-content';
_modalContent.appendChild(_getCreateProjectModal());

modal.appendChild(_modalContent);

modal.addEventListener('click', (event) => {
  const { target } = event;

  if (target.classList.contains('show')) {
    _hideModal()
  }
});

const _createTaskFormData = {
  title: '',
  description: '',
  checklist: [],
  dueDate: '',
  priority: 'normal',
};

on('openCreateProjectModal', () => {
  _clearModalContent();
  _modalContent.appendChild(_getCreateProjectModal());
  _showModal()
});

on('openCreateTaskModal', () => {
  _clearModalContent();
  _clearCreateTaskFormData();
  _modalContent.appendChild(_getCreateTaskModal());
  _showModal();
  _modalContent.firstElementChild.scrollIntoView();
});

// DOM Helpers
function _createBaseModal() {
  const frag = document.createDocumentFragment();

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.className = 'btn delete close';
  closeBtn.addEventListener('click', _hideModal);
  frag.appendChild(closeBtn)

  const modalHeading = document.createElement('h2');
  modalHeading.className = 'heading';
  frag.appendChild(modalHeading);

  const form = document.createElement('form');
  form.className = 'form create-form';
  form.setAttribute('novalidate', '');

  return { frag, modalHeading, form };
}

function _clearCreateTaskFormData() {
  _createTaskFormData.title = '';
  _createTaskFormData.description = '';
  _createTaskFormData.checklist = [];
  _createTaskFormData.dueDate = '';
  _createTaskFormData.priority = 'normal';
}

function _clearModalContent() {
  const modalContentChildren = Array.from(_modalContent.children);

  modalContentChildren.forEach(childElm => {
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

function _updateChecklistDisplay(value) {
  const checklistElm = _modalContent.querySelector('.checklist-display');

  if (!checklistElm) {
    return;
  }

  const checklistItemElm = document.createElement('li');
  checklistItemElm.textContent = value;
  checklistElm.appendChild(checklistItemElm);
}

// DOM Event Handlers

function _onSubmitCreateTask(event) {
  event.preventDefault();

  const { title, dueDate } = _createTaskFormData;
  const taskNameErrorMsgElm = document.querySelector('.form-error.title');
  const dueDateErrorMsgElm = document.querySelector('.form-error.dueDate');

  let hasError = false;

  if (!title) {
    hasError = true;
    taskNameErrorMsgElm.textContent = 'Required';
  } else {
    taskNameErrorMsgElm.textContent = '';
  }

  if (!dueDate) {
    hasError = true;
    dueDateErrorMsgElm.textContent = 'Required';
  } else {
    dueDateErrorMsgElm.textContent = '';
  }

  if (hasError) {
    return;
  }

  _createTaskFormData.checklist = _createTaskFormData.checklist.map(item => {
    return { text: item, done: false }
  });
  emit('createTask', { newTask: _createTaskFormData });
  _hideModal();
}

function _onSubmitCreateProject(event) {
  event.preventDefault();

  const [ inputElm ] = event.target.elements;
  let { value } = inputElm;
  value = value.trim();

  if (!value) {
    return;
  }

  emit('createProject', { projectName: value });
  _hideModal();
  inputElm.value = '';
}

function _onAddChecklistItem(event) {
  event.preventDefault();

  const { firstElementChild } = event.target;
  let { value } = firstElementChild;
  value = value.trim();

  if (!value) {
    return;
  }

  firstElementChild.value = '';
  _updateChecklistDisplay(value);
  _createTaskFormData.checklist.push(value);
  console.table(_createTaskFormData);
}

function _onCreateTaskFormInput(formDataPropName) {
  return ({ target: { value }}) => {
    _createTaskFormData[formDataPropName] = value.trim();
    console.table(_createTaskFormData);
  }
}

// DOM Element Creation
function _getCreateTaskModal() {
  const { frag, modalHeading, form } = _createBaseModal();

  modalHeading.textContent = 'Create Task';
  form.addEventListener('submit', _onSubmitCreateTask);

  const taskNameHeadingElm = createFormInputHeadingElm({ textContent: 'Task Name' });
  const taskNameInputElm = document.createElement('input');
  taskNameInputElm.setAttribute('type', 'text');
  taskNameInputElm.className = 'form-input title';
  taskNameInputElm.addEventListener('input', _onCreateTaskFormInput('title'));
  const taskNameErrorMsgElm = createErrorMsgElm('title');
  const taskNameGroupElm = createFormGroupElm({
    children: [ taskNameHeadingElm, taskNameInputElm, taskNameErrorMsgElm ]
  });

  const taskDescriptionHeadingElm = createFormInputHeadingElm({ textContent: 'Description' });
  const taskDescriptionInputElm = document.createElement('textarea');
  taskDescriptionInputElm.setAttribute('rows', '8');
  taskDescriptionInputElm.className = 'form-input description';
  taskDescriptionInputElm.addEventListener('input', _onCreateTaskFormInput('description'));
  const taskDescriptionErrorMsgElm = createErrorMsgElm('description');
  const taskDescriptionGroupElm = createFormGroupElm({
    children: [
      taskDescriptionHeadingElm,
      taskDescriptionInputElm,
      taskDescriptionErrorMsgElm
    ]
  });

  const checklistDisplayHeading = createFormInputHeadingElm({ textContent: 'Checklist' });

  const checklistDisplay = document.createElement('ul');
  checklistDisplay.className = 'checklist-display'

  const checklistForm = document.createElement('form');
  const checklistItemInputElm = document.createElement('input');
  checklistItemInputElm.className = 'form-input';
  checklistItemInputElm.setAttribute('type', 'text');
  checklistItemInputElm.setAttribute('placeholder', 'Checklist Item');
  checklistForm.appendChild(checklistItemInputElm);
  checklistForm.addEventListener('submit', _onAddChecklistItem);
  checklistForm.className = 'form-group';

  const dueDateHeadingElm = createFormInputHeadingElm({ textContent: 'Due Date' });
  const dueDateInputElm = document.createElement('input');
  dueDateInputElm.setAttribute('type', 'date');
  dueDateInputElm.className = 'form-input dueDate';
  dueDateInputElm.addEventListener('input', _onCreateTaskFormInput('dueDate'));
  dueDateInputElm.addEventListener('change', _onCreateTaskFormInput('dueDate'));
  const dueDateErrorMsgElm = createErrorMsgElm('dueDate');
  const dueDateGroupElm = createFormGroupElm({
    children: [ dueDateHeadingElm, dueDateInputElm, dueDateErrorMsgElm ]
  });

  const priorityHeadingElm = createFormInputHeadingElm({ textContent: 'Priority' });
  const prioritySelectInputElm = document.createElement('select');
  prioritySelectInputElm.className = 'form-input priority';
  prioritySelectInputElm.setAttribute('name', 'priority');
  ['normal', 'important', 'urgent'].forEach(level => {
    const priorityOptionElm = document.createElement('option');
    priorityOptionElm.setAttribute('value', level);
    priorityOptionElm.textContent = level[0].toUpperCase() + level.slice(1);
    prioritySelectInputElm.appendChild(priorityOptionElm);
  });
  prioritySelectInputElm.addEventListener('input', _onCreateTaskFormInput('priority'));
  const prioritySelectErrorElm = createErrorMsgElm('priority');
  const priorityGroupElm = createFormGroupElm({
    children: [ priorityHeadingElm, prioritySelectInputElm, prioritySelectErrorElm ]
  });

  const submitBtn = createSubmitBtnElm('Create');

  [
    taskNameGroupElm,
    taskDescriptionGroupElm,
    checklistDisplayHeading,
    checklistDisplay,
    checklistForm,
    dueDateGroupElm,
    priorityGroupElm,
    submitBtn,
  ].forEach(child => form.appendChild(child));

  frag.appendChild(form);

  return frag;
}

function _getCreateProjectModal() {
  const { frag, modalHeading, form } = _createBaseModal();

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

export default modal;