"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname === '/') {
      router.replace('/en');
    }
  }, [router]);

  return (
    <div>
      <h1>404</h1>
      <span>OOPS! PAGE NOT FOUND</span>
      <p>Sorry, the page you&apos;re looking for doesn&apos;t exists.</p>
      <Button>GO HOME</Button>
    </div>
  );
};

export default NotFoundPage;
