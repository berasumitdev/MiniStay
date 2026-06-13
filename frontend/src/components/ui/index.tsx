import type { ReactNode, ButtonHTMLAttributes } from "react";

export function Button({
  children,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "ghost";
}) {
  const base =
    "px-3 py-1.5 rounded text-sm font-medium disabled:opacity-50 transition";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "border border-gray-300 hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  color = "gray",
}: {
  children: ReactNode;
  color?: string;
}) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${colors[color] ?? colors.gray}`}
    >
      {children}
    </span>
  );
}

export function Spinner() {
  return <div className="text-sm text-gray-500 py-8 text-center">Loading…</div>;
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
      {message}
    </div>
  );
}
