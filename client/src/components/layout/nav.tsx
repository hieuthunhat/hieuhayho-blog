import { Link, NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-provider';

const baseLinks = [
  { to: '/#work', label: 'work' },
  { to: '/blogs', label: 'writing' },
  { to: '/contact', label: 'contact' },
];

export default function Nav() {
  const { isAdmin } = useAuth();
  const links = isAdmin
    ? [...baseLinks, { to: '/admin', label: 'admin' }]
    : baseLinks;

  return (
    <nav className="sticky top-0 z-40 mb-12 border-b border-blue-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 rounded-md">
            <AvatarFallback className="rounded-md bg-blue-700 text-sm font-medium text-white">
              H
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-blue-950">hieu.dev</span>
        </Link>

        <ul className="flex gap-6 text-sm font-medium text-blue-950">
          {links.map((l) => {
            const isAnchor = l.to.includes('#');
            if (isAnchor) {
              return (
                <li key={l.label}>
                  <a href={l.to} className="text-blue-900/80 transition-colors hover:text-blue-700">
                    {l.label}
                  </a>
                </li>
              );
            }
            return (
              <li key={l.label}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      'text-blue-900/80 transition-colors hover:text-blue-700',
                      isActive && 'font-semibold text-blue-700'
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
