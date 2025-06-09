import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NotAuthError } from "./errors.js";

// Bu kod bir kimlik doğrulama (authentication) ve
// yetkilendirme (authorization) modülüdür. Node.js/Express uygulamaları
// için JWT (JSON Web Token) tabanlı güvenlik sistemi sağlar.

const KEY = "supersecret";
const { compare } = bcrypt;
const { sign, verify } = jwt;

function createJSONToken(email) {
  return sign({ email }, KEY, { expiresIn: "1h" }); // Kullanıcı email'i ile JWT token oluşturur (1 saatlik geçerlilik)
}

// Bu fonksiyon JWT token doğrulama işlemi yapar. verify fonksiyonu jsonwebtoken kütüphanesinden gelir.

function validateJSONToken(token) {
  return verify(token, KEY);
}

function isValidPassword(password, storedPassword) {
  return compare(password, storedPassword);
}

// Bu kod bir Express.js middleware fonksiyonudur. HTTP isteklerinde kimlik doğrulama kontrolü yapar.
// Bu fonksiyon hiçbir şey döndürmüyor! Bu bir middleware fonksiyonu.

function checkAuthMiddleware(req, res, next) {
  // Tarayıcının güvenlik kontrolünü engelleme, asıl isteği bekle" demek.
  if (req.method === "OPTIONS") {
    return next();
  }

  // Authorization header kontrolü

  // HTTP isteğinde kimlik bilgilerini taşıyan özel alan:

  // İstek örneği:
  // fetch('/api/protected-route', {
  //   headers: {
  //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',  // ← Bu!
  //     'Content-Type': 'application/json'
  //   }
  // })

  if (!req.headers.authorization) {
    console.log("NOT AUTH. AUTH HEADER MISSING.");
    return next(new NotAuthError("Not authenticated."));
  }

  // Authorization header'ını parçalarına ayırıyor.

  // const authHeader = "Bearer eyJhbGciOiJIUzI1NiIs...";
  // const authFragments = authHeader.split(" ");

  // Sonuç:
  // authFragments = [
  //   "Bearer",                    // authFragments[0]
  //   "eyJhbGciOiJIUzI1NiIs..."   // authFragments[1]
  // ]
  const authFragments = req.headers.authorization.split(" ");

  // Authorization header'ın doğru formatta olup olmadığını kontrol ediyor.
  if (authFragments.length !== 2) {
    console.log("NOT AUTH. AUTH HEADER INVALID.");
    return next(new NotAuthError("Not authenticated."));
  }

  // Bu kod token kısmını çıkarıyor.

  // Authorization header:
  // ("Bearer eyJhbGciOiJIUzI1NiIs...");

  // split(" ") sonucu:
  // authFragments = [
  //   "Bearer",                    // authFragments[0]
  //   "eyJhbGciOiJIUzI1NiIs..."   // authFragments[1] ← Bunu alıyoruz
  // ]

  // // Sonuç:
  // const authToken = "eyJhbGciOiJIUzI1NiIs..."

  const authToken = authFragments[1];

  // Bu kod JWT token'ı doğrulamaya çalışıyor ve hata durumunu ele alıyor.

  try {
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
  } catch (error) {
    console.log("NOT AUTH. TOKEN INVALID.");
    return next(new NotAuthError("Not authenticated."));
  }
  next();
}

const _createJSONToken = createJSONToken;
export { _createJSONToken as createJSONToken };
const _validateJSONToken = validateJSONToken;
export { _validateJSONToken as validateJSONToken };
const _isValidPassword = isValidPassword;
export { _isValidPassword as isValidPassword };
export const checkAuth = checkAuthMiddleware;
