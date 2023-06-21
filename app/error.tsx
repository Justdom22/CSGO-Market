"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-error-100">Something went wrong!</h1>
    </div>
  );
}
