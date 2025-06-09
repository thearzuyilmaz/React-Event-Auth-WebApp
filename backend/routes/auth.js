import { Router } from 'express';  // Express router
import { add, get } from '../data/user.js';  // User DB operations
import { createJSONToken, isValidPassword } from '../util/auth.js';  // JWT & password
import { isValidEmail, isValidText } from '../util/validation.js';   // Validation helpers


// Bu kod Express.js authentication router - frontend'den gelen signup/login isteklerini handle ediyor. 

const router = Router();

router.post('/signup', async (req, res, next) => {
  const data = req.body;
  let errors = {}; // object, array degil

  if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email.'; // ✅ errors objesine ekleniyor
  } else {
    try {
      const existingUser = await get(data.email);
      if (existingUser) {
        errors.email = 'Email exists already.';
      }
    } catch (error) {}
  }

  if (!isValidText(data.password, 6)) {
    errors.password = 'Invalid password. Must be at least 6 characters long.'; // ✅ errors objesine ekleniyor
  }

  if (Object.keys(errors).length > 0) { // errors objesi boş değilse
    return res.status(422).json({
      message: 'User signup failed due to validation errors.',
      errors, // ✅ errors objesi response'a ekleniyor
    });
  }

  try {
    const createdUser = await add(data);
    // Output (authToken): " ."
    const authToken = createJSONToken(createdUser.email); // User'ın email'i ile JWT token oluşturuyor. Bu token ile user authenticated sayılır.
    // Success Response: HTTP status 201 (Created) set ediyor. JSON response gönderiyor.
    res
      .status(201)
      .json({ message: 'User created.', user: createdUser, token: authToken });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  try {
    user = await get(email); // Database'den email ile user ara
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed.' }); //  User bulunamadı
  }

  const pwIsValid = await isValidPassword(password, user.password); // Password Verification

  if (!pwIsValid) {
    return res.status(422).json({
      message: 'Invalid credentials.',
      errors: { credentials: 'Invalid email or password entered.' },
    });
  }

  const token = createJSONToken(email); // JWT token oluşturur
  res.json({ token }); // Token'ı response olarak gönderir
});

export default router;
