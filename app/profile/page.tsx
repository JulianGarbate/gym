import { getCurrentUser } from "@/lib/session";
import PageHeader from "@/components/PageHeader";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div>
      <PageHeader title="Mi perfil" subtitle="Tus datos personales" />
      <ProfileForm user={user} />
    </div>
  );
}
