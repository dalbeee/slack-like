import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import decode from "jwt-decode";

import { httpClient, tokenVault } from "@/common/httpClient";
import { RootState } from "@/common/store/store";
import { setAccessToken, setUser } from "@/common/store/userSlice";
import { User, UserJwtToken, UserLoginDto } from "@/common";

export const useUser = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const login = (body: UserLoginDto) => {
    httpClient.post<any, UserJwtToken>("/auth/login", body).then((r) => {
      dispatch(setAccessToken(r?.access_token as string));
      router.push("/auth/connect");
      const user: User = decode(r?.access_token as string);
      dispatch(setUser(user));
      tokenVault.setAccessToken(r?.access_token as string);
      tokenVault.vaultFlush();
      return;
    });
  };

  return { user, login };
};
