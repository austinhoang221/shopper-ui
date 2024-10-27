"use client"; // Error boundaries must be Client Components
import { Button } from "@/components/ui/button";
import "./error.scss";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="message">
      <h1>500</h1>
      <h3>Server Error</h3>
      <h2>
        Sorry, something went wrong on our end. We are currently trying to fix
        the problem.
      </h2>
      <Button onClick={() => reset()}>Refresh the page</Button>
    </div>
  );
}
