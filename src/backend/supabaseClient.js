import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ugkmfnajclvgwasvykuv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVna21mbmFqY2x2Z3dhc3Z5a3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzQxNTEsImV4cCI6MjA1Nzc1MDE1MX0.rhZrp7qh1RbPk6X-GFlLH83RZPNO4vKsRE1LmfWRNZE'
export const supabase = createClient(supabaseUrl, supabaseKey)