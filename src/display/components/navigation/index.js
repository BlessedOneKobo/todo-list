import { emit } from '../../../events';

import './style.css';

const navigation = document.createElement('nav');
navigation.setAttribute('id', 'menu');

const projectNavLink = document.createElement('a');
projectNavLink.textContent = 'Projects';
projectNavLink.className = 'active';
projectNavLink.dataset.section = 'projects';
projectNavLink.setAttribute('href', '#');
projectNavLink.addEventListener('click', toggleNavLink);

const taskNavLink = document.createElement('a');
taskNavLink.textContent = 'Tasks';
taskNavLink.dataset.section = 'tasks';
taskNavLink.setAttribute('href', '#');

navigation.appendChild(projectNavLink);
navigation.appendChild(taskNavLink);
navigation.addEventListener('click', toggleNavLink);

// Helpers
function toggleNavLink(event) {
  event.preventDefault();

  const clickedLink = event.target;

  if (clickedLink.className === 'active') {
    return;
  }

  clickedLink.className = 'active';

  const prev = clickedLink.previousElementSibling;

  if (prev) {
    prev.className = '';
    return;
  }

  const next = clickedLink.nextElementSibling;

  if (next) {
    next.className = '';
  }

  emit('toggleNavLink');
}

export default navigation;
