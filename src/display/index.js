import './css/reset.css';
import './css/style.css';

import heading from './components/heading';
import navigation from './components/navigation';
import section from './components/section';
import modal from './components/modal';

const container = document.createElement('div');

container.setAttribute('id', 'container');

[heading, navigation, section].forEach(elm => {
  container.appendChild(elm);
});

document.body.appendChild(container);
document.body.appendChild(modal);