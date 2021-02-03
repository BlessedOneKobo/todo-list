import { emit } from '../../../../events';

function _getProjectCardId(elm) {
  return elm.parentElement.parentElement.getAttribute('id');
}

function _onProjectViewLinkClick(event) {
  event.preventDefault();

  emit('projectSelected', { idx: _getProjectCardId(event.target) });
  emit('toggleNavigation', { selected: 'tasks' });

  // No need for listener since element is out of reach
  this.removeEventListener('click', _onProjectViewLinkClick);
}

function _onProjectDeleteBtnClick(event) {
  emit('deleteProject', { idx: _getProjectCardId(event.target.parentElement) });
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
    deleteBtn.addEventListener('click', _onProjectDeleteBtnClick);
    const heading = document.createElement('h2');
    heading.className = 'task-name';
    heading.textContent = name;

    const viewLink = document.createElement('a');
    viewLink.setAttribute('href', '#');
    viewLink.textContent = 'View';
    viewLink.className = 'task-card-view';
    viewLink.addEventListener('click', _onProjectViewLinkClick);

    [deleteBtn, heading].forEach(elm => cardHeaderGroup.appendChild(elm));
    [cardHeaderGroup, viewLink].forEach(elm => cardHeader.appendChild(elm));
    card.appendChild(cardHeader);

    return card;
  });
}
