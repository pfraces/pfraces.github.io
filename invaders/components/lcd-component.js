import { h } from '../lib/engine/engine.js';
import { constant } from '../lib/fp.js';
import { settings } from '../settings.js';

const digitMap = [
  ' _     _  _     _  _  _  _  _ ',
  '| |  | _| _||_||_ |_   ||_||_|',
  '|_|  ||_  _|  | _||_|  ||_| _|'
];

const digitWidth = 3;
const digitHeight = 3;

const numberDigits = function (number) {
  return number
    .toString()
    .split('')
    .map(function (digit) {
      return parseInt(digit, 10);
    });
};

export const lcdDigit = function (number) {
  const start = digitWidth * number;
  const end = start + digitWidth;
  return digitMap.map(function (row) {
    return row.slice(start, end);
  });
};

const concatLcdDigits = function (lcdDigits) {
  const result = [...Array(digitHeight)].map(constant(''));

  lcdDigits.forEach(function (lcdDigit) {
    for (let i = 0; i < digitHeight; i++) {
      result[i] += lcdDigit[i];
    }
  });

  return result;
};

const lcdNumber = function (number) {
  const digits = numberDigits(number);
  const lcdDigits = digits.map(lcdDigit);
  return concatLcdDigits(lcdDigits).join('\n');
};

export const lcdComponent = function ({ number }) {
  return h(
    'pre.lcd',
    {
      style: {
        fontSize: `calc(${settings.theme.fontSize} * 0.5)`
      }
    },
    lcdNumber(number)
  );
};
