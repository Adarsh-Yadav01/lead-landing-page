"use client";
import { useEffect } from "react";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  useEffect(() => {
    import("react-facebook-pixel")
      .then((m) => m.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.NEXT_PUBLIC_PIXEL_ID);
        ReactPixel.pageView();
      });
  }, []);

  return (
  <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200">
      <LeadForm />
    </main>
  );
}
