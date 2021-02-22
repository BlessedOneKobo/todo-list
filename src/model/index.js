import { emit, on } from '../events';

let projectList = [];
let _selectedProject = null;

function _updateTaskListDisplay() {
  if (!_selectedProject) {
    emit('taskListUpdated');
    return;
  }

  const { name: projectName, items: taskList } = _selectedProject;
  emit('taskListUpdated', { projectName, taskList });
}

on('loadProjectList', ({ list }) => {
  projectList = list;
  emit('projectListUpdated', { projectList });
});

on('toggleNavigation', ({ selected }) => {
  if (selected === 'projects') {
    emit('projectListUpdated', { projectList });
  } else if (selected === 'tasks') {
    _updateTaskListDisplay();
  }
});

on('projectSelected', ({ idx }) => {
  idx = Number(idx);
  _selectedProject = projectList[idx];
});

on('deleteProject', ({ idx }) => {
  idx = Number(idx);
  projectList.splice(idx, 1);
  emit('projectListUpdated', { projectList });
  emit('saveProjectList', { projectList });
});

on('deleteTask', ({ idx }) => {
  _selectedProject.items.splice(idx, 1);
  _updateTaskListDisplay();
  emit('saveProjectList', { projectList });
});

on('deleteCompletedTasks', () => {
  if (!_selectedProject) {
    return;
  }

  _selectedProject.items = _selectedProject.items.filter((x) => !x.done);
  _updateTaskListDisplay();
  emit('saveProjectList', { projectList });
});

on('toggleTaskDoneStatus', ({ taskIdx }) => {
  const task = _selectedProject.items[taskIdx];
  task.done = !task.done;
  emit('saveProjectList', { projectList });
});

on('createProject', ({ projectName }) => {
  projectList.push({ name: projectName, items: [] });
  emit('projectListUpdated', { projectList });
  emit('saveProjectList', { projectList });
});

on('createTask', ({ newTask }) => {
  if (!_selectedProject) {
    return;
  }

  _selectedProject.items.unshift({ ...newTask });
  _updateTaskListDisplay();
  emit('saveProjectList', { projectList });
});

on('checkboxItemToggle', ({ checkItemIndex, taskIndex }) => {
  const checklist = _selectedProject.items[taskIndex].checklist;
  checklist[checkItemIndex].done = !checklist[checkItemIndex].done;
  emit('saveProjectList', { projectList });
});
