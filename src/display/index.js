import './reset.css';
import './style.css';

import heading from './components/heading';
import navigation from './components/navigation';

const container = document.createElement('div');

container.setAttribute('id', 'container');
container.appendChild(heading);
container.appendChild(navigation);

document.body.appendChild(container);
