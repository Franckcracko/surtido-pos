document.addEventListener('DOMContentLoaded', () => {
  const $allDeleteOrder = document.querySelectorAll('.delete-order-btn');
  $allDeleteOrder.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = btn.getAttribute('data-id');
      console.log(id);
      const url = `/api/orders/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        location.reload();
        return;
      }
      alert('Error al eliminar la orden');
    });
  });

  const $allPaidForm = document.querySelectorAll('.paid-form');
  $allPaidForm.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = form.getAttribute('data-id');
      const url = `/api/orders/${id}/paid`;
      const amount = +form.querySelector('input[name="amount"]').value;

      if (amount <= 0) {
        alert('El monto debe ser mayor a 0');
        return;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        location.reload();
        return;
      }
      alert('Error al marcar la orden como pagada');
    });
  });

  const $allReports = document.querySelectorAll('.download-report');
  $allReports.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = btn.dataset.id;
      console.log(id);
      const url = `/api/orders/${id}/report`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        // link.download = `report-${id}.pdf`;
        link.target = '_blank';
        link.click();
        return;
      }
      alert('Error al descargar el reporte');
    });
  });

  const $reportsForm = document.querySelector('#report-form');
  $reportsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const startDate = $reportsForm.querySelector(
      'input[name="startDate"]',
    ).value;
    const endDate = $reportsForm.querySelector('input[name="endDate"]').value;

    if (!startDate || !endDate) {
      alert('Por favor, selecciona las fechas de inicio y fin');
      return;
    }

    const url = `/api/orders/reports?startDate=${startDate}&endDate=${endDate}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      // link.download = `report-${startDate}-${endDate}.pdf`;
      link.target = '_blank';
      link.click();
      return;
    }
    alert('Error al generar el reporte');
  });
});
