import React from "react";
import type {
  CaseStatus,
  HealthStatus,
  OperationStatus,
  OperationType,
  SeasonStatus,
  TaskPriority,
  TaskStatus,
} from "./data";

/* ------------------------------------------------------------------ icons */
// Minimal stroke icon set (24x24, currentColor). Kept intentionally spare —
// no cartoon fish, per brief.
type IconProps = { className?: string; size?: number };
const svg = (path: React.ReactNode) =>
  function Icon({ className, size = 20 }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {path}
      </svg>
    );
  };

export const Icons = {
  home: svg(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>),
  layers: svg(<><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>),
  check: svg(<path d="M20 6 9 17l-5-5" />),
  checkList: svg(<><path d="M9 6h11" /><path d="M9 12h11" /><path d="M9 18h11" /><path d="m3 6 1 1 2-2" /><path d="m3 12 1 1 2-2" /><path d="m3 18 1 1 2-2" /></>),
  bell: svg(<><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>),
  user: svg(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  drop: svg(<path d="M12 3s6 5.5 6 10a6 6 0 0 1-12 0c0-4.5 6-10 6-10Z" />),
  heart: svg(<path d="M12 20s-7-4.7-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.3-7 10-7 10Z" />),
  ops: svg(<><path d="M12 3v3" /><path d="M12 18v3" /><path d="M3 12h3" /><path d="M18 12h3" /><circle cx="12" cy="12" r="4" /></>),
  chip: svg(<><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></>),
  chat: svg(<path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z" />),
  warn: svg(<><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></>),
  chevronR: svg(<path d="m9 6 6 6-6 6" />),
  back: svg(<path d="m15 6-6 6 6 6" />),
  plus: svg(<><path d="M12 5v14" /><path d="M5 12h14" /></>),
  clock: svg(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  pin: svg(<><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>),
  camera: svg(<><path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" /><circle cx="12" cy="13" r="3.2" /></>),
  ban: svg(<><circle cx="12" cy="12" r="9" /><path d="m5.6 5.6 12.8 12.8" /></>),
  send: svg(<path d="m4 12 16-8-6 16-3-6-7-2Z" />),
  star: svg(<path d="M12 4.5l2.3 4.7 5.2.8-3.8 3.6.9 5.1L12 16.9 7.4 18.7l.9-5.1L4.5 10l5.2-.8L12 4.5Z" />),
  logout: svg(<><path d="M15 4h4v16h-4" /><path d="M10 8l-4 4 4 4" /><path d="M6 12h10" /></>),
  shield: svg(<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />),
  info: svg(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  sparkle: svg(<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />),
  flask: svg(<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M7.5 15h9" /></>),
  pills: svg(<><rect x="3" y="9" width="9" height="6" rx="3" transform="rotate(45 7.5 12)" /><circle cx="16" cy="16" r="4.5" /></>),
};

/* ------------------------------------------------------------------ format */
export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
export const fmtDateTime = (iso: string) => `${fmtTime(iso)} · ${fmtDate(iso)}`;
export const num = (n: number) => n.toLocaleString("vi-VN");

/* ------------------------------------------------------------------ badge */
export type Tone = "ocean" | "teal" | "amber" | "rose" | "violet" | "slate";
const toneClass: Record<Tone, string> = {
  ocean: "bg-ocean-50 text-ocean-700",
  teal: "bg-teal-50 text-teal-500",
  amber: "bg-amber-50 text-amber-500",
  rose: "bg-rose-50 text-rose-500",
  violet: "bg-violet-50 text-violet-500",
  slate: "bg-slate-50 text-slate-500",
};

// Static maps so Tailwind v4 JIT can see every class name.
export const toneSoftBg: Record<Tone, string> = {
  ocean: "bg-ocean-50",
  teal: "bg-teal-50",
  amber: "bg-amber-50",
  rose: "bg-rose-50",
  violet: "bg-violet-50",
  slate: "bg-slate-50",
};
export const toneText: Record<Tone, string> = {
  ocean: "text-ocean-600",
  teal: "text-teal-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
  violet: "text-violet-500",
  slate: "text-slate-500",
};
// tone icon chip = soft bg + colored icon
export const chip = (t: Tone) => `${toneSoftBg[t]} ${toneText[t]}`;

export function Badge({
  children,
  tone = "slate",
  dot = false,
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${toneClass[tone]} ${className}`}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* --- status mappings straight from the schema enums --- */
export const seasonMeta: Record<SeasonStatus, { label: string; tone: Tone }> = {
  planning: { label: "Đang chuẩn bị", tone: "violet" },
  active: { label: "Đang nuôi", tone: "teal" },
  completed: { label: "Đã kết thúc", tone: "slate" },
  cancelled: { label: "Đã hủy", tone: "rose" },
};
export const opMeta: Record<OperationStatus, { label: string; tone: Tone }> = {
  planned: { label: "Đã lên lịch", tone: "ocean" },
  completed: { label: "Đã thực hiện", tone: "teal" },
  cancelled: { label: "Đã hủy", tone: "slate" },
};
export const healthMeta: Record<HealthStatus, { label: string; tone: Tone }> = {
  excellent: { label: "Rất tốt", tone: "teal" },
  good: { label: "Tốt", tone: "teal" },
  warning: { label: "Cần chú ý", tone: "amber" },
  critical: { label: "Nguy cấp", tone: "rose" },
};
export const taskStatusMeta: Record<TaskStatus, { label: string; tone: Tone }> = {
  pending: { label: "Chờ làm", tone: "slate" },
  in_progress: { label: "Đang làm", tone: "ocean" },
  completed: { label: "Hoàn thành", tone: "teal" },
  cancelled: { label: "Đã hủy", tone: "rose" },
};
export const priorityMeta: Record<TaskPriority, { label: string; tone: Tone }> = {
  low: { label: "Thấp", tone: "slate" },
  normal: { label: "Bình thường", tone: "ocean" },
  high: { label: "Cao", tone: "amber" },
  urgent: { label: "Khẩn", tone: "rose" },
};
export const caseStatusMeta: Record<CaseStatus, { label: string; tone: Tone }> = {
  open: { label: "Mới mở", tone: "ocean" },
  waiting_for_info: { label: "Chờ thông tin", tone: "amber" },
  monitoring: { label: "Đang theo dõi", tone: "violet" },
  in_treatment: { label: "Đang điều trị", tone: "rose" },
  resolved: { label: "Đã xử lý", tone: "teal" },
};
export const opTypeMeta: Record<OperationType, { label: string; tone: Tone; icon: keyof typeof Icons }> = {
  feeding: { label: "Cho ăn", tone: "teal", icon: "ops" },
  medicine: { label: "Thuốc điều trị", tone: "rose", icon: "pills" },
  mineral: { label: "Khoáng", tone: "ocean", icon: "flask" },
  chemical: { label: "Hóa chất", tone: "violet", icon: "flask" },
  other: { label: "Khác", tone: "slate", icon: "ops" },
};
export const doseBasisLabel: Record<string, string> = {
  fixed_quantity: "Liều cố định",
  per_kg_biomass: "Theo kg sinh khối",
  percent_biomass: "Theo % sinh khối",
  per_m3_water: "Theo m³ nước",
};

/* ------------------------------------------------------------------ layout bits */
export function ContextBar({ farm, season, pond }: { farm: string; season: string; pond: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-ocean-50/80 px-3 py-2 text-[12px] font-medium text-ocean-700">
      <Icons.pin size={14} className="shrink-0 text-ocean-500" />
      <span className="truncate">{farm}</span>
      <span className="text-ocean-400">›</span>
      <span className="truncate">{season}</span>
      <span className="text-ocean-400">›</span>
      <span className="rounded-md bg-white px-1.5 py-0.5 font-semibold text-ocean-700">{pond}</span>
    </div>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-2.5 mt-1 flex items-end justify-between px-1">
      <h2 className="font-display text-[15px] font-bold tracking-tight text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: string; tone?: Tone }) {
  return (
    <div className="rounded-2xl border border-line-soft bg-white/70 p-3">
      <div className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">{label}</div>
      <div className={`mt-1 font-display text-[19px] font-bold tabnum leading-none ${tone ? toneText[tone] : "text-ink"}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: (p: IconProps) => React.JSX.Element; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-slate-50 text-slate-500">
        <Icon size={22} />
      </div>
      <p className="font-display text-[14px] font-semibold text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-[220px] text-[12px] text-ink-muted">{hint}</p>}
    </div>
  );
}

// Shared "action" gradient — used by every execution/primary button (login,
// "ghi nhận", "lưu", etc.) so committing an action always looks the same.
export const actionGradient = "linear-gradient(to right, #77A1D3 0%, #79CBCA 51%, #77A1D3 100%)";

export function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  full,
  tone = "ocean",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: (p: IconProps) => React.JSX.Element;
  full?: boolean;
  tone?: "ocean" | "rose" | "teal";
  type?: "button" | "submit";
}) {
  // rose stays a solid alert red (destructive / emergency); every other tone
  // uses the shared ocean→teal gradient with a subtle hover sweep.
  const rose = tone === "rose";
  return (
    <button
      type={type}
      onClick={onClick}
      style={rose ? undefined : { backgroundImage: actionGradient, backgroundSize: "200% auto" }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold text-white shadow-sm transition active:scale-[0.98] ${
        rose
          ? "bg-rose-500 hover:bg-[#b92f49]"
          : "[background-position:left_center] duration-500 hover:[background-position:right_center]"
      } ${full ? "w-full" : ""}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  icon: Icon,
  full,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: (p: IconProps) => React.JSX.Element;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[14px] font-semibold text-ink-soft transition hover:border-ocean-400 hover:text-ocean-600 active:scale-[0.98] ${full ? "w-full" : ""}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="scroll-clean flex gap-1 overflow-x-auto rounded-xl bg-slate-50 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition ${
            value === o.value ? "bg-white text-ocean-700 shadow-sm" : "text-ink-muted hover:text-ink-soft"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* Bottom sheet used for forms & detail overlays */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] animate-[fade_.2s_ease]" onClick={onClose} />
      <div className="relative max-h-[92%] overflow-hidden rounded-t-[26px] bg-white shadow-[0_-12px_40px_-16px_rgba(15,28,46,.45)]">
        <div className="flex items-center justify-between border-b border-line-soft px-5 pb-3 pt-4">
          <h3 className="font-display text-[16px] font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-full bg-slate-50 text-ink-muted">
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
        <div className="scroll-clean max-h-[64vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-line-soft px-5 py-3">{footer}</div>}
      </div>
      <style>{`@keyframes fade{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
  unit,
}: {
  label: string;
  children?: React.ReactNode;
  hint?: string;
  unit?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] font-semibold text-ink-soft">{label}</span>
        {unit && <span className="font-mono text-[11px] text-ink-muted">{unit}</span>}
      </div>
      {children}
      {hint && <p className="mt-1 text-[11px] text-ink-muted">{hint}</p>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 font-mono text-[14px] text-ink outline-none transition placeholder:font-sans placeholder:text-ink-muted focus:border-ocean-400 focus:ring-4 focus:ring-ocean-50";
