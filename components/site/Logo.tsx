import Image from "next/image";
import Link from "next/link";

export default function Logo({
  variant = "dark",
  showTagline = true,
}: {
  variant?: "light" | "dark";
  showTagline?: boolean;
}) {
  const titleClass =
    variant === "light" ? "text-white" : "text-brand-navy";
  const taglineClass =
    variant === "light" ? "text-gray-300" : "text-brand-gray";

  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/Vaiyu.webp"
        alt="Vaiyu Industries logo"
        width={68}
        height={68}
        className="h-11 w-11 object-contain"
      />
      <span className="flex flex-col">
        <span className={`text-xl font-bold tracking-tight ${titleClass}`}>
          Vaiyu Industries
        </span>
        {showTagline && (
          <span className={`text-xs ${taglineClass}`}>
            Powering Homes, Enhancing Lives
          </span>
        )}
      </span>
    </Link>
  );
}
