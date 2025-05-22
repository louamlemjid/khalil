/*
  # Initial Schema Setup

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text)
      - `permissions` (text[])
      - `created_at` (timestamp)
    
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `password` (text)
      - `role_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category_id` (uuid, foreign key)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `stock`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `alert_threshold` (integer)
      - `last_updated` (timestamp)
    
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  permissions text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role_id uuid REFERENCES roles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category_id uuid REFERENCES categories(id),
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 0,
  alert_threshold integer NOT NULL DEFAULT 10,
  last_updated timestamptz DEFAULT now()
);

CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read roles" ON roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read user data" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can read categories" ON categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read products" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read stock" ON stock
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read clients" ON clients
  FOR SELECT TO authenticated USING (true);

-- Insert initial roles
INSERT INTO roles (name, permissions) VALUES
  ('admin', ARRAY['create', 'read', 'update', 'delete']),
  ('seller', ARRAY['read', 'create']);

-- Insert initial categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic products'),
  ('Clothing', 'Clothing and accessories'),
  ('Food', 'Food products'),
  ('Home', 'Home articles');