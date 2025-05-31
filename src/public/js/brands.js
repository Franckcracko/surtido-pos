document.addEventListener('DOMContentLoaded', function () {
  const $$ = (el) => document.querySelectorAll(el);
  const $ = (el) => document.querySelector(el);

  const $brandForm = $('#brand-form');

  $brandForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value;

    fetch('/api/brands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    }).then((res) => {
      if (res.ok) {
        window.location.reload();
        return;
      }

      alert('Error al crear el proveedor');
    });
  });

  $$('.delete-brand-btn').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const brandId = button.getAttribute('data-id');
      if (!brandId) return;

      const confirmDelete = confirm(
        '¿Estás seguro de que deseas eliminar este proveedor?',
      );
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/brands/${brandId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          location.reload();
        } else {
          alert('Error al eliminar el proveedor');
        }
      } catch (err) {
        console.error(err);
        alert('Ocurrió un error al intentar eliminar el proveedor');
      }
    });
  });

  $$('.brand-update-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const brandId = form.dataset.id;
      const status = !!form.querySelector('#status').value
        ? +form.querySelector('#status').value
        : undefined;
      const name = form.querySelector('#name').value;
      fetch(`/api/brands/${brandId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, name }),
      }).then((res) => {
        if (res.ok) {
          window.location.reload();
          return;
        }

        alert('Error al actualizar el proveedor');
      });
    });
  });
});
