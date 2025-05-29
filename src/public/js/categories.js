document.addEventListener('DOMContentLoaded', function () {
  const $$ = (el) => document.querySelectorAll(el);

  $$('.delete-category-btn').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const categoryId = button.getAttribute('data-id');
      if (!categoryId) return;

      const confirmDelete = confirm(
        '¿Estás seguro de que deseas eliminar esta categoría?',
        'SI TIENE PRODUCTOS NO SE PUEDE ELIMINARLA CATEGORÍA, DEBE ELIMINAR LOS PRODUCTOS PRIMERO',
      );
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          location.reload();
        } else {
          alert('Error al eliminar la categoría');
        }
      } catch (err) {
        console.error(err);
        alert('Ocurrió un error al intentar eliminar el categoría');
      }
    });
  });

  $$('.update-status-category-btn').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const categoryId = button.getAttribute('data-id');
      const categoryStatus = button.getAttribute('data-status');
      console.log(typeof categoryStatus)
      if (!categoryId) return;

      const confirmUpdate = confirm(
        '¿Estás seguro de que deseas cambiar el estado de esta categoría?',
      );
      if (!confirmUpdate) return;

      try {
        const res = await fetch(`/api/categories/${categoryId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: categoryStatus === '1' ? 0 : 1,
          }),
        });

        if (res.ok) {
          location.reload();
        } else {
          alert('Error al cambiar el estado de la categoría');
        }
      } catch (err) {
        console.error(err);
        alert('Ocurrió un error al intentar cambiar el estado de la categoría');
      }
    });
  });
});
