'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, PlayCircle, Eye, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'video' | 'article';
  access_level: 'public' | 'members_only';
  video_url: string | null;
  article_content: string | null;
  thumbnail_url: string | null;
  category: string;
  view_count: number;
  created_at: string;
};

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, hasMembership } = useAuth();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    (async () => {
      if (params.slug) {
        await fetchContent(params.slug as string);
      }
    })();
  }, [params.slug, user, hasMembership]);

  const fetchContent = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        router.push('/content');
        return;
      }

      setContent(data);

      const canAccess =
        data.access_level === 'public' ||
        (data.access_level === 'members_only' && hasMembership);

      setHasAccess(canAccess);

      if (canAccess && user) {
        await supabase.from('content_views').insert({
          content_id: data.id,
          user_id: user.id,
        });

        await supabase.rpc('increment_view_count', { content_id: data.id });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 py-20">
        <Card className="max-w-2xl w-full mx-4">
          <CardContent className="p-12 text-center">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Members-Only Content
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              This content is exclusive to our membership program. Join today to
              access this and all other member resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/membership">Join Membership</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/content">Browse Free Content</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-white py-8 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/content">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Content Hub
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border">
              {content.category}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {content.view_count} views
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {content.description}
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {content.type === 'video' && content.video_url ? (
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden mb-8">
              <iframe
                src={content.video_url}
                className="w-full h-full"
                allowFullScreen
                title={content.title}
              />
            </div>
          ) : content.type === 'article' && content.article_content ? (
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: content.article_content }}
              />
            </div>
          ) : (
            <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <PlayCircle className="h-24 w-24 text-slate-400 mx-auto mb-4" />
                <p className="text-gray-600">Content will be available soon</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Continue Learning
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore more free resources or take your education to the next level
            with our membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/content">More Free Content</Link>
            </Button>
            {!hasMembership && (
              <Button size="lg" asChild>
                <Link href="/membership">Join Membership</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
