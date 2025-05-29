const products = [];

const templateProduct = (product) => {
  const { id, name, price, quantity, categoryName } = product;
  const template = `
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600" data-id="${id}">
    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      ${name}
    </th>
    <td class="px-6 py-4">
      ${quantity}
    </td>
    <td class="px-6 py-4">
      ${categoryName}
    </td>
    <td class="px-6 py-4">
      $${price}
    </td>
    <td class="px-6 py-4">
      $${price * quantity}
    </td>
    <td class="px-6 py-4 text-right">
      <button class="font-medium text-red-600 dark:text-red-500 hover:underline delete-product cursor-pointer" data-id="${id}">Eliminar</button>
    </td>
  </tr>`;
  return template;
};

document.addEventListener('DOMContentLoaded', function () {
  const $ = (el) => document.querySelector(el);
  const $outputProducts = $('#output-products');
  const $total = $('#total');

  const addProduct = (product) => {
    const productIndex = products.findIndex((p) => p.id === product.id);

    if (productIndex !== -1) {
      products[productIndex].quantity += product.quantity;
      const $productRow = $(`tr[data-id="${product.id}"]`);
      const $productQuantity = $productRow.querySelector('td:nth-child(2)');
      const $productTotal = $productRow.querySelector('td:nth-child(5)');
      $productQuantity.textContent = products[productIndex].quantity;
      $productTotal.textContent = `$${products[productIndex].price * products[productIndex].quantity}`;

      const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
      $total.textContent = `$${total}`;
      return;
    }

    products.push(product);

    const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    $total.textContent = `$${total}`;

    const productTemplate = templateProduct(product);
    $outputProducts.innerHTML += productTemplate;
  };

  const deleteProduct = (id) => {
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
    }

    const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    $total.textContent = `$${total}`;

    const $productRow = $(`tr[data-id="${id}"]`);
    if ($productRow) {
      $productRow.remove();
    }
  };

  const $orderForm = $('#order-form');
  const $inputCategory = $('#category');
  const $productSelect = $('#product');

  let productsJson = [];
  $inputCategory.addEventListener('change', async (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];

    if (!selectedOption.value) {
      $productSelect.innerHTML = '';

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Selecciona una producto';
      $productSelect.appendChild(defaultOption);
      return;
    }

    const categoryId = selectedOption.value;
    try {
      const products = await fetch(`/api/products/category/${categoryId}?status=active`);
      productsJson = await products.json();

      $productSelect.innerHTML = '';

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Selecciona una producto';
      $productSelect.appendChild(defaultOption);

      productsJson.forEach((product) => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        $productSelect.appendChild(option);
      });
    } catch (error) {
      console.log(error);
      alert('Error al obtener los productos');
    }
  });

  const $modalAddProductForm = $('#modal-add-product-form');
  $modalAddProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const categoryId = $inputCategory.value;
    const categoryName =
      $inputCategory.options[$inputCategory.selectedIndex].text;
    const productId = $productSelect.value;
    const productIndex = productsJson.findIndex(
      (product) => product.id === productId,
    );
    const productName = productsJson[productIndex].name;
    const productPrice = productsJson[productIndex].price;
    const quantity = $('#quantity').value;

    if (!categoryId || !quantity || !categoryId) {
      alert('Por favor completa todos los campos');
      return;
    }
    if (quantity <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }
    if (productId === '') {
      alert('Por favor selecciona un producto');
      return;
    }

    addProduct({
      id: productId,
      name: productName,
      price: +productPrice,
      quantity: +quantity,
      categoryName,
      categoryId,
    });

    $('#quantity').value = '';
    $productSelect.value = '';
    $inputCategory.value = '';
  });

  $outputProducts.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-product')) {
      const id = e.target.dataset.id;
      deleteProduct(id);
    }
  });

  $orderForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const clientId = +$('#client').value;
    const paidAmount = +$('#paid').value;
    
    if (!clientId) {
      alert('Por favor selecciona un cliente');
      return;
    }

    if (paidAmount > total) {
      alert('Excediste el pago')
      return
    }

    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId,
        paidAmount,
        orderItems: products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
        })),
      }),
    }).then((res) => {
      if (res.ok) {
        this.location.reload();
        return;
      }

      alert('Error al crear el producto');
    });
  });
});
