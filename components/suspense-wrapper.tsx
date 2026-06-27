import { Suspense } from "react";

export function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      {children}
    </Suspense>
  );
}