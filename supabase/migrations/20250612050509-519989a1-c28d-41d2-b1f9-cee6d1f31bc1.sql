
-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Create storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add leave approval workflow columns to leave_requests table
ALTER TABLE public.leave_requests 
ADD COLUMN IF NOT EXISTS reviewer_comments TEXT,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Create RLS policies for leave_requests table
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own leave requests
CREATE POLICY "Users can view their own leave requests" ON public.leave_requests
FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to create their own leave requests
CREATE POLICY "Users can create their own leave requests" ON public.leave_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for admins/managers to view all leave requests
CREATE POLICY "Admins can view all leave requests" ON public.leave_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'ceo', 'hr', 'manager')
  )
);

-- Policy for admins/managers to update leave requests (approve/reject)
CREATE POLICY "Admins can update leave requests" ON public.leave_requests
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'ceo', 'hr', 'manager')
  )
);
