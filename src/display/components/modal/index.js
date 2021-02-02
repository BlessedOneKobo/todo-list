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

function _onSubmitCreateTask(event) {
  event.preventDefault();

  console.log('_onSubmitCreateTask');
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

function _updateChecklistDisplay(value) {
  const checklistElm = _modalContent.querySelector('.checklist-display');

  if (!checklistElm) {
    return;
  }

  const checklistItemElm = document.createElement('li');
  checklistItemElm.textContent = value;
  checklistElm.appendChild(checklistItemElm);
}

function _addChecklistItem(event) {
  event.preventDefault();

  const { firstElementChild } = event.target;
  const { value } = firstElementChild;

  if (!value) {
    return;
  }

  firstElementChild.value = '';
  _updateChecklistDisplay(value);
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

function _getCreateTaskModal() {
  const { frag, modalHeading, form } = _getBaseModal();

  modalHeading.textContent = 'Create Task';
  form.addEventListener('submit', _onSubmitCreateTask);

  const taskNameInputElm = document.createElement('input');
  taskNameInputElm.setAttribute('type', 'text');
  taskNameInputElm.setAttribute('placeholder', 'Task Name');
  taskNameInputElm.className = 'form-input';

  const taskDescriptionInputElm = document.createElement('textarea');
  taskDescriptionInputElm.setAttribute('placeholder', 'Description');
  taskDescriptionInputElm.setAttribute('rows', '8');
  taskDescriptionInputElm.className = 'form-input';

  const checklistDisplayHeading = _createFormInputHeading({ textContent: 'Checklist' });

  const checklistDisplay = document.createElement('ul');
  checklistDisplay.className = 'checklist-display'

  const checklistForm = document.createElement('form');
  const checklistItemInputElm = document.createElement('input');
  checklistItemInputElm.className = 'form-input';
  checklistItemInputElm.setAttribute('type', 'text');
  checklistItemInputElm.setAttribute('placeholder', 'Checklist Item');
  checklistForm.appendChild(checklistItemInputElm);
  checklistForm.addEventListener('submit', _addChecklistItem);

  const dueDateHeadingElm = _createFormInputHeading({ textContent: 'Due Date' });
  const dueDateInputElm = document.createElement('input');
  dueDateInputElm.setAttribute('type', 'date');
  dueDateInputElm.className = 'form-input';

  const priorityHeadingElm = _createFormInputHeading({ textContent: 'Priority' });
  const priorityInputContainerElm = document.createElement('select');
  priorityInputContainerElm.className = 'form-input';
  priorityInputContainerElm.setAttribute('name', 'priority');
  ['normal', 'important', 'urgent'].forEach(level => {
    const priorityOptionElm = document.createElement('option');
    priorityOptionElm.setAttribute('value', level);
    priorityOptionElm.textContent = level[0].toUpperCase() + level.slice(1);
    priorityInputContainerElm.appendChild(priorityOptionElm);
  });

  const submitBtn = _createSubmitBtn('Create');

  frag.appendChild(taskNameInputElm);
  frag.appendChild(taskDescriptionInputElm);
  frag.appendChild(checklistDisplayHeading);
  frag.appendChild(checklistDisplay);
  frag.appendChild(checklistForm);
  frag.appendChild(dueDateHeadingElm)
  frag.appendChild(dueDateInputElm);
  frag.appendChild(priorityHeadingElm);
  frag.appendChild(priorityInputContainerElm);
  frag.appendChild(submitBtn);

  return frag;
}

function _getCreateProjectModal() {
  const { frag, modalHeading, form } = _getBaseModal();

  modalHeading.textContent = 'Create Project';
  form.addEventListener('submit', _onSubmitCreateProject);

  const projectNameInputElm = document.createElement('input');
  projectNameInputElm.setAttribute('type', 'text');
  projectNameInputElm.setAttribute('placeholder', 'Project Name');
  projectNameInputElm.className = 'form-input';

  const submitBtn = _createSubmitBtn('Create');

  form.appendChild(projectNameInputElm);
  form.appendChild(submitBtn);

  frag.appendChild(modalHeading);
  frag.appendChild(form);

  return frag;
}

export default modal;