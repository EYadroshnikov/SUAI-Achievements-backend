import { Transform } from 'class-transformer';

export function Capitalize() {
  return Transform(({ value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    return value;
  });
}
