import { btns, formAct, input } from './domElement.js';

let activity;

const defindActivity = event => {
  const btn = event.target.closest('button');

  if (!btn) return;

  activity = btn.dataset.activity;

  btns.forEach(btnItem => btnItem.classList.remove('active'));
  btn.classList.add('active');
  formAct.textContent = activity;

  input.setAttribute('id', activity);

  return activity;
};

export default defindActivity;
