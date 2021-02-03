import { emit, on } from '../../../events';
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
  name: '',
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
  _modalContent.appendChild(_getCreateTaskModal());
  _showModal();
});

// DOM Helpers

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

  const { name, dueDate } = _createTaskFormData;
  const taskNameErrorMsgElm = document.querySelector('.form-error.name');
  const dueDateErrorMsgElm = document.querySelector('.form-error.dueDate');

  let hasError = false;

  if (!name) {
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

  console.log('Can submit');
}

function _onSubmitCreateProject(event) {
  event.preventDefault();

  const [ inputElm ] = event.target.elements;
  const { value } = inputElm;

  inputElm.value = '';

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
  const { value } = firstElementChild;

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
    _createTaskFormData[formDataPropName] = value;
    console.table(_createTaskFormData);
  }
}

// DOM Element Creation

function _getBaseModal() {
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

function _createFormInputHeading({ level = 'h4', textContent }) {
  const heading = document.createElement(level);
  heading.className = 'form-input-heading';
  heading.textContent = textContent;

  return heading;
}

function _createSubmitBtn(btnText) {
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn create';
  submitBtn.textContent = btnText;
  submitBtn.setAttribute('type', 'submit');

  return submitBtn;
}

function _createFormGroupElm({ children }) {
  const formGroupElm = document.createElement('div');
  formGroupElm.className = 'form-group';

  children.forEach(childElm => formGroupElm.appendChild(childElm));

  return formGroupElm;
}

function _getErrorMsgElm(propName) {
  const errorMsgElm = document.createElement('div');
  errorMsgElm.className = 'form-error ' + propName;

  return errorMsgElm;
}

function _getCreateTaskModal() {
  const { frag, modalHeading, form } = _getBaseModal();

  modalHeading.textContent = 'Create Task';
  form.addEventListener('submit', _onSubmitCreateTask);

  const taskNameHeadingElm = _createFormInputHeading({ textContent: 'Task Name' });
  const taskNameInputElm = document.createElement('input');
  taskNameInputElm.setAttribute('type', 'text');
  taskNameInputElm.className = 'form-input name';
  taskNameInputElm.addEventListener('input', _onCreateTaskFormInput('name'));
  const taskNameErrorMsgElm = _getErrorMsgElm('name');
  const taskNameGroupElm = _createFormGroupElm({
    children: [ taskNameHeadingElm, taskNameInputElm, taskNameErrorMsgElm ]
  });

  const taskDescriptionHeadingElm = _createFormInputHeading({ textContent: 'Description' });
  const taskDescriptionInputElm = document.createElement('textarea');
  taskDescriptionInputElm.setAttribute('rows', '8');
  taskDescriptionInputElm.className = 'form-input description';
  taskDescriptionInputElm.addEventListener('input', _onCreateTaskFormInput('description'));
  const taskDescriptionErrorMsgElm = _getErrorMsgElm('description');
  const taskDescriptionGroupElm = _createFormGroupElm({
    children: [
      taskDescriptionHeadingElm,
      taskDescriptionInputElm,
      taskDescriptionErrorMsgElm
    ]
  });

  const checklistDisplayHeading = _createFormInputHeading({ textContent: 'Checklist' });

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

  const dueDateHeadingElm = _createFormInputHeading({ textContent: 'Due Date' });
  const dueDateInputElm = document.createElement('input');
  dueDateInputElm.setAttribute('type', 'date');
  dueDateInputElm.className = 'form-input dueDate';
  dueDateInputElm.addEventListener('input', _onCreateTaskFormInput('dueDate'));
  dueDateInputElm.addEventListener('change', _onCreateTaskFormInput('dueDate'));
  const dueDateErrorMsgElm = _getErrorMsgElm('dueDate');
  const dueDateGroupElm = _createFormGroupElm({
    children: [ dueDateHeadingElm, dueDateInputElm, dueDateErrorMsgElm ]
  });

  const priorityHeadingElm = _createFormInputHeading({ textContent: 'Priority' });
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
  const prioritySelectErrorElm = _getErrorMsgElm('priority');
  const priorityGroupElm = _createFormGroupElm({
    children: [ priorityHeadingElm, prioritySelectInputElm, prioritySelectErrorElm ]
  });

  const submitBtn = _createSubmitBtn('Create');

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
  const { frag, modalHeading, form } = _getBaseModal();

  modalHeading.textContent = 'Create Project';
  form.addEventListener('submit', _onSubmitCreateProject);

  const projectNameHeadingElm = _createFormInputHeading({ textContent: 'Project Name ' });
  const projectNameInputElm = document.createElement('input');
  projectNameInputElm.setAttribute('type', 'text');
  projectNameInputElm.className = 'form-input';
  const projectNameGroup = _createFormGroupElm({
    children: [ projectNameHeadingElm, projectNameInputElm ]
  })

  const submitBtn = _createSubmitBtn('Create');

  form.appendChild(projectNameGroup);
  form.appendChild(submitBtn);

  frag.appendChild(modalHeading);
  frag.appendChild(form);

  return frag;
}

export default modal;