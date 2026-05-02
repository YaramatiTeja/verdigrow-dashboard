
-- FARMS
CREATE TABLE public.farms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  crop_type TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_farms_user_id ON public.farms(user_id);
CREATE INDEX idx_farms_created_at ON public.farms(created_at DESC);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own farms"
  ON public.farms FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own farms"
  ON public.farms FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own farms"
  ON public.farms FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own farms"
  ON public.farms FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- LOGS
CREATE TABLE public.logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  water_level INT NOT NULL DEFAULT 0,
  sunlight_hours INT NOT NULL DEFAULT 0,
  growth_stage TEXT NOT NULL DEFAULT 'Seedling',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_logs_farm_id ON public.logs(farm_id);
CREATE INDEX idx_logs_date ON public.logs(date DESC);

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs for their farms"
  ON public.logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));
CREATE POLICY "Users can insert logs for their farms"
  ON public.logs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));
CREATE POLICY "Users can update logs for their farms"
  ON public.logs FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));
CREATE POLICY "Users can delete logs for their farms"
  ON public.logs FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));

-- HARVESTS
CREATE TABLE public.harvests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_harvests_farm_id ON public.harvests(farm_id);
CREATE INDEX idx_harvests_date ON public.harvests(date DESC);

ALTER TABLE public.harvests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view harvests for their farms"
  ON public.harvests FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));
CREATE POLICY "Users can insert harvests for their farms"
  ON public.harvests FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));
CREATE POLICY "Users can update harvests for their farms"
  ON public.harvests FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));
CREATE POLICY "Users can delete harvests for their farms"
  ON public.harvests FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));
