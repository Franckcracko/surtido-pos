document.addEventListener('DOMContentLoaded', function () {
  const $ = (el) => document.querySelector(el);
  const $$ = (el) => document.querySelectorAll(el);

  const $customerForm = $('#customer-form');

  $customerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value;
    const phone = $('#phone').value;

    fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone }),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
        return;
      }

      alert('Error al crear el cliente');
    });
  });

  $$('.delete-client-btn').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const clientId = button.getAttribute('data-id');
      if (!clientId) return;

      const confirmDelete = confirm(
        '¿Estás seguro de que deseas eliminar este cliente?',
      );
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/clients/${clientId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          location.reload();
        } else {
          alert('Error al eliminar el cliente');
        }
      } catch (err) {
        console.error(err);
        alert('Ocurrió un error al intentar eliminar el cliente');
      }
    });
  });
  $$('.client-update-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientId = form.getAttribute('data-id');
      const name = form.querySelector('#name').value;
      const phone = form.querySelector('#phone').value;
      console.log({ clientId, name, phone });
      fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone }),
      }).then((res) => {
        if (res.ok) {
          window.location.reload();
          return;
        }

        alert('Error al actualizar el cliente');
      });
    });
  });
});
