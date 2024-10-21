"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If there's no token, redirect to home
        router.push("/");
        return;
      }

      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        const userId = payload.id as string;

        if (!userId) {
          router.push("/");
        }
      } catch (error) {
        // In case of an invalid token, redirect to home
        console.error("Token verification failed:", error);
        router.push("/");
      }
    };

    checkToken(); // Call the async function
  }, [router]);
};

export default useAuthRedirect;
