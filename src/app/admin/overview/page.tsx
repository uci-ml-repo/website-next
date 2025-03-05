import { AdminUsersOverview } from "@/components/admin/overview/AdminUsersOverview";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <AdminUsersOverview />
    </div>
  );
}
