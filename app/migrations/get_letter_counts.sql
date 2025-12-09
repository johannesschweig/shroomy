CREATE OR REPLACE FUNCTION get_letter_counts()
RETURNS TABLE(letter TEXT, count BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COALESCE(
      UPPER(LEFT(preferred_common_name, 1)), 
      UPPER(LEFT(name, 1))
    ) AS letter,
    COUNT(*) AS count
  FROM public.fungi
  WHERE 
    preferred_common_name IS NOT NULL 
    OR name IS NOT NULL
    AND LEFT(UPPER(COALESCE(preferred_common_name, name)), 1) ~ '[A-Z]'
  GROUP BY letter
  ORDER BY letter;
$$;