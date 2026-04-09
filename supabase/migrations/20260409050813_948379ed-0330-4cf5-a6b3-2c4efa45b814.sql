CREATE POLICY "Users can delete their own redemptions"
ON public.redemptions
FOR DELETE
USING (auth.uid() = user_id);