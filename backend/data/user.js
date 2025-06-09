import bcrypt from 'bcryptjs';
import { v4 as generateId } from 'uuid'; // Unique ID oluşturma
import { NotFoundError } from '../util/errors.js'; // Custom error
import { readData, writeData } from './util.js';   // File I/O operations

// Bu kod user authentication için database operations yapıyor. 
// File-based bir database sistemi kullanarak user kaydetme ve bulma işlemleri gerçekleştiriyor.

const { hash } = bcrypt;


async function add(data) {
  const storedData = await readData(); // Mevcut users.json dosyasını oku
  const userId = generateId(); // UUID: "f47ac10b-58cc-4372-a567..."
  const hashedPw = await hash(data.password, 12); // Input:  "123456" Output: "$2a$12$Xu3QGqkhmm5cE4JYk3VNqeE8F9mZgmJx..."
  if (!storedData.users) {
    storedData.users = [];
  }
  storedData.users.push({ ...data, password: hashedPw, id: userId });
  await writeData(storedData);
  return { id: userId, email: data.email };
}

async function get(email) {
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError('Could not find any users.');
  }

  const user = storedData.users.find((ev) => ev.email === email);
  if (!user) {
    throw new NotFoundError('Could not find user for email ' + email);
  }

  return user;
}

const _add = add;
export { _add as add };
const _get = get;
export { _get as get };
