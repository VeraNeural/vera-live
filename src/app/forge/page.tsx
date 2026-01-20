import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserAccessState } from "@/lib/auth/accessState";
import ForgeLanding from "./ForgeLanding";

export const dynamic = "force-dynamic";

export default async function ForgePage() {
  const { userId } = await auth();
  if (userId) {
    const access = await getUserAccessState(userId);
    if (access.state === "forge" || access.state === "sanctuary") {
      redirect("/forge/room");
    }
  }

  return <ForgeLanding />;
}
