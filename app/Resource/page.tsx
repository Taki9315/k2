'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Video,
  FileText,
  Link as LinkIcon,
  Image,
  Loader2,
} from 'lucide-react';

type Resource = {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string | null;
  file_url: string | null;
  access_level: string;
  sort_order: number;
};

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  pdf: <FileText className="h-4 w-4" />,
  link: <LinkIcon className="h-4 w-4" />,
  image: <Image className="h-4 w-4" />,
};

export default function ResourcePage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources')
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch((err) => console.error('Failed to load resources:', err))
      .finally(() => setLoading(false));
  }, []);

  const getHref = (r: Resource) => r.file_url || r.url || '#';
  const isExternal = (href: string) =>
    href.startsWith('http://') || href.startsWith('https://');

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Resource Library
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Curated tools, guides, and partner products to help you navigate
            commercial financing with confidence.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : resources.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No resources available yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {resources.map((resource) => {
                const href = getHref(resource);
                const external = isExternal(href);

                const inner = (
                  <li className="flex items-center gap-3 py-3 group transition-colors hover:bg-slate-50 -mx-3 px-3 rounded-lg">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      {typeIcons[resource.type] || <LinkIcon className="h-4 w-4" />}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {resource.title}
                    </span>
                    {external && (
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    )}
                  </li>
                );

                if (external) {
                  return (
                    <a
                      key={resource.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {inner}
                    </a>
                  );
                }

                return (
                  <Link key={resource.id} href={href}>
                    {inner}
                  </Link>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
