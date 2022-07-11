import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { useUser } from "@/user/hooks/useUser";

const Auth: FC<any> = ({ children }) => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.access_token) {
      router.push("/auth/login");
      return;
    }
  });
  return children;
};

export default Auth;
