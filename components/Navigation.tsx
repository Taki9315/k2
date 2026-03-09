'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { supabase } from '@/lib/supabase';

export function Navigation() {
  const pathname = usePathname();
  const { user, signOut, isCertifiedBorrower, isKitBuyer, isPartner, isAdmin, fullName } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);
  const [mobileContentOpen, setMobileContentOpen] = useState(false);
  const contentDropdownRef = useRef<HTMLDivElement>(null);


  // Close desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (contentDropdownRef.current && !contentDropdownRef.current.contains(e.target as Node)) {
        setContentDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When logged in: role-based nav
  // When logged out: full public marketing nav
  const navLinks = user
    ? (() => {
        const links: { href: string; label: string }[] = [
          { href: '/dashboard', label: 'Home' },
          { href: '/content', label: 'Document Library' },
        ];

        if (isCertifiedBorrower) {
          // Certified: Home → Document Library → Prep Coach → Deal Room → Lender Outreach
          links.push({ href: '/prepcoach/prompts', label: 'Prep Coach' });
          links.push({ href: '/dashboard/deal-room', label: 'Deal Room' });
          links.push({ href: '/dashboard/lender-outreach', label: 'Lender Outreach' });
        } else if (isKitBuyer) {
          // Kit: Home → Document Library → Prep Coach → Deal Room → Lender Outreach (simpler)
          links.push({ href: '/prepcoach/prompts', label: 'Prep Coach' });
          links.push({ href: '/dashboard/deal-room', label: 'Deal Room' });
          links.push({ href: '/dashboard/lender-outreach', label: 'Lender Outreach' });
        } else {
          // Basic borrower: Success Kit upsell
          links.push({ href: '/workbook', label: 'Success Kit' });
        }

        return links;
      })()
    : [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/workbook', label: 'Success Kit' },
        { href: '/membership', label: 'Membership' },
        { href: '/content', label: 'Content' },
        { href: '/contact', label: 'Contact' },
      ];

  const contentSubLinks = [
    { href: '/workbook', label: 'Success Kit' },
    { href: '/content?tab=videos', label: 'Videos' },
    { href: '/content?tab=articles', label: 'Articles' },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Brand left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/brand.png"
                alt="Brand"
                width={250}
                height={126}
                className="object-contain"
              />
            </Link>
          </div>

          {/* User menu right */}
          <div className="flex items-center justify-end space-x-1">
            {user ? (
              <>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="user menu">
                    <User className="h-5 w-5 text-gray-900" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {fullName && (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium text-gray-900">{fullName}</div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {(isCertifiedBorrower || isKitBuyer) && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/documents">Application Docs</Link>
                    </DropdownMenuItem>
                  )}
                  {isCertifiedBorrower && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/resources">Partner Network</Link>
                    </DropdownMenuItem>
                  )}
                  {isPartner && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/affiliate">Affiliate Portal</Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="default" asChild className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-md">
                  <Link href="/login">Member Login</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation bar below header - centered (green) */}
      <nav className="border-t border-primary bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-12">
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => {
                // Content link gets a dropdown for sub-categories (public/logged-out only)
                if (link.href === '/content' && !user) {
                  return (
                    <div key="content-dropdown" ref={contentDropdownRef} className="relative">
                      <button
                        onClick={() => setContentDropdownOpen(!contentDropdownOpen)}
                        className={cn(
                          'inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-90',
                          pathname.startsWith('/content') ? 'text-primary-foreground' : 'text-primary-foreground/80'
                        )}
                      >
                        {link.label}
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', contentDropdownOpen && 'rotate-180')} />
                      </button>
                      {contentDropdownOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 rounded-lg border border-slate-200 bg-white py-1.5 shadow-xl z-50">
                          <Link
                            href="/content"
                            onClick={() => setContentDropdownOpen(false)}
                            className="block px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-slate-50 transition-colors"
                          >
                            All Content
                          </Link>
                          <div className="my-1 h-px bg-slate-100" />
                          {contentSubLinks.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setContentDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-gray-900 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:opacity-90',
                      pathname === link.href ? 'text-primary-foreground' : 'text-primary-foreground/80'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Page breadcrumbs */}
      <Breadcrumbs />

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary bg-primary">
          <div className="px-2 pt-2 pb-3 space-y-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {navLinks.map((link) => {
              // Content dropdown with sub-links (public/logged-out only)
              if (link.href === '/content' && !user) {
                return (
                  <div key="mobile-content-group">
                    <button
                      onClick={() => setMobileContentOpen(!mobileContentOpen)}
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium',
                        pathname.startsWith('/content')
                          ? 'bg-primary/80 text-primary-foreground'
                          : 'text-primary-foreground/90 hover:bg-primary/90'
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn('h-4 w-4 transition-transform', mobileContentOpen && 'rotate-180')} />
                    </button>
                    {mobileContentOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        <Link
                          href="/content"
                          className="block px-3 py-1.5 rounded-md text-sm font-medium text-primary-foreground/80 hover:bg-primary/90"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          All Content
                        </Link>
                        {contentSubLinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-3 py-1.5 rounded-md text-sm font-medium text-primary-foreground/80 hover:bg-primary/90"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium',
                    pathname === link.href
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'text-primary-foreground/90 hover:bg-primary/90'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground/90 hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {(isCertifiedBorrower || isKitBuyer) && (
                  <Link
                    href="/dashboard/documents"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground/90 hover:bg-primary/90"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Application Docs
                  </Link>
                )}
                {isCertifiedBorrower && (
                  <Link
                    href="/dashboard/resources"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground/90 hover:bg-primary/90"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Partner Network
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground/90 hover:bg-primary/90"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground/90 hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary-foreground/90 hover:bg-primary/90"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground/90 hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground bg-primary/80"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
