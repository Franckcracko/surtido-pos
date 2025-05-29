document.addEventListener('DOMContentLoaded', function () {
  const $ = (el) => document.querySelector(el);
  const $password = $('#password');
  const $generatePassword = $('#generate-password');

  $generatePassword?.addEventListener('click', (e) => {
    e.preventDefault();
    $password.value = generatePassword(12);
  });

  const $updatePasswordForm = $('#update-password');
  $updatePasswordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!$password.value) {
      alert('Porfavor ingresa la contraseña.');
      return;
    }

    if ($password.value.length < 8) {
      alert('La contraseña debe ser minimo de 8 caracteres.');
      return;
    }

    try {
      const response = await fetch('/api/auth/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: $password.value }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la contraseña');
      }

      alert('Contraseña actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      alert(
        'Error al actualizar la contraseña. Por favor, inténtalo de nuevo.',
      );
      return;
    }
  });

  const $addUserForm = $('#add-user');
  const $buttonGeneratePassword = $('#generate-password-new-user');
  $buttonGeneratePassword?.addEventListener('click', (e) => {
    e.preventDefault();
    $('#password-new-user').value = generatePassword(12);
  });
  $addUserForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const $username = $('#username-new-user');
    const $email = $('#email-new-user');
    const $password = $('#password-new-user');


    if (!$username.value || !$email.value || !$password.value) {
      alert('Porfavor completa todos los campos.');
      return;
    }

    if ($password.value.length < 8) {
      alert('La contraseña debe ser minimo de 8 caracteres.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: $username.value,
          email: $email.value,
          password: $password.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el usuario');
      }

      alert('Usuario agregado correctamente.');
      window.location.reload();
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      alert('Error al agregar el usuario. Por favor, inténtalo de nuevo.');
    }
  });

  const $deleteUserButton = $('#delete-user');
  $deleteUserButton?.addEventListener('click', async (e) => {
    e.preventDefault();
    const confirmation = confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch('/api/auth/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      alert('Usuario eliminado correctamente.');
      window.location.href = '/';
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
    }
  });
});
