import { input, errorMessage } from './domElement.js';

input.addEventListener('input', () => {
  errorMessage.textContent = '';
});

const formController = async (event, activity, addData) => {
  try {
    event.preventDefault();

    const distance = Number(input.value);

    if (Number.isNaN(distance)) {
      errorMessage.textContent = 'Distance must be a number!';
      return;
    }

    input.value = '';
    errorMessage.textContent = '';
    input.select();

    await addData({
      activity,
      distance,
      date: new Date().toString(),
    });
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);
    errorMessage.textContent('Something went wrong! Please try again!');
  }
};

export default formController;
