import { getUserRoleFromHeaders } from "@/lib/auth";
import { TaskCards } from "./_components/task-card";
import { TaskFormDialog } from "./_components/task-form-dialog";
import { TaskFiltersDrawer } from "./_components/task-filter-drawer";

export default async function Page() {
  const userRole = await getUserRoleFromHeaders();
  return (
    <div className="max-w-6xl px-6 md:px-0 mx-auto w-full">
      <div className="flex my-10  px-6 md:px-0 justify-between items-center">
        <TaskFiltersDrawer />
        <TaskFormDialog />
      </div>
      <TaskCards userRole={userRole} />
    </div>
  );
}
