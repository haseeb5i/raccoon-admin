import jwt from 'jsonwebtoken';

export const removeHyphensUnderscoresAndMakeCamelCase = (text: string) =>
  text
    .toLowerCase()
    .split('_')
    .join('-')
    .split('-')
    .map((item: string) => `${(item?.[0] ?? '').toUpperCase()}${item.slice(1)}`)
    .join(' ');

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);

  if (date.toString() === 'Invalid Date') {
    return '-';
  }
  return date.toLocaleDateString('en-US');
  // return format(date, 'MM/dd/yyyy');
}

export const isTokenExpired = (token: string) => {
  if (!token) return true
  return false
  try {
    const decoded = jwt.decode(token) as { exp: number };
    if (!decoded || !decoded.exp) {
      return true;
    }
    const currentTime = new Date().getTime() / 1000;

    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration', error);
    return true;
  }
};

export const removeWhiteSpaces = (
  text: string,
  removeHyphensToo = false,
  joinWithHyphen = false
) =>
  removeHyphensToo
    ? text?.split(' ').join('')?.split('-')?.join('')
    : text?.split(' ').join(joinWithHyphen ? '-' : '');

export const sortArray = (
  array: { [key: string]: string }[],
  field: string,
  sortBy: 'asc' | 'desc',
  fieldType: 'text' | 'date'
) => {
  // Sorting using date
  if (fieldType === 'date') {
    return array.sort((a, b) => {
      if (sortBy === 'desc') {
        return new Date(b[field]) > new Date(a[field]) ? 1 : -1;
      }
      return new Date(b[field]) < new Date(a[field]) ? 1 : -1;
    });
  }

  // Sorting using normal text
  return array.sort((a, b) => {
    if (sortBy === 'desc') {
      return b[field] > a[field] ? 1 : -1;
    }
    return b[field] < a[field] ? 1 : -1;
  });
};


export function requiredErrorMsg(fieldName: string) {
  return `${fieldName} is required`;
}

export function minErrorMsg(fieldName: string, min: number) {
  return `${fieldName} must be at least ${min}`;
}