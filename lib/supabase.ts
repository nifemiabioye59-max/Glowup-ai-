import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.https://heycetkerfqyskkmmwafa.supabase.co || ''
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleWNldGtlcmZxeXNra213YWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTU1MDcsImV4cCI6MjEwMTMzMTUwN30.-IQLcezimH4ohoKW62mIWLXs7kQG4rC4SlwH6tiSIek || ''

export const supabase = createClient(supabaseUrl, supabaseKey)
