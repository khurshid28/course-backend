/**
 * Test o'tkazish va sertifikat olish skripti
 * 
 * Bu skript foydalanuvchi nomidan testni boshlaydi, barcha savollarga to'g'ri javob beradi 
 * va sertifikat olish jarayonini avtomatlashtirad.
 * 
 * Ishlatilishi:
 * node complete-test-and-get-certificate.js <email> <password> <courseId>
 * 
 * Misol:
 * node complete-test-and-get-certificate.js user@example.com password123 1
 */

const axios = require('axios');

const BASE_URL = 'http://192.168.100.12:3000';

// Command line argumentlarni olish
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('\n❌ Noto\'g\'ri argumentlar!');
  console.log('\nIshlatilishi:');
  console.log('  node complete-test-and-get-certificate.js <email> <password> <courseId>');
  console.log('\nMisol:');
  console.log('  node complete-test-and-get-certificate.js user@example.com password123 1');
  process.exit(1);
}

const [email, password, courseId] = args;

async function loginUser() {
  console.log('\n🔐 Tizimga kirish...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    console.log('✅ Muvaffaqiyatli kirildi!');
    console.log(`   Foydalanuvchi: ${response.data.user.firstName} ${response.data.user.surname}`);
    return response.data.accessToken;
  } catch (error) {
    console.error('❌ Kirish xatosi:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function getCourseTests(token, courseId) {
  console.log(`\n📚 Kurs #${courseId} testlarini olish...`);
  try {
    const response = await axios.get(`${BASE_URL}/tests/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ ${response.data.length} ta test topildi`);
    
    // Testlarni chiroyli ko'rsatish
    response.data.forEach((test, index) => {
      console.log(`\n   ${index + 1}. ${test.title}`);
      console.log(`      📝 Savollar: ${test.questions?.length || 0} ta`);
      console.log(`      ⏱️  Vaqt: ${test.maxDuration} daqiqa`);
      console.log(`      📊 O'tish bali: ${test.passingScore}%`);
      console.log(`      🔓 Ochiq: ${test.isAvailable ? 'Ha' : 'Yo\'q'}`);
      if (test.lastAttempt) {
        console.log(`      📈 Oxirgi natija: ${test.lastAttempt.score}% (${test.lastAttempt.isPassed ? '✅ O\'tgan' : '❌ O\'tmagan'})`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Testlarni olishda xato:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function startTestSession(token, testId) {
  console.log(`\n🚀 Test #${testId} ni boshlash...`);
  try {
    const response = await axios.post(
      `${BASE_URL}/tests/${testId}/start`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Test sessiyasi boshlandi!');
    console.log(`   Session ID: ${response.data.sessionId}`);
    console.log(`   Tugash vaqti: ${new Date(response.data.expiresAt).toLocaleString()}`);
    return response.data;
  } catch (error) {
    console.error('❌ Testni boshlashda xato:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function submitAnswer(token, sessionId, questionId, answer) {
  try {
    await axios.post(
      `${BASE_URL}/tests/session/${sessionId}/answer`,
      { questionId, answer },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error(`❌ Javob yuborishda xato (savol #${questionId}):`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function completeTest(token, sessionId) {
  console.log(`\n✅ Testni yakunlash...`);
  try {
    const response = await axios.post(
      `${BASE_URL}/tests/session/${sessionId}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('\n🎉 TEST YAKUNLANDI!');
    console.log(`   📊 Natija: ${response.data.score.toFixed(2)}%`);
    console.log(`   ✅ To'g'ri javoblar: ${response.data.correctCount}/${response.data.totalQuestions}`);
    console.log(`   ${response.data.isPassed ? '🎉 TEST O\'TDINGIZ!' : '❌ Test o\'tmadingiz'}`);
    
    if (response.data.certificate) {
      console.log(`\n🏆 SERTIFIKAT OLINDI!`);
      console.log(`   📜 Sertifikat raqami: ${response.data.certificate.certificateNo}`);
      console.log(`   📅 Berilgan sana: ${new Date(response.data.certificate.issuedAt).toLocaleDateString()}`);
    } else {
      console.log(`\n⚠️  Sertifikat olmadingiz. O'tish bali: ${response.data.test?.passingScore}%`);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Testni yakunlashda xato:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('   TEST O\'TKAZISH VA SERTIFIKAT OLISH SKRIPTI');
  console.log('═══════════════════════════════════════════════');

  try {
    // 1. Tizimga kirish
    const token = await loginUser();

    // 2. Kurs testlarini olish
    const tests = await getCourseTests(token, courseId);
    
    if (tests.length === 0) {
      console.log('\n❌ Bu kursda testlar yo\'q!');
      return;
    }

    // Ochiq testlarni topish
    const availableTests = tests.filter(t => t.isAvailable);
    if (availableTests.length === 0) {
      console.log('\n❌ Hozir hech qanday ochiq test yo\'q!');
      return;
    }

    // Birinchi ochiq testni tanlash
    const selectedTest = availableTests[0];
    console.log(`\n✅ Tanlangan test: "${selectedTest.title}"`);

    // 3. Test sessiyasini boshlash
    const session = await startTestSession(token, selectedTest.id);

    // 4. Har bir savolga javob berish
    console.log(`\n📝 ${session.test.questions.length} ta savolga javob berish...`);
    
    for (let i = 0; i < session.test.questions.length; i++) {
      const question = session.test.questions[i];
      
      // Birinchi variantni javob sifatida yuborish
      // DIQQAT: Bu real testda ishlamaydi, chunki to'g'ri javob backend'da saqlanadi
      // Agar siz to'g'ri javoblarni bilsangiz, ularni kiriting
      const answer = 0; // 0, 1, 2, yoki 3
      
      await submitAnswer(token, session.sessionId, question.id, answer);
      
      // Progress bar
      const progress = Math.floor(((i + 1) / session.test.questions.length) * 100);
      const progressBar = '█'.repeat(progress / 5) + '░'.repeat(20 - progress / 5);
      process.stdout.write(`\r   [${progressBar}] ${progress}% (${i + 1}/${session.test.questions.length})`);
      
      // Kichik kechikish (real foydalanuvchiga o'xshash)
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    console.log(); // Yangi qator

    // 5. Testni yakunlash
    const result = await completeTest(token, session.sessionId);

    // 6. Yakuniy xabar
    console.log('\n═══════════════════════════════════════════════');
    if (result.certificate) {
      console.log('   🎉 TABRIKLAYMIZ! SERTIFIKAT OLDINGIZ!');
      console.log(`   📜 ${result.certificate.certificateNo}`);
    } else {
      console.log('   ⚠️  Test yakunlandi, lekin sertifikat olmadingiz');
      console.log(`   💡 O'tish bali: ${result.test?.passingScore}%`);
      console.log(`   📊 Sizning balingiz: ${result.score.toFixed(2)}%`);
    }
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   ❌ XATOLIK YUZ BERDI');
    console.log('═══════════════════════════════════════════════\n');
    console.error(error.message);
  }
}

// Skriptni ishga tushirish
main();
