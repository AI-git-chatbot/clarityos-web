import { getServerSession } from "next-auth";
export const dynamic = "force-dynamic";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LandingPage from "@/components/LandingPage";
import IntentionForm from "@/components/IntentionForm";
import Dashboard from "@/components/Dashboard";
import prisma from "@/lib/prisma";
import { saveIntention } from "./actions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // 1. Not logged in → Show Landing Page
  if (!session?.user) {
    return <LandingPage />;
  }

  // 2. Logged in → Fetch user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! }
  });

  if (!user) return <LandingPage />;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const currentIntention = await prisma.dailyIntention.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: today
      }
    }
  });

  // 3. Logged in but no intention for today → Show Intention Form (checklist builder)
  if (!currentIntention) {
    return <IntentionForm onSubmit={saveIntention} />;
  }

  // 4. Logged in and intention set → Show Dashboard (pass checklist items)
  return <Dashboard user={user} intention={currentIntention} />;
}
