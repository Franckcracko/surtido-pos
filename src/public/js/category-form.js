document.addEventListener('DOMContentLoaded', function () {
  const $ = (el) => document.querySelector(el);

  const $categoryForm = $('#category-form');

  $categoryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value;
    const description = $('#description').value;

    fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    }).then((res) => {
      if (res.ok) {
        window.location.replace('/dashboard/categories');

        return;
      }

      alert('Error al crear el proveedor');
    });
  });
});
