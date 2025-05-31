document.addEventListener('DOMContentLoaded', function () {
  const $ = (el) => document.querySelector(el);
  const $$ = (el) => document.querySelectorAll(el);

  const $dropzone = $('#dropzone-file');

  const $placeholderDropzone = $('#placeholder-dropzone-file');

  const $dropzoneTextContainer = $('#dropzone-text-container');
  const $dropzoneText = $('#dropzone-text');

  let file;

  $dropzone.addEventListener('change', (e) => {
    file = e.target.files[0];
    if (!file) {
      return;
    }

    $placeholderDropzone.classList.add('hidden');

    $dropzoneTextContainer.classList.remove('hidden');
    $dropzoneTextContainer.classList.add('flex');
    $dropzoneText.textContent = file.name;
  });

  const $productForm = $('#product-form');
  $productForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value;
    const categoryId = +$('#category').value;
    const brandId = +$('#brand').value;
    const price = +$('#price').value;
    const stock = +$('#stock').value;
    const lowStock = +$('#low-stock').value;

    const formData = new FormData();

    formData.append('name', name);
    formData.append('categoryId', categoryId);
    formData.append('brandId', brandId);
    formData.append('stock', stock);
    formData.append('lowStock', lowStock);
    formData.append('price', price);
    formData.append('image', file);

    fetch('/api/products', {
      method: 'POST',
      body: formData,
    }).then((res) => {
      if (res.ok) {
        location.reload();
        return;
      }

      alert('Error al crear el producto');
    });
  });

  const $updateProductForm = $('.update-product-form');
  $updateProductForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value;
    const categoryId = +$('#category').value;
    const brandId = +$('#brand').value;
    const price = +$('#price').value;
    const stock = +$('#stock').value;
    const lowStock = +$('#low-stock').value;
    const status = $('#status').value;

    const formData = new FormData();

    if (stock < lowStock) {
      alert('El stock no puede ser menor que el stock bajo');
      return;
    }
    if (categoryId) {
      formData.append('categoryId', categoryId);
    }
    if (brandId) {
      formData.append('brandId', brandId);
    }
    if (status) {
      formData.append('status', status);
    }
    formData.append('name', name);
    formData.append('stock', stock);
    formData.append('lowStock', lowStock);
    formData.append('price', price);

    if (file) {
      formData.append('image', file);
    }

    fetch(`/api/products/${$updateProductForm.dataset.id}`, {
      method: 'PUT',
      body: formData,
    }).then((res) => {
      if (res.ok) {
        location.reload();
        return;
      }

      alert('Error al actualizar el producto');
    });
  });

  $$('.delete-product-btn').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const productId = button.getAttribute('data-id');
      if (!productId) return;

      const confirmDelete = confirm(
        '¿Estás seguro de que deseas eliminar este producto?',
      );
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          location.reload();
        } else {
          alert('Error al eliminar el producto');
        }
      } catch (err) {
        console.error(err);
        alert('Ocurrió un error al intentar eliminar el producto');
      }
    });
  });
});
