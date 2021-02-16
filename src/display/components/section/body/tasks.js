import { emit } from '../../../../events';

function _handleCheckboxItemClick() {
  const checklistItemElm = this.parentElement;

  if (!checklistItemElm) {
    throw Error('_handleCheckboxItemClick: Could not find "checklist-item" element');
  }

  checklistItemElm.classList.toggle('completed');
  checklistItemElm.classList.toggle('line-through-text');
}

function _handleTaskCheckboxClick() {
    const taskCardElm = this.parentElement.parentElement.parentElement;
    const taskNameElm = this.nextElementSibling;

    taskCardElm.classList.toggle('completed');
    taskNameElm.classList.toggle('line-through-text');

    const isCompleted = taskCardElm.classList.contains('completed');
    const checkboxItemList = taskCardElm.querySelectorAll('.checkbox-item');

    Array.prototype.forEach.call(checkboxItemList, checkboxItem => {
      checkboxItem.disabled = isCompleted;
    })
}

function _handleTaskCardToggle(event) {
  event.preventDefault();

  const cardElm = this.parentElement.parentElement;

  if (!cardElm) {
    return;
  }

  const cardBodyElm = cardElm.querySelector('.task-card-body');
  const cardFooterElm = cardElm.querySelector('.task-card-footer');

  if (cardBodyElm) {
    cardBodyElm.classList.toggle('hidden');
  }

  if (cardFooterElm) {
    cardFooterElm.classList.toggle('hidden');
  }

  if (this.textContent === 'More') {
    this.textContent = 'Less';
  } else {
    this.textContent = 'More';
  }
}

function _getTaskListContent(projectName, taskList) {
  const taskListHeading = document.createElement('h2');
  taskListHeading.textContent = projectName;
  taskListHeading.className = 'project-name';

  const taskListContent = taskList.map((taskItem, taskIdx) => {
    const { title, description, dueDate, priority, checklist, done } = taskItem;

    // Task Header
    const taskCheckbox = document.createElement('input');
    taskCheckbox.className = 'task-checkbox';
    taskCheckbox.checked = done;
    taskCheckbox.setAttribute('type', 'checkbox');
    taskCheckbox.setAttribute('name', 'done');
    taskCheckbox.addEventListener('click', _handleTaskCheckboxClick);
    taskCheckbox.addEventListener('click', () => {
      emit('toggleTaskDoneStatus', { taskIdx });
    })
    const taskName = document.createElement('h2');
    taskName.className = 'task-name';
    taskName.textContent = title;

    const headingGroup = document.createElement('div');
    headingGroup.className = 'heading-group';
    [taskCheckbox, taskName].forEach(child => {
      headingGroup.appendChild(child);
    });
    const taskCardToggle = document.createElement('a');
    taskCardToggle.className = 'task-card-toggle';
    taskCardToggle.setAttribute('href', '#');
    taskCardToggle.textContent = 'More';
    taskCardToggle.addEventListener('click', _handleTaskCardToggle);
    const taskCardHeader = document.createElement('div');
    taskCardHeader.className = 'task-card-header';
    [headingGroup, taskCardToggle].forEach(child => {
      taskCardHeader.appendChild(child);
    });

    // Task Description
    const taskDescription = document.createElement('p');
    taskDescription.className = 'task-description';
    taskDescription.textContent = description;

    // Checklist
    const checklistElementArray = checklist.map((checkItem, checkItemIdx) => {
      const checklistItem = document.createElement('li');
      checklistItem.className = 'checklist-item';
      checklistItem.dataset.checkItemIndex = checkItemIdx;

      const checkboxText = document.createElement('span');
      checkboxText.className = 'checkbox-text';
      checkboxText.textContent = checkItem.text;

      const checkboxItem = document.createElement('input');
      checkboxItem.className = 'checkbox-item';
      checkboxItem.disabled = done;
      checkboxItem.setAttribute('type', 'checkbox');
      checkboxItem.addEventListener('click', _handleCheckboxItemClick);
      checkboxItem.addEventListener('click', () => {
        emit('checkboxItemToggle', {  taskIndex: taskIdx, checkItemIndex: checkItemIdx });
      });

      if (checkItem.done) {
        checklistItem.classList.add('completed');
        checklistItem.classList.add('line-through-text');
        checkboxItem.checked = true;
      }

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
    dueDateContent.textContent = dueDate;
    const dueDateSubsection = document.createElement('div');
    dueDateSubsection.className = 'due-date-subsection';
    dueDateSubsection.appendChild(dueDateContent);

    // Priority
    const priorityColor = document.createElement('span');
    priorityColor.className = 'priority-color';
    const priorityText = document.createElement('span');
    priorityText.className = 'priority-text';
    priorityText.textContent = priority;
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
    taskDeleteBtn.addEventListener('click', () => {
      emit('deleteTask', { idx: taskIdx })
    });
    const taskCardFooter = document.createElement('div');
    taskCardFooter.className = 'task-card-footer hidden';
    taskCardFooter.appendChild(taskDeleteBtn);

    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.dataset.cardIndex = taskIdx;
    [taskCardHeader, taskCardBody, taskCardFooter].forEach(child => {
      taskCard.appendChild(child);
    });

    if (done) {
      taskCard.classList.add('completed');
      taskName.classList.add('line-through-text');
    } else {
      // This might be redundant
      taskCard.classList.remove('completed');
      taskName.classList.remove('line-through-text');
    }

    return taskCard;
  });

  return [taskListHeading, ...taskListContent];
}

function _getEmptyContent() {
  const emptyMsg = document.createElement('p');
  emptyMsg.textContent = 'Please select a project';
  emptyMsg.className = 'empty';
  return emptyMsg;
}

export function createTaskListContent(details) {
  if (!details) {
    return _getEmptyContent();
  }

  const { projectName, taskList } = details;

  if (!projectName) {
    return _getEmptyContent();
  }

  return _getTaskListContent(projectName, taskList);
}
