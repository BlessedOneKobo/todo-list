import { emit, on } from '../events';

let _selectedProject = null;
let _selectedIdx = -1;

const projectList = [
  {
    name: 'General',
    items: [
      {
        title: 'Task Name Is Really Long Though',
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.`,
        dueDate: '16/11/2020',
        priority: 'Urgent',
        checklist: [
          { text: 'Item 1', done: false },
          { text: 'Item 2', done: false },
          { text: 'Item 3', done: false },
        ],
        done: true,
      },
      {
        title: 'Something Else',
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.`,
        dueDate: '19/5/2020',
        priority: 'Important',
        checklist: [
          { text: 'Item 1', done: false },
          { text: 'Item 2', done: false },
        ],
        done: false,
      },
    ],
  },
];

function _updateTaskListDisplay() {
  if (!_selectedProject) {
    emit('taskListUpdated');
    return;
  }

  const { name: projectName, items: taskList } = _selectedProject;
  emit('taskListUpdated', { projectName, taskList });
}

emit('projectListUpdated', { projectList });

on('toggleNavigation', ({ selected }) => {
  if (selected === 'projects') {
    emit('projectListUpdated', { projectList });
  } else if (selected === 'tasks') {
    _updateTaskListDisplay();
  }
});

on('projectSelected', ({ idx }) => {
  _selectedProject = projectList[idx];
  _selectedIdx = idx;
});

on('deleteTask', ({ idx }) => {
  _selectedProject.items.splice(idx, 1);
  _updateTaskListDisplay();
});

on('deleteCompletedTasks', () => {
  _selectedProject.items = _selectedProject.items.filter(x => !x.done);
  _updateTaskListDisplay();
})

on('toggleTaskDoneStatus', ({ taskIdx }) => {
  const task = _selectedProject.items[taskIdx];
  task.done = !task.done;
});