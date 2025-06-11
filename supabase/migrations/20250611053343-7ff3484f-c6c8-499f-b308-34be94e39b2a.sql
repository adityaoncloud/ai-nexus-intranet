
-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'employee', 'hr', 'manager', 'ceo');
CREATE TYPE public.leave_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.leave_type AS ENUM ('vacation', 'sick', 'personal', 'maternity', 'paternity');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'employee',
    department TEXT,
    position TEXT,
    manager_id UUID REFERENCES public.profiles(id),
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create holidays table
CREATE TABLE public.holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    is_company_wide BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create HR policies table
CREATE TABLE public.hr_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CEO updates table
CREATE TABLE public.ceo_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave requests table
CREATE TABLE public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    leave_type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status leave_status DEFAULT 'pending',
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance reviews table
CREATE TABLE public.performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES auth.users(id) NOT NULL,
    reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
    rating DECIMAL(3,2) CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    review_period TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding tasks table
CREATE TABLE public.onboarding_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    is_required BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user onboarding progress table
CREATE TABLE public.user_onboarding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    task_id UUID REFERENCES public.onboarding_tasks(id) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    UNIQUE(user_id, task_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = required_role
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_above(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role IN ('admin', 'ceo', 'hr', 'manager')
    );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin_or_above(auth.uid()));

-- RLS Policies for holidays
CREATE POLICY "Everyone can view holidays" ON public.holidays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage holidays" ON public.holidays FOR ALL TO authenticated USING (public.is_admin_or_above(auth.uid()));

-- RLS Policies for HR policies
CREATE POLICY "Everyone can view active HR policies" ON public.hr_policies FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage HR policies" ON public.hr_policies FOR ALL TO authenticated USING (public.is_admin_or_above(auth.uid()));

-- RLS Policies for CEO updates
CREATE POLICY "Everyone can view CEO updates" ON public.ceo_updates FOR SELECT TO authenticated USING (true);
CREATE POLICY "CEOs and admins can manage CEO updates" ON public.ceo_updates FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'ceo') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for leave requests
CREATE POLICY "Users can view own leave requests" ON public.leave_requests FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Managers can view team leave requests" ON public.leave_requests FOR SELECT TO authenticated USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Users can create own leave requests" ON public.leave_requests FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own pending leave requests" ON public.leave_requests FOR UPDATE TO authenticated USING (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Managers can update leave requests" ON public.leave_requests FOR UPDATE TO authenticated USING (public.is_admin_or_above(auth.uid()));

-- RLS Policies for performance reviews
CREATE POLICY "Users can view own reviews" ON public.performance_reviews FOR SELECT TO authenticated USING (employee_id = auth.uid());
CREATE POLICY "Managers can view all reviews" ON public.performance_reviews FOR SELECT TO authenticated USING (public.is_admin_or_above(auth.uid()));
CREATE POLICY "Managers can create reviews" ON public.performance_reviews FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_above(auth.uid()));

-- RLS Policies for onboarding tasks
CREATE POLICY "Everyone can view active onboarding tasks" ON public.onboarding_tasks FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage onboarding tasks" ON public.onboarding_tasks FOR ALL TO authenticated USING (public.is_admin_or_above(auth.uid()));

-- RLS Policies for user onboarding progress
CREATE POLICY "Users can view own onboarding progress" ON public.user_onboarding_progress FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own onboarding progress" ON public.user_onboarding_progress FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all onboarding progress" ON public.user_onboarding_progress FOR SELECT TO authenticated USING (public.is_admin_or_above(auth.uid()));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'employee'
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.onboarding_tasks (title, description, category, sort_order) VALUES
('Complete Profile Setup', 'Upload profile picture and update personal information', 'Profile', 1),
('Read Employee Handbook', 'Review and acknowledge the employee handbook', 'Documentation', 2),
('IT Equipment Setup', 'Collect laptop, access cards, and other IT equipment', 'IT', 3),
('Meet Your Team', 'Schedule introductory meetings with team members', 'Social', 4),
('Security Training', 'Complete mandatory security awareness training', 'Training', 5),
('Benefits Enrollment', 'Enroll in health insurance and other benefits', 'HR', 6);

INSERT INTO public.holidays (name, date, description) VALUES
('New Year''s Day', '2024-01-01', 'New Year holiday'),
('Independence Day', '2024-07-04', 'Independence Day celebration'),
('Labor Day', '2024-09-02', 'Labor Day holiday'),
('Thanksgiving', '2024-11-28', 'Thanksgiving holiday'),
('Christmas Day', '2024-12-25', 'Christmas holiday');

INSERT INTO public.hr_policies (title, content, category) VALUES
('Remote Work Policy', 'Our remote work policy allows employees to work from home up to 3 days per week with manager approval.', 'Work Arrangements'),
('Code of Conduct', 'All employees are expected to maintain professional behavior and treat colleagues with respect.', 'Behavior'),
('Time Off Policy', 'Employees accrue 2.5 days of PTO per month, with a maximum carryover of 40 hours.', 'Benefits');

INSERT INTO public.ceo_updates (title, content, is_featured) VALUES
('Q1 2024 Company Performance', 'We are pleased to announce that we exceeded our Q1 targets by 15%. Thank you all for your hard work and dedication.', true),
('New Office Opening', 'We are excited to announce the opening of our new office in Austin, Texas. This expansion will help us better serve our clients.', false);
