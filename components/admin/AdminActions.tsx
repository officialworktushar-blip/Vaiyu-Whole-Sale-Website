"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

async function handleRequest(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: Record<string, unknown>,
): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      return data.error ?? "Request failed.";
    }
    return null;
  } catch {
    return "Request failed.";
  }
}

export function ProductToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const errorMessage = await handleRequest(
      `/api/admin/products/${id}`,
      "PATCH",
      { isActive: !active },
    );
    setError(errorMessage ?? "");
    setBusy(false);
    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          active
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </button>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  );
}

export function ProductDeleteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const remove = async () => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    if (busy) return;
    setBusy(true);
    const errorMessage = await handleRequest(
      `/api/admin/products/${id}`,
      "DELETE",
    );
    setError(errorMessage ?? "");
    setBusy(false);
    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-brand-red transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  );
}

export function BannerToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const errorMessage = await handleRequest(
      `/api/admin/banners/${id}`,
      "PATCH",
      { isActive: !active },
    );
    setError(errorMessage ?? "");
    setBusy(false);
    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          active
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </button>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  );
}

export function BannerDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const remove = async () => {
    if (!window.confirm("Delete this banner?")) return;
    if (busy) return;
    setBusy(true);
    const errorMessage = await handleRequest(`/api/admin/banners/${id}`, "DELETE");
    setError(errorMessage ?? "");
    setBusy(false);
    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-brand-red transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  );
}

export function BannerMoveButtons({
  id,
  move,
  disabled,
}: {
  id: string;
  move: "up" | "down";
  disabled?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (busy || disabled) return;
    setBusy(true);
    const errorMessage = await handleRequest(
      `/api/admin/banners/${id}`,
      "PATCH",
      { move },
    );
    setError(errorMessage ?? "");
    setBusy(false);
    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={busy || disabled}
        title={move === "up" ? "Move up" : "Move down"}
        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-brand-navy transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {move === "up" ? "\u2191" : "\u2193"}
      </button>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  );
}

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const update = async (next: string) => {
    if (next === status || busy) return;
    setBusy(true);
    const errorMessage = await handleRequest(
      `/api/admin/orders/${orderId}`,
      "PATCH",
      { status: next },
    );
    setError(errorMessage ?? "");
    setBusy(false);
    if (!errorMessage) router.refresh();
  };

  return (
    <div>
      <select
        value={status}
        onChange={(event) => update(event.target.value)}
        disabled={busy}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange disabled:opacity-50"
      >
        {ORDER_STATUSES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  );
}

export function OrderStatusFilter({ current }: { current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);

  const onChange = (next: string) => {
    setValue(next);
    router.push(next === "ALL" ? "/admin/orders" : `/admin/orders?status=${next}`);
    router.refresh();
  };

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
    >
      <option value="ALL">All statuses</option>
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
