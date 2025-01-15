export const getData = async (page: number, sort: string) => {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=stars:>1&sort=${sort}&order=desc&per_page=100&page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  return response.json();
};
