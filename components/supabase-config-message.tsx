import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function SupabaseConfigMessage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 mt-8">
      <Alert variant="destructive" className="mb-6">
        <AlertTitle className="text-lg font-semibold">Supabase Configuration Required</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">
            Your Supabase environment variables are not configured. Please add the following environment variables to
            your project:
          </p>
          <div className="bg-slate-900 text-white p-4 rounded-md mb-4 overflow-x-auto">
            <pre>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</pre>
          </div>
          <p className="mb-4">You can find these values in your Supabase project settings under API settings.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild>
              <Link
                href="https://supabase.com/dashboard/project/_/settings/api"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to Supabase Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href="https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Supabase + Next.js Guide
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
