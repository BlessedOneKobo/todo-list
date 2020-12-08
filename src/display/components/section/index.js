import sectionHeader from './header';
import sectionBody from './body';

const section = document.createElement('div');
section.className = 'section';

section.appendChild(sectionHeader);
section.appendChild(sectionBody);

export default section;
