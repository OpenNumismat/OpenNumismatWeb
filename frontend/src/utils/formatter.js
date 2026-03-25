import i18n from "@/i18n/index.js";

export function convertFraction(convert_fraction, value) {
  if (convert_fraction) {
    if (value === 0.02)
      return '1⁄48'
    else if (value === 0.04)
      return '1⁄24';
    else if (value === 0.05)
      return '1⁄20'
    else if (value === 0.06)
      return '1⁄16';
    else if (value === 0.08)
      return '1⁄12';
    else if (value === 0.1)
      return '⅒';
    else if (value === 0.12)
      return '⅛';
    else if (value === 0.16)
      return '⅙';
    else if (value === 0.2)
      return '⅕';
    else if (value === 0.25)
      return '¼';
    else if (value === 0.33)
      return '⅓';
    else if (value === 0.5)
      return '½';
    else if (value === 0.66)
      return '⅔';
    else if (value === 0.75)
      return '¾';
    else if (value === 1.25)
      return '1¼';
    else if (value === 1.5)
      return '1½';
    else if (value === 2.5)
      return '2½';
    else if (value === 4.5)
      return '4½';
    else if (value === 7.5)
      return '7½';
    else if (value === 12.5)
      return '12½';
  }

  try {
    return i18n.global.n(value);
  }
  catch (e) {
    return value;
  }
}

export function formatYear(enable_bc, year) {
  if (enable_bc) {
    if (year < 0)
      return -year + '\u00A0' + i18n.global.t('BC');
  }

  return year;
}

export function convertLinksToAnchors(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  try {
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
  }
  catch (e) {
    return text;
  }
}
