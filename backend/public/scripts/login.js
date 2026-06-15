const form = document.querySelector('[data-login-form]');
const messageEl = document.querySelector('[data-message]');

const setMessage = (message, isError = false) => {
  messageEl.textContent = message;
  messageEl.className = `form-message${isError ? ' error' : ''}`;
};

if (localStorage.getItem('stockBrokerToken')) {
  window.location.assign('/');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector('button');
  const email = new FormData(form).get('email');

  submitButton.disabled = true;
  setMessage('Signing in');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'Unable to sign in');
    }

    localStorage.setItem('stockBrokerToken', payload.token);
    localStorage.setItem('stockBrokerEmail', payload.user.email);
    window.location.assign('/');
  } catch (error) {
    setMessage(error.message, true);
    submitButton.disabled = false;
  }
});
