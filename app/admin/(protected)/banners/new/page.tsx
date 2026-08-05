import BannerForm from "@/components/admin/BannerForm";

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Add New Banner</h1>
      <div className="mt-6">
        <BannerForm />
      </div>
    </div>
  );
}
