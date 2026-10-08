# חיבור האתר ל־Firebase (חינם)

1. היכנסו ל־console.firebase.google.com ופתחו פרויקט חדש (אפשר בלי Google Analytics).
2. Project settings → Your apps → סמל `</>` (Web) → רשמו שם → העתיקו את אובייקט `firebaseConfig`.
3. הדביקו אותו ב־`firebase-config.js` במקום `null`, בצורה: `window.FIREBASE_CONFIG={...};`
4. Build → Authentication → Get started → Sign-in method → הפעילו Email/Password. בלשונית Users לחצו Add user ויצרו משתמש לכל אחד משלושת המנהלים.
5. Build → Firestore Database → Create database → Production mode.
6. בלשונית Rules הדביקו את התוכן של `firestore.rules`, החליפו את שלוש כתובות הדוא"ל בכתובות המנהלים ולחצו Publish.
7. בהגדרות Authentication → Settings → Authorized domains הוסיפו את כתובת האתר שלכם (למשל `שם-משתמש.github.io`).
8. העלו את כל הקבצים לאירוח (GitHub Pages וכד'), היכנסו ל־`admin.html`, והתחברו.
9. בכניסה הראשונה לחצו "ייבוא נתוני התחלה מ־data.js" כדי למלא את הרייטינג, האלופים והטורנירים.
