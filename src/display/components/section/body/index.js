import { emit, on } from '../../../../events';

const sectionBody = document.createElement('div');
sectionBody.className = 'section-body';

on('projectListUpdated', args => render('projectList', args));

function render(name, args) {
  Array.prototype.forEach.call(sectionBody.children, child => child.remove());

  let newChildren = [];

  switch (name) {
    case 'projectList':
      newChildren = createProjectListContent(args);
      break;
  }

  newChildren.forEach(child => sectionBody.appendChild(child));
}

function createProjectListContent({ projectList }) {
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
    viewLink.addEventListener('click', handleViewLinkClick);

    [deleteBtn, heading].forEach(elm => cardHeaderGroup.appendChild(elm));
    [cardHeaderGroup, viewLink].forEach(elm => cardHeader.appendChild(elm));
    card.appendChild(cardHeader);

    return card;
  });
}

function handleViewLinkClick(event) {
  event.preventDefault();

  const projectCard = this.parentElement.parentElement;

  emit('projectSelected', { projectIndex: Number(projectCard.getAttribute('id')) });

  // No need for listener since element is out of reach
  this.removeEventListener('click', handleViewLinkClick);
}

export default sectionBody;
