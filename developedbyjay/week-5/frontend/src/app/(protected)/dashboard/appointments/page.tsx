import { AppointmentCards } from "./_components/appointment-cards";
import { AppointmentFormDialog } from "./_components/appointment-form-dialog";

const Page = () => {
  return (
    <div className="w-full space-y-12">
      <AppointmentFormDialog />
      <AppointmentCards />
    </div>
  );
};

export default Page;
