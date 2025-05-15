const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'admin123';  // change si tu veux un autre mot de passe
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Hash à copier en base :', hash);
}

generateHash();
