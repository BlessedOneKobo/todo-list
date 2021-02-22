import { emit, on } from './events';

const key = 'the-odin-project-todo-list';
const storeValue = localStorage.getItem(key) || '[]';

emit('loadProjectList', { list: JSON.parse(storeValue) });

on('saveProjectList', ({ projectList }) => {
  localStorage.setItem(key, JSON.stringify(projectList));
});
