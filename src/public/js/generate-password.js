function generatePassword(length = 12) {
  const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  // const symbols = '!@#$%^&*()_+[]{}<>?,.';

  const all = capitalLetters + lowercaseLetters + numbers;

  const getRand = (set) => set[Math.floor(Math.random() * set.length)];

  // Garantizar al menos una de cada categoría
  const password = [
    getRand(capitalLetters),
    getRand(lowercaseLetters),
    getRand(numbers),
  ];

  // Rellenar con caracteres aleatorios
  for (let i = password.length; i < length; i++) {
    password.push(getRand(all));
  }

  // Mezclar la contraseña
  return password.sort(() => Math.random() - 0.5).join('');
}
