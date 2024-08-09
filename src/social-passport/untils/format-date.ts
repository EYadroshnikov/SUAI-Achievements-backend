export function formatDate(date: Date): string {
  const day: string = String(date.getDate()).padStart(2, '0'); // ДД
  const month: string = String(date.getMonth() + 1).padStart(2, '0'); // ММ (месяцы с 0)
  const year: string = String(date.getFullYear()).slice(-2); // ГГ (последние две цифры года)
  const hours: string = String(date.getHours()).padStart(2, '0'); // ЧЧ
  const minutes: string = String(date.getMinutes()).padStart(2, '0'); // ММ

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
