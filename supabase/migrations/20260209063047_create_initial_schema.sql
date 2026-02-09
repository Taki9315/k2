/*
  # Initial Platform Schema

  ## Overview
  Creates the foundational database structure for a borrower education platform with
  digital product sales, membership management, and content delivery.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, references auth.users) - User profile ID
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### `products`
  - `id` (uuid, primary key) - Product ID
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `type` (text) - Product type: 'workbook', 'membership'
  - `price` (integer) - Price in cents
  - `stripe_price_id` (text, nullable) - Stripe price ID
  - `is_active` (boolean) - Whether product is available for purchase
  - `features` (jsonb) - Product features as JSON array
  - `created_at` (timestamptz) - Product creation timestamp

  ### `orders`
  - `id` (uuid, primary key) - Order ID
  - `user_id` (uuid, references profiles) - Buyer's user ID
  - `product_id` (uuid, references products) - Product purchased
  - `amount` (integer) - Amount paid in cents
  - `status` (text) - Order status: 'pending', 'completed', 'failed', 'refunded'
  - `stripe_payment_intent_id` (text, nullable) - Stripe payment intent ID
  - `created_at` (timestamptz) - Order creation timestamp

  ### `memberships`
  - `id` (uuid, primary key) - Membership ID
  - `user_id` (uuid, references profiles) - Member's user ID
  - `status` (text) - Status: 'active', 'cancelled', 'expired'
  - `started_at` (timestamptz) - Membership start date
  - `expires_at` (timestamptz, nullable) - Membership expiration date
  - `stripe_subscription_id` (text, nullable) - Stripe subscription ID
  - `created_at` (timestamptz) - Record creation timestamp

  ### `content`
  - `id` (uuid, primary key) - Content ID
  - `title` (text) - Content title
  - `slug` (text, unique) - URL-friendly slug
  - `description` (text) - Content description
  - `type` (text) - Content type: 'video', 'article'
  - `access_level` (text) - Access level: 'public', 'members_only'
  - `video_url` (text, nullable) - Video embed URL
  - `article_content` (text, nullable) - Article markdown content
  - `thumbnail_url` (text, nullable) - Thumbnail image URL
  - `category` (text) - Content category
  - `is_published` (boolean) - Whether content is published
  - `view_count` (integer) - Number of views
  - `created_at` (timestamptz) - Content creation timestamp
  - `updated_at` (timestamptz) - Last content update

  ### `content_views`
  - `id` (uuid, primary key) - View record ID
  - `content_id` (uuid, references content) - Content viewed
  - `user_id` (uuid, references profiles, nullable) - User who viewed (null for anonymous)
  - `viewed_at` (timestamptz) - View timestamp

  ### `contact_inquiries`
  - `id` (uuid, primary key) - Inquiry ID
  - `type` (text) - Inquiry type: 'general', 'partnership'
  - `name` (text) - Inquirer's name
  - `email` (text) - Inquirer's email
  - `company` (text, nullable) - Company name (for partnerships)
  - `message` (text) - Inquiry message
  - `status` (text) - Status: 'new', 'read', 'responded'
  - `created_at` (timestamptz) - Inquiry submission timestamp

  ## Security
  - Enable RLS on all tables
  - Profiles: Users can read their own profile, update their own profile
  - Products: Public read access, admin-only write
  - Orders: Users can read their own orders
  - Memberships: Users can read their own membership status
  - Content: Public can read published public content, members can read member content
  - Content Views: Users can create view records
  - Contact Inquiries: Anyone can create, admin-only read
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('workbook', 'membership')),
  price integer NOT NULL DEFAULT 0,
  stripe_price_id text,
  is_active boolean DEFAULT true,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  TO public
  USING (is_active = true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own membership"
  ON memberships FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('video', 'article')),
  access_level text NOT NULL DEFAULT 'public' CHECK (access_level IN ('public', 'members_only')),
  video_url text,
  article_content text,
  thumbnail_url text,
  category text NOT NULL DEFAULT 'general',
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published public content"
  ON content FOR SELECT
  TO public
  USING (is_published = true AND access_level = 'public');

CREATE POLICY "Members can read published member content"
  ON content FOR SELECT
  TO authenticated
  USING (
    is_published = true AND (
      access_level = 'public' OR 
      (access_level = 'members_only' AND EXISTS (
        SELECT 1 FROM memberships 
        WHERE memberships.user_id = auth.uid() 
        AND memberships.status = 'active'
      ))
    )
  );

-- Create content_views table
CREATE TABLE IF NOT EXISTS content_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at timestamptz DEFAULT now()
);

ALTER TABLE content_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create view records"
  ON content_views FOR INSERT
  TO public
  WITH CHECK (true);

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('general', 'partnership')),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create inquiries"
  ON contact_inquiries FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(is_published, access_level);
CREATE INDEX IF NOT EXISTS idx_content_views_content_id ON content_views(content_id);