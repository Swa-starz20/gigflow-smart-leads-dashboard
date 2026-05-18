import { Outlet, Link } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { Moon, Sun, Sparkles, BarChart3, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: BarChart3, text: 'Pipeline analytics at a glance' },
  { icon: Shield, text: 'Role-based access control' },
  { icon: Zap, text: 'Advanced filters & CSV export' },
];

export const AuthLayout = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <div className="flex min-h-screen">
      <div className="auth-mesh relative hidden flex-1 flex-col justify-between overflow-hidden p-12 text-primary-foreground lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        <Link to="/" className="relative z-10 flex items-center gap-3 text-xl font-semibold">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 shadow-lg backdrop-blur-sm ring-1 ring-white/20">
            <Sparkles className="h-5 w-5" />
          </span>
          GigFlow
        </Link>
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
            Smart Leads Dashboard for modern sales teams
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-primary-foreground/85">
            Manage your pipeline with powerful filtering, role-based access, and real-time insights — built for speed.
          </p>
          <ul className="mt-10 space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} GigFlow. All rights reserved.
        </p>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center bg-background p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_50%)]" />
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-4 z-10 rounded-xl shadow-sm sm:right-6 sm:top-6"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <div className="relative z-10 w-full max-w-[420px] animate-fade-in-scale">
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl font-semibold">
              Gig<span className="text-primary">Flow</span>
            </span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
