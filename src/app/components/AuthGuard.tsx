"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { usePathname } from "next/navigation";

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, status: userStatus } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (
      !(userStatus === "loading") &&
      !user &&
      pathname !== "/signIn" &&
      pathname !== "/"
    ) {
      router.push("/");
    }
  }, [user, userStatus, router]);

  if (userStatus === "loading") {
    return <div className="loading-spinner">Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
