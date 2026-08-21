ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Professional Development',
  ADD COLUMN IF NOT EXISTS issued_on date;

UPDATE public.certificates SET category = 'AI Bootcamp'
WHERE title ILIKE '%AI%' OR title ILIKE '%machine learning%' OR title ILIKE '%learning algorithms%'
   OR title ILIKE '%prompt engineering%' OR title ILIKE '%python for data science%'
   OR provider ILIKE '%DeepLearning%';

UPDATE public.certificates SET category = 'Service Operations Practitioner'
WHERE provider ILIKE '%Cisco%';