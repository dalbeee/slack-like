import axios from "axios";

const getHttpClient = (baseURL: string) =>
  axios.create({
    baseURL,
  });

export const httpClient = getHttpClient("http://localhost:3000");

httpClient.interceptors.response.use((res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.data;
});
