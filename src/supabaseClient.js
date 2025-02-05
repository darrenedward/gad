import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kkzhonobihxezreozqkn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtremhvbm9iaWh4ZXpyZW96cWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MzczOTksImV4cCI6MjA1NDMxMzM5OX0.qd9wZvZ1FSaWs29gRnhhJmXONdHFOvCklQTKJYu07DI'

export const supabase = createClient(supabaseUrl, supabaseKey)
