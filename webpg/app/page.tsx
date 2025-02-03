"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TextPressure from "@/components/ui/Textpressure";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to</h1>
      <div style={{ position: "relative", height: "300px" }}>
        <TextPressure
          text="SmoothOPs"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#000000"
          strokeColor="#ff0000"
          minFontSize={175}
        />
      </div>
      <p className="text-xl mb-8">
        Simplify and automate your job application process
      </p>
      <div className="flex space-x-4">
        <Link href="/sign-up">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/sign-in">
          <Button variant="outline">Log In</Button>
        </Link>
      </div>
    </div>
  );
}
