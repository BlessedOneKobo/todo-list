import { on } from '../../../events';

import './style.css';

const section = document.createElement('div');
section.className = 'section';

const sectionHeader = document.createElement('div');
sectionHeader.className = 'section-header projects';

const deleteBtn = document.createElement('button');
deleteBtn.className = 'btn delete';
deleteBtn.textContent = 'Delete Completed Tasks';

const createBtn = document.createElement('button');
createBtn.className = 'btn create';
createBtn.textContent = 'Create Project';

sectionHeader.appendChild(deleteBtn);
sectionHeader.appendChild(createBtn);
section.appendChild(sectionHeader);

on('toggleNavigation', ({ selected }) => {
  sectionHeader.className = `section-header ${selected}`;

  createBtn.textContent = selected === 'projects' ? 'Create Project' : 'Create Task';
});

export default section;
