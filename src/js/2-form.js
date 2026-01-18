import { load, remove, save } from './localstorage';

const form = document.querySelector('.feedback-form');
const localStorageKey = 'feedback-form-state';
let formData = {
  email: '',
  message: '',
};

const saveData = load(localStorageKey);
if (saveData) {
  formData = saveData;
  form.elements.email.value = formData.email || '';
  form.elements.message.value = formData.message || '';
}

form.addEventListener('input', event => {
  const { name, value } = event.target;
  formData[name] = value.trim();
  save(localStorageKey, formData);
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!formData.email || !formData.message) {
    return alert('Заповніть усі поля');
  }
  console.log(formData);
  remove(localStorageKey);
  formData = {email: '', message: '',};
  form.reset();
});
