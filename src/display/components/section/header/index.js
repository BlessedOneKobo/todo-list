import { emit, on } from '../../../../events';

import './style.css';

const sectionHeader = document.createElement('div');
sectionHeader.className = 'section-header projects';

const deleteBtn = document.createElement('button');
deleteBtn.className = 'btn delete';
deleteBtn.textContent = 'Delete Completed Tasks';
deleteBtn.addEventListener('click', () => emit('deleteCompletedTasks'));

const createBtn = document.createElement('button');
createBtn.className = 'btn create';
createBtn.textContent = 'Create Project';
createBtn.addEventListener('click', _initProjectCreate);

sectionHeader.appendChild(deleteBtn);
sectionHeader.appendChild(createBtn);

on('toggleNavigation', ({ selected }) => {
  sectionHeader.className = `section-header ${selected}`;

  if (selected === 'projects') {
    createBtn.addEventListener('click', _initProjectCreate);
    createBtn.textContent = 'Create Project';
  } else {
    createBtn.removeEventListener('click', _initProjectCreate);
    createBtn.textContent = 'Create Task';
    createBtn.addEventListener('click', _initTaskCreate);
  }
});

function _initProjectCreate() {
  emit('openCreateProjectModal');
}

function _initTaskCreate() {
  emit('openCreateTaskModal');
}

export default sectionHeader;
