import { readFile, writeFile } from 'node:fs/promises';

async function readData() {
  const data = await readFile('events.json', 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await writeFile('events.json', JSON.stringify(data));
}

const _readData = readData;
export { _readData as readData };
const _writeData = writeData;
export { _writeData as writeData };