import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
