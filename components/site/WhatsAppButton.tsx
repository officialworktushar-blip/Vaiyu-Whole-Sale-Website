import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER ?? "919999999999";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Vaiyu Industries! I would like to know more about your wholesale products."
);

export default function WhatsAppButton() {
  return (
    <Link
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </Link>
  );
}
