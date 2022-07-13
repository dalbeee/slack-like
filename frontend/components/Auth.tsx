import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import jwtDecode from "jwt-decode";

import { useUser } from "@/user/hooks/useUser";

const Auth: FC<any> = ({ children }) => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const isJwtExpired = () => {
      const decodedToken: { exp: string } = jwtDecode(
        user?.access_token as string
      );
      const now = Date.now() / 1000;
      return parseInt(decodedToken.exp) - now < 0;
    };
    if (!user?.access_token || isJwtExpired()) {
      router.push("/auth/login");
      return;
    }
  });

  return children;
};

export default Auth;
