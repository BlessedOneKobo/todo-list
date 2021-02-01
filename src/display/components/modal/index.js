import { emit, on } from '../../../events';
import './style.css';

const modal = document.createElement('div');
modal.className = 'modal hide'

let modalContent = document.createElement('div');
modalContent.className = 'modal-content';
modalContent.appendChild(_getCreateProjectModal());

modal.appendChild(modalContent);

modal.addEventListener('click', (event) => {
  const { target } = event;

  if (target.classList.contains('show')) {
    _hideModal()
  }
});
on('openCreateProjectModal', () => _showModal());

function _showModal() {
  modal.classList.remove('hide');
  modal.classList.add('show');
}

function _hideModal() {
  modal.classList.remove('show');
  modal.classList.add('hide');
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

function _getCreateProjectModal() {
  const frag = document.createDocumentFragment();

  const modalHeading = document.createElement('h2');
  modalHeading.textContent = 'Create Project';
  modalHeading.className = 'heading';

  const form = document.createElement('form');
  form.className = 'form create-form';
  form.addEventListener('submit', _onSubmitCreateProject);
  form.setAttribute('novalidate', '');

  const projectNameInputElm = document.createElement('input');
  projectNameInputElm.setAttribute('type', 'text');
  projectNameInputElm.setAttribute('placeholder', 'Project Name');
  projectNameInputElm.className = 'form-input';

  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn create';
  submitBtn.textContent = 'Create';
  submitBtn.setAttribute('type', 'submit');

  form.appendChild(projectNameInputElm);
  form.appendChild(submitBtn);

  frag.appendChild(modalHeading);
  frag.appendChild(form);

  return frag;
}

export default modal;