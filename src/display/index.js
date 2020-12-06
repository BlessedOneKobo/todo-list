import './css/reset.css';
import './css/style.css';

import heading from './components/heading';
import navigation from './components/navigation';
import section from './components/section';

const container = document.createElement('div');

container.setAttribute('id', 'container');

[heading, navigation, section].forEach(elm => {
  container.appendChild(elm);
});

document.body.appendChild(container);
