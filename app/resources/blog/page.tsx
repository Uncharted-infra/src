import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">Blog</h1>
      <p className="text-muted-foreground text-center">Coming soon.</p>
      <Link href="/" className="text-primary hover:underline">
        Back to home
      </Link>
    </div>
  );
}
