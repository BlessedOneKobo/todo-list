export function createFormInputHeadingElm({ level = 'h4', textContent }) {
  const heading = document.createElement(level);
  heading.className = 'form-input-heading';
  heading.textContent = textContent;

  return heading;
}

export function createSubmitBtnElm(btnText) {
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn create';
  submitBtn.textContent = btnText;
  submitBtn.setAttribute('type', 'submit');

  return submitBtn;
}

export function createFormGroupElm({ children }) {
  const formGroupElm = document.createElement('div');
  formGroupElm.className = 'form-group';

  children.forEach(childElm => formGroupElm.appendChild(childElm));

  return formGroupElm;
}

export function createErrorMsgElm(propName) {
  const errorMsgElm = document.createElement('div');
  errorMsgElm.className = 'form-error ' + propName;

  return errorMsgElm;
}
