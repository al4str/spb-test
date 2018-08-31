#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const util = require('util');

const { promisify } = util;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const statuses = [
  'active',
  'progress',
  'suspended',
];
const packagesTypes = [
  'barrel',
  'can33cl',
  'bottle33cl',
  'bottle50cl',
  'longneck300ml',
  'longneck750ml',
  'sixpackrings',
];
const minDate = new Date(2019, 0, 14);
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() *
  (end.getTime() - start.getTime()));
const getRandomChar = (length) => Math.random().toString(36).replace(/[\W]/gi, '')
  .substr(0, length);
const getRandomArrayItem = (array) => {
  const index = getRandomInt(0, array.length - 1);
  return array[index];
};
const getRandomPlannedDate = () => getRandomDate(minDate, new Date(2020, 0, 1));
const getRandomReference = () => {
  const length = getRandomInt(1, 5);
  const chars = getRandomChar(length).toUpperCase();
  return `CDRV${chars}`
};
const getRandomAmount = () => getRandomInt(1, 40) * 10;

(async () => {
  const filledPath = path.resolve(__dirname, 'data.json');
  const rawPath = path.resolve(__dirname, 'raw.json');
  const rawData = await readFile(rawPath, 'utf-8');
  const data = JSON.parse(rawData);
  const filledData = data.map(({ name, provider}, i) => ({
    id: `beer-${i + 1}`,
    name,
    status: getRandomArrayItem(statuses),
    packageType: getRandomArrayItem(packagesTypes),
    provider,
    plannedOn: getRandomPlannedDate(),
    reference: getRandomReference(),
    amountOrdered: getRandomAmount(),
  }));
  await writeFile(filledPath, JSON.stringify(filledData));
})();
