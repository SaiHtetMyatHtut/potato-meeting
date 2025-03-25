"use client"

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const name = searchParams.get("name");
    const room = searchParams.get("room");
    
    // If name and room are present, redirect to the meeting page with those parameters
    if (name && room) {
      router.push(`/meet?name=${encodeURIComponent(name)}&room=${encodeURIComponent(room)}`);
    } else {
      // Otherwise, redirect to the join page
      router.push("/join");
    }
  }, [router, searchParams]);

  // Show a loading spinner while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}
