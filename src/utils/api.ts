export const getData = (page: number, sort: string) => {
  return fetch(
    `https://api.github.com/search/repositories?q=stars:>1&sort=${sort}&order=desc&per_page=20&page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(`${err.message}`);
    });
};
