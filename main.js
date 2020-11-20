'use strict';

const forEach = Array.prototype.forEach;
const taskCheckboxList = document.getElementsByClassName('task-checkbox');
const toggleBtnList = document.getElementsByClassName('task-card-toggle');

forEach.call(taskCheckboxList, taskCheckboxElm => {
  taskCheckboxElm.addEventListener('click', () => {
    const taskCardElm = taskCheckboxElm.parentElement.parentElement.parentElement;
    const taskNameElm = taskCheckboxElm.nextElementSibling;

    taskCardElm.classList.toggle('completed');
    taskNameElm.classList.toggle('line-through-text');
  });
});

forEach.call(toggleBtnList, toggleBtnElm => {
  toggleBtnElm.addEventListener('click', event => {
    event.preventDefault();

    const cardElm = event.target.parentElement.parentElement;

    if (!cardElm) {
      return;
    }

    const cardBodyElm = cardElm.getElementsByClassName('task-card-body')[0];
    const cardFooterElm = cardElm.getElementsByClassName('task-card-footer')[0];

    if (cardBodyElm) {
      cardBodyElm.classList.toggle('hidden');
    }

    if (cardFooterElm) {
      cardFooterElm.classList.toggle('hidden');
    }

    if (toggleBtnElm.textContent === 'More') {
      toggleBtnElm.textContent = 'Less';
    } else {
      toggleBtnElm.textContent = 'More';
    }
  });
});
