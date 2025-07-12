-- Enable Row Level Security

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  availability TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_skills table (skills a user can offer)
CREATE TABLE public.user_skills_offered (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Create user_skills_wanted table (skills a user wants to learn)
CREATE TABLE public.user_skills_wanted (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  priority_level TEXT CHECK (priority_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Create skill_swaps table
CREATE TABLE public.skill_swaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  offered_skill_id UUID REFERENCES public.skills(id),
  requested_skill_id UUID REFERENCES public.skills(id),
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swap_id UUID REFERENCES public.skill_swaps(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills_offered ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills_wanted ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Skills policies (public read, admin write)
CREATE POLICY "Skills are viewable by everyone" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert skills" ON public.skills
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- User skills policies
CREATE POLICY "User skills are viewable by everyone" ON public.user_skills_offered
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own offered skills" ON public.user_skills_offered
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "User wanted skills are viewable by everyone" ON public.user_skills_wanted
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own wanted skills" ON public.user_skills_wanted
  FOR ALL USING (auth.uid() = user_id);

-- Skill swaps policies
CREATE POLICY "Users can view swaps they're involved in" ON public.skill_swaps
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = provider_id);

CREATE POLICY "Users can create swap requests" ON public.skill_swaps
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update swaps they're involved in" ON public.skill_swaps
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = provider_id);

-- Feedback policies
CREATE POLICY "Feedback is viewable by everyone" ON public.feedback
  FOR SELECT USING (true);

CREATE POLICY "Users can create feedback for their swaps" ON public.feedback
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.skill_swaps 
      WHERE id = swap_id AND (requester_id = auth.uid() OR provider_id = auth.uid())
    )
  );
