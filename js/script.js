const form = document.getElementById('enrollmentForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  data.consent = form.consent.checked;          // true / false

  try {
    const r = await fetch('https://defabio.pythonanywhere.com/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const res = await r.json();
    const toastEl = document.getElementById(r.ok ? 'successToast' : 'errorToast');
    toastEl.querySelector('.toast-body').textContent = res.message || 'Ошибка';
    new bootstrap.Toast(toastEl).show();

    if (r.ok) {
      form.reset();
      bootstrap.Modal.getInstance('#enrollModal')?.hide();
    }
  } catch (err) {
    console.error(err);
    const errToast = document.getElementById('errorToast');
    errToast.querySelector('.toast-body').textContent = 'Сетевой сбой. Попробуйте позже.';
    new bootstrap.Toast(errToast).show();
  }
});
