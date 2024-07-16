function getQueryParam(query: string, param: string): string | null {
  const params = query.split('&');
  for (const p of params) {
    const [key, value] = p.split('=');
    if (key === param) {
      return value;
    }
  }
  return null;
}

export default getQueryParam;
