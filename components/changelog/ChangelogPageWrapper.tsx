import React from "react";

interface ChangelogPageWrapperProps {
  children: React.ReactNode;
}

export function ChangelogPageWrapper({ children }: ChangelogPageWrapperProps) {
  return (
    <div className="relative w-full min-h-screen bg-background transition-colors duration-300">
      <main className="relative z-10 pt-10 md:pt-14">
        {children}
      </main>
    </div>
  );
}
