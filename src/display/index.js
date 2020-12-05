import heading from './heading';
import navigation from './navigation';

const container = document.createElement('div');

container.setAttribute('id', 'container');
container.appendChild(heading);
container.appendChild(navigation);

document.body.appendChild(container);
