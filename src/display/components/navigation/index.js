import { emit, on } from '../../../events';

import './style.css';

const navigation = document.createElement('nav');
navigation.setAttribute('id', 'menu');

const projectNavLink = document.createElement('a');
projectNavLink.textContent = 'Projects';
projectNavLink.className = 'active';
projectNavLink.dataset.section = 'projects';
projectNavLink.setAttribute('href', '#');
projectNavLink.addEventListener('click', _toggleNavLinkClick);

const taskNavLink = document.createElement('a');
taskNavLink.textContent = 'Tasks';
taskNavLink.dataset.section = 'tasks';
taskNavLink.setAttribute('href', '#');

navigation.appendChild(projectNavLink);
navigation.appendChild(taskNavLink);
navigation.addEventListener('click', _toggleNavLinkClick);

// Helpers
function _toggleNavLinkClick(event) {
  event.preventDefault();

  const clickedLink = event.target;

  if (clickedLink.className === 'active') {
    return;
  }

  clickedLink.className = 'active';
  emit('toggleNavigation', { selected: clickedLink.dataset.section });
}

on('toggleNavigation', ({ selected }) => {
  if (selected === 'projects') {
    projectNavLink.className = 'active';
    taskNavLink.className = '';
    return;
  }

  taskNavLink.className = 'active';
  projectNavLink.className = '';
});

export default navigation;
