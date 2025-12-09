CREATE OR REPLACE FUNCTION get_mushrooms_by_letter(p_letter TEXT)
RETURNS TABLE(
  id integer,
  name TEXT,
  preferred_common_name TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    id,
    name,
    preferred_common_name
  FROM public.fungi
  WHERE 
    (preferred_common_name IS NOT NULL OR name IS NOT NULL)
    AND UPPER(LEFT(COALESCE(preferred_common_name, name), 1)) = UPPER(p_letter)
  ORDER BY COALESCE(preferred_common_name, name) ASC;
$$;
