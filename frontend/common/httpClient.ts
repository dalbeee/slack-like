import axios from "axios";

const tokenVaultFactory = () => {
  let access_token = "";
  const setAccessToken = (token: string) => {
    access_token = token;
  };
  const getAccessToken = () => access_token;

  const vaultFlush = () => {
    httpClient.defaults.headers.common = {
      Authorization: `Bearer ${tokenVault.getAccessToken()}`,
    };
  };
  return { setAccessToken, getAccessToken, vaultFlush };
};

const getHttpClient = (baseURL: string) =>
  axios.create({
    baseURL,
  });

export const tokenVault = tokenVaultFactory();
export const httpClient = getHttpClient("http://localhost:3000");

httpClient.interceptors.response.use((res) => {
  return res.data;
});
