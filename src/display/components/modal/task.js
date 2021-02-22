import { emit, on } from '../../../events';

import { createBaseModal } from './index.js';

import {
  createFormInputHeadingElm,
  createSubmitBtnElm,
  createFormGroupElm,
  createErrorMsgElm,
} from '../../utils';

const _createTaskFormData = {
  title: '',
  description: '',
  checklist: [],
  dueDate: '',
  priority: 'normal',
};

on('openCreateTaskModal', () => {
  _clearCreateTaskFormData();
});

function _clearCreateTaskFormData() {
  _createTaskFormData.title = '';
  _createTaskFormData.description = '';
  _createTaskFormData.checklist = [];
  _createTaskFormData.dueDate = '';
  _createTaskFormData.priority = 'normal';
}

function _updateChecklistDisplay({ checklistFormElm, value }) {
  const checklistElm = checklistFormElm.previousElementSibling;

  if (!checklistElm) {
    return;
  }

  const checklistItemElm = document.createElement('li');
  checklistItemElm.textContent = value;
  checklistElm.appendChild(checklistItemElm);
}

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

  _createTaskFormData.checklist = _createTaskFormData.checklist.map((item) => {
    return { text: item, done: false };
  });

  emit('createTask', { newTask: _createTaskFormData });
  emit('hideModal');
}

function _onCreateTaskFormInput(formDataPropName) {
  return ({ target: { value } }) => {
    _createTaskFormData[formDataPropName] = value.trim();
  };
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
  _updateChecklistDisplay({ checklistFormElm: event.target, value });
  _createTaskFormData.checklist.push(value);
}

export function getCreateTaskModal() {
  const { frag, modalHeading, form } = createBaseModal();

  modalHeading.textContent = 'Create Task';
  form.addEventListener('submit', _onSubmitCreateTask);

  const taskNameHeadingElm = createFormInputHeadingElm({
    textContent: 'Task Name',
  });
  const taskNameInputElm = document.createElement('input');
  taskNameInputElm.setAttribute('type', 'text');
  taskNameInputElm.className = 'form-input title';
  taskNameInputElm.addEventListener('input', _onCreateTaskFormInput('title'));
  const taskNameErrorMsgElm = createErrorMsgElm('title');
  const taskNameGroupElm = createFormGroupElm({
    children: [taskNameHeadingElm, taskNameInputElm, taskNameErrorMsgElm],
  });

  const taskDescriptionHeadingElm = createFormInputHeadingElm({
    textContent: 'Description',
  });
  const taskDescriptionInputElm = document.createElement('textarea');
  taskDescriptionInputElm.setAttribute('rows', '8');
  taskDescriptionInputElm.className = 'form-input description';
  taskDescriptionInputElm.addEventListener(
    'input',
    _onCreateTaskFormInput('description')
  );
  const taskDescriptionErrorMsgElm = createErrorMsgElm('description');
  const taskDescriptionGroupElm = createFormGroupElm({
    children: [
      taskDescriptionHeadingElm,
      taskDescriptionInputElm,
      taskDescriptionErrorMsgElm,
    ],
  });

  const checklistDisplayHeading = createFormInputHeadingElm({
    textContent: 'Checklist',
  });

  const checklistDisplay = document.createElement('ul');
  checklistDisplay.className = 'checklist-display';

  const checklistForm = document.createElement('form');
  const checklistItemInputElm = document.createElement('input');
  checklistItemInputElm.className = 'form-input';
  checklistItemInputElm.setAttribute('type', 'text');
  checklistItemInputElm.setAttribute('placeholder', 'Checklist Item');
  checklistForm.appendChild(checklistItemInputElm);
  checklistForm.addEventListener('submit', _onAddChecklistItem);
  checklistForm.className = 'form-group';

  const dueDateHeadingElm = createFormInputHeadingElm({
    textContent: 'Due Date',
  });
  const dueDateInputElm = document.createElement('input');
  dueDateInputElm.setAttribute('type', 'date');
  dueDateInputElm.className = 'form-input dueDate';
  dueDateInputElm.addEventListener('input', _onCreateTaskFormInput('dueDate'));
  dueDateInputElm.addEventListener('change', _onCreateTaskFormInput('dueDate'));
  const dueDateErrorMsgElm = createErrorMsgElm('dueDate');
  const dueDateGroupElm = createFormGroupElm({
    children: [dueDateHeadingElm, dueDateInputElm, dueDateErrorMsgElm],
  });

  const priorityHeadingElm = createFormInputHeadingElm({
    textContent: 'Priority',
  });
  const prioritySelectInputElm = document.createElement('select');
  prioritySelectInputElm.className = 'form-input priority';
  prioritySelectInputElm.setAttribute('name', 'priority');
  ['normal', 'important', 'urgent'].forEach((level) => {
    const priorityOptionElm = document.createElement('option');
    priorityOptionElm.setAttribute('value', level);
    priorityOptionElm.textContent = level[0].toUpperCase() + level.slice(1);
    prioritySelectInputElm.appendChild(priorityOptionElm);
  });
  prioritySelectInputElm.addEventListener(
    'input',
    _onCreateTaskFormInput('priority')
  );
  const prioritySelectErrorElm = createErrorMsgElm('priority');
  const priorityGroupElm = createFormGroupElm({
    children: [
      priorityHeadingElm,
      prioritySelectInputElm,
      prioritySelectErrorElm,
    ],
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
  ].forEach((child) => form.appendChild(child));

  frag.appendChild(form);

  return frag;
}
