import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isRequestFromAdmin } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAdmin = await isRequestFromAdmin();

  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <div>
      <AdminHeader />
      <div className="container-section">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
