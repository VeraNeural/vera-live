"use client";

import { useRouter } from "next/navigation";
import OpsRoom from "@/components/sanctuary/OpsRoom";

export default function ForgeRoom() {
  const router = useRouter();

  return (
    <OpsRoom
      onBack={() => router.push("/forge")}
      initialCategory="create"
    />
  );
}
