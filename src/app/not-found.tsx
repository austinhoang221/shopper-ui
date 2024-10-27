"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./error.scss";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname === "/" || window.location.pathname === "") {
      router.replace("/en");
    }
  }, [router]);

  const handleGoHome = () => {
    const locale = window.location.pathname.split("/")[1] || "en";
    router.push(`/${locale}`);
  };

  return (
    <div className="message">
      <h1>404</h1>
      <h3>Not Found</h3>
      <h2>Sorry, the page you&apos;re looking for doesn&apos;t exists.</h2>
      <Button onClick={handleGoHome}>Back to home</Button>
    </div>
  );
};

export default NotFoundPage;
