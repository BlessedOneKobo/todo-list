import { emit } from '../../../../events';

function _handleProjectViewLinkClick(event) {
  event.preventDefault();

  const projectCard = this.parentElement.parentElement;

  emit('projectSelected', { idx: Number(projectCard.getAttribute('id')) });
  emit('toggleNavigation', { selected: 'tasks' });

  // No need for listener since element is out of reach
  this.removeEventListener('click', _handleProjectViewLinkClick);
}

export function createProjectListContent({ projectList }) {
  return projectList.map(({ name }, idx) => {
    const card = document.createElement('div');
    card.className = 'task-card project';
    card.setAttribute('id', idx);

    const cardHeader = document.createElement('div');
    cardHeader.className = 'task-card-header';

    const cardHeaderGroup = document.createElement('div');
    cardHeaderGroup.className = 'heading-group';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn delete';
    const heading = document.createElement('h2');
    heading.className = 'task-name';
    heading.textContent = name;

    const viewLink = document.createElement('a');
    viewLink.setAttribute('href', '#');
    viewLink.textContent = 'View';
    viewLink.className = 'task-card-view';
    viewLink.addEventListener('click', _handleProjectViewLinkClick);

    [deleteBtn, heading].forEach(elm => cardHeaderGroup.appendChild(elm));
    [cardHeaderGroup, viewLink].forEach(elm => cardHeader.appendChild(elm));
    card.appendChild(cardHeader);

    return card;
  });
}
