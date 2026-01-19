import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserAccessState } from "@/lib/auth/accessState";
import ForgeRoom from "../ForgeRoom";

export const dynamic = "force-dynamic";

export default async function ForgeRoomPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const access = await getUserAccessState(userId);
  if (access.state !== "forge" && access.state !== "sanctuary") {
    redirect("/forge");
  }

  return <ForgeRoom />;
}
