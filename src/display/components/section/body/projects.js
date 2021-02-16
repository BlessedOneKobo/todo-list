import { emit } from '../../../../events';

function _onProjectViewLinkClick(idx) {
  return (event) => {
    event.preventDefault();

    emit('projectSelected', { idx });
    emit('toggleNavigation', { selected: 'tasks' });
  };
}

function _onProjectDeleteBtnClick(idx) {
  return () => {
    emit('deleteProject', { idx });
  };
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
    deleteBtn.addEventListener('click', _onProjectDeleteBtnClick(idx));
    const heading = document.createElement('h2');
    heading.className = 'task-name';
    const headingLink = document.createElement('a');
    headingLink.setAttribute('href', '#');
    headingLink.textContent = name;
    headingLink.addEventListener('click', _onProjectViewLinkClick(idx));
    heading.appendChild(headingLink);

    const viewLink = document.createElement('a');
    viewLink.setAttribute('href', '#');
    viewLink.textContent = 'View';
    viewLink.className = 'task-card-view';
    viewLink.addEventListener('click', _onProjectViewLinkClick(idx));

    [deleteBtn, heading].forEach(elm => cardHeaderGroup.appendChild(elm));
    [cardHeaderGroup, viewLink].forEach(elm => cardHeader.appendChild(elm));
    card.appendChild(cardHeader);

    return card;
  });
}
