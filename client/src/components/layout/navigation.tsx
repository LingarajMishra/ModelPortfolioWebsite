import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-8 text-xl font-semibold">
          Portfolio
        </div>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === item.href 
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
