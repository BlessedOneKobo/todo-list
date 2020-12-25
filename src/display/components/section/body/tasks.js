function _getTaskListContent(project) {
  const projectName = document.createElement('h2');
  projectName.textContent = project.name;

  const taskListContent = project.items.map(item => {
    // Task Header
    const taskCheckbox = document.createElement('input');
    taskCheckbox.className = 'task-checkbox';
    taskCheckbox.setAttribute('type', 'checkbox');
    taskCheckbox.setAttribute('name', 'done');
    const taskName = document.createElement('h2');
    taskName.className = 'task-name';
    taskName.textContent = item.title;

    const headingGroup = document.createElement('div');
    headingGroup.className = 'heading-group';
    [taskCheckbox, taskName].forEach(child => {
      headingGroup.appendChild(child);
    });
    const taskCardToggle = document.createElement('a');
    taskCardToggle.className = 'task-card-toggle';
    taskCardToggle.setAttribute('href', '#');
    taskCardToggle.textContent = 'More';
    const taskCardHeader = document.createElement('div');
    taskCardHeader.className = 'task-card-header';
    [headingGroup, taskCardToggle].forEach(child => {
      taskCardHeader.appendChild(child);
    });

    // Task Description
    const taskDescription = document.createElement('p');
    taskDescription.className = 'task-description';
    taskDescription.textContent = item.description;

    // Checklist
    const checklistElementArray = item.checklist.map(checkItem => {
      const checklistItem = document.createElement('li');
      checklistItem.className = 'checklist-item';

      const checkboxText = document.createElement('span');
      checkboxText.className = 'checkbox-text';
      checkboxText.textContent = checkItem.text;

      const checkboxItem = document.createElement('input');
      checkboxItem.className = 'checkbox-item';
      checkboxItem.setAttribute('type', 'checkbox');

      const deleteBtn = document.createElement('a');
      deleteBtn.className = 'delete';
      deleteBtn.setAttribute('href', '#');

      [checkboxText, checkboxItem, deleteBtn].forEach(child => {
        checklistItem.appendChild(child);
      });

      return checklistItem;
    });

    const h3 = document.createElement('h3');
    h3.textContent = 'Checklist';
    const checklistContent = document.createElement('ul');
    checklistContent.className = 'checklist-content';
    checklistElementArray.forEach(child => {
      checklistContent.appendChild(child);
    });
    const checklistSubsection = document.createElement('div');
    [h3, checklistContent].forEach(child => {
      checklistSubsection.appendChild(child);
    });

    // Due date
    const dueDateContent = document.createElement('p');
    dueDateContent.className = 'due-date-content';
    dueDateContent.textContent = item.dueDate;
    const dueDateSubsection = document.createElement('div');
    dueDateSubsection.className = 'due-date-subsection';
    dueDateSubsection.appendChild(dueDateContent);

    // Priority
    const priorityColor = document.createElement('span');
    priorityColor.className = 'priority-color';
    const priorityText = document.createElement('span');
    priorityText.className = 'priority-text';
    priorityText.textContent = item.priority;
    const priorityContent = document.createElement('p');
    [priorityColor, priorityText].forEach(child => {
      priorityContent.appendChild(child);
    });
    const prioritySubsection = document.createElement('div');
    prioritySubsection.className = 'priority-subsection';
    prioritySubsection.appendChild(priorityContent);

    const taskDetails = document.createElement('div');
    taskDetails.className = 'task-details';
    [checklistSubsection, dueDateSubsection, prioritySubsection].forEach(child => {
      taskDetails.appendChild(child);
    });

    const taskCardBody = document.createElement('div');
    taskCardBody.className = 'task-card-body hidden';
    [taskDescription, taskDetails].forEach(child => {
      taskCardBody.appendChild(child);
    });

    // Footer
    const taskDeleteBtn = document.createElement('button');
    taskDeleteBtn.className = 'btn delete';
    taskDeleteBtn.textContent = 'Delete';
    const taskCardFooter = document.createElement('div');
    taskCardFooter.className = 'task-card-footer hidden';
    taskCardFooter.appendChild(taskDeleteBtn);

    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    [taskCardHeader, taskCardBody, taskCardFooter].forEach(child => {
      taskCard.appendChild(child);
    });

    return taskCard;
  });

  return [projectName, ...taskListContent];
}

function _getEmptyContent() {
  const emptyMsg = document.createElement('p');
  emptyMsg.textContent = 'Please select a project';
  emptyMsg.className = 'empty';
  return emptyMsg;
}

export function createTaskListContent({ selectedProject }) {
  console.log({ selectedProject });

  if (selectedProject) {
    return _getTaskListContent(selectedProject);
  }

  return _getEmptyContent();
}
