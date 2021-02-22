import { on } from '../../../../events';

import { createProjectListContent } from './projects';
import { createTaskListContent } from './tasks';

import './style.css';

let sectionBody = document.createElement('div');
sectionBody.className = 'section-body';

on('projectListUpdated', (args) => render('projectList', args));
on('taskListUpdated', (args) => render('taskList', args));

function render(name, args) {
  const parent = sectionBody.parentElement;
  parent.removeChild(sectionBody);
  sectionBody = document.createElement('div');
  sectionBody.className = 'section-body';
  parent.appendChild(sectionBody);

  let newChildren = [];

  switch (name) {
    case 'projectList':
      newChildren = createProjectListContent(args);
      break;
    case 'taskList':
      newChildren = createTaskListContent(args);
      break;
  }

  if (Array.isArray(newChildren)) {
    return newChildren.forEach((child) => sectionBody.appendChild(child));
  }

  return sectionBody.appendChild(newChildren);
}

export default sectionBody;
