import { Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export const Header = () => {
  return (
    <header className="bg-white text-black shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight hover:opacity-80 transition"
        >
          Profiler.
        </Link>

        <nav className="flex gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Главная
          </Link>
        </nav>
      </div>

      <Toaster />
    </header>
  );
};
