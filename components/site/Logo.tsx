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
        className="h-10 w-10 object-contain sm:h-11 sm:w-11"
      />
      <span className="flex flex-col">
        <span className={`text-lg font-bold tracking-tight sm:text-xl ${titleClass}`}>
          Vaiyu Industries
        </span>
        {showTagline && (
          <span className={`text-xs ${taglineClass} hidden sm:block`}>
            Powering Homes, Enhancing Lives
          </span>
        )}
      </span>
    </Link>
  );
}
