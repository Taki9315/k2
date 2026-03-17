import { redirect } from 'next/navigation';

/**
 * /prepcoach now redirects to the unified Prep Coach prompts page.
 * All prep coach functionality is consolidated at /prepcoach/prompts.
 */
export default function PrepCoachRedirect() {
  redirect('/prepcoach/prompts');
}
