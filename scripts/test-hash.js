// scripts/test-hash.js
const bcrypt = require('bcrypt');

async function testHash() {
    const password = 'Licdtjvv5000';
    const saltRounds = 10;

    // Генерируем хэш
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('📝 Пароль:', password);
    console.log('🔐 Сгенерированный хэш:', hash);

    // Проверяем
    const isValid = await bcrypt.compare(password, hash);
    console.log('✅ Проверка:', isValid ? 'прошла' : 'не прошла');

    process.exit(0);
}

testHash();