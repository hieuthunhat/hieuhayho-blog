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
    <nav className="mx-auto mb-12 flex max-w-5xl items-center justify-between px-8 pt-8">
      <Link to="/" className="flex items-center gap-2.5">
        <Avatar className="h-8 w-8 rounded-md">
          <AvatarFallback className="rounded-md bg-blue-700 text-sm font-medium text-white">
            H
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-blue-950">hieu.dev</span>
      </Link>

      <ul className="flex gap-6 text-sm text-blue-900">
        {links.map((l) => {
          const isAnchor = l.to.includes('#');
          if (isAnchor) {
            return (
              <li key={l.label}>
                <a href={l.to} className="hover:underline">{l.label}</a>
              </li>
            );
          }
          return (
            <li key={l.label}>
              <NavLink
                to={l.to}
                className={({ isActive }) => cn('hover:underline', isActive && 'underline')}
              >
                {l.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
