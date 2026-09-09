import { useState } from "react";
import { useNav } from "../app/store";
import { notifications, type Notification } from "../app/data";
import { Badge, fmtDateTime, Icons, type Tone } from "../app/ui";
import { TopBar } from "./common";

const catMeta: Record<Notification["category"], { label: string; tone: Tone; icon: keyof typeof Icons }> = {
  warning: { label: "Cảnh báo sớm", tone: "amber", icon: "warn" },
  operation: { label: "Vận hành", tone: "teal", icon: "ops" },
  case: { label: "Ca bệnh", tone: "rose", icon: "warn" },
  task: { label: "Nhiệm vụ", tone: "ocean", icon: "checkList" },
  protocol: { label: "Phác đồ", tone: "violet", icon: "shield" },
  season: { label: "Vụ nuôi", tone: "slate", icon: "layers" },
  inventory: { label: "Kho vật tư", tone: "slate", icon: "layers" },
};

export function NotificationsList() {
  const nav = useNav();
  const [read, setRead] = useState<Set<string>>(new Set(notifications.filter((n) => n.read).map((n) => n.id)));
  const [filter, setFilter] = useState<"all" | "warning">("all");
  const list = notifications.filter((n) => (filter === "warning" ? n.category === "warning" : true));
  const unread = notifications.filter((n) => !read.has(n.id)).length;

  const open = (n: Notification) => {
    setRead((s) => new Set(s).add(n.id));
    if (!n.action) return;
    if (n.action.nav.startsWith("pond:")) nav.go("pond", { seasonId: n.action.nav.slice(5) });
    else if (n.action.nav.startsWith("case:")) nav.go("case", { id: n.action.nav.slice(5) });
    else if (n.action.nav === "tasks") nav.setTab("tasks");
  };

  return (
    <div className="pb-6">
      <TopBar
        title="Thông báo"
        subtitle={unread > 0 ? `${unread} thông báo chưa đọc` : "Bạn đã đọc hết"}
        right={
          <button onClick={() => setRead(new Set(notifications.map((n) => n.id)))} className="rounded-full bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-ocean-600">
            Đọc tất cả
          </button>
        }
      />
      <div className="flex gap-2 px-4 pb-3">
        {(["all", "warning"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${filter === f ? "bg-ocean-600 text-white shadow-sm" : "bg-white/70 text-ink-soft"}`}>
            {f === "all" ? "Tất cả" : "Cảnh báo sớm"}
          </button>
        ))}
      </div>
      <div className="space-y-2.5 px-4">
        {list.map((n) => {
          const cm = catMeta[n.category];
          const Icon = Icons[cm.icon];
          const isRead = read.has(n.id);
          return (
            <button
              key={n.id}
              onClick={() => open(n)}
              className={`card w-full p-3.5 text-left transition active:scale-[0.99] ${n.category === "warning" && !isRead ? "border-amber-500/40 bg-amber-50/50" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${cm.tone === "amber" ? "bg-amber-50 text-amber-500" : cm.tone === "teal" ? "bg-teal-50 text-teal-500" : cm.tone === "rose" ? "bg-rose-50 text-rose-500" : cm.tone === "violet" ? "bg-violet-50 text-violet-500" : cm.tone === "ocean" ? "bg-ocean-50 text-ocean-600" : "bg-slate-50 text-slate-500"}`}>
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={cm.tone}>{cm.label}</Badge>
                    {!isRead && <span className="size-2 rounded-full bg-ocean-500" />}
                  </div>
                  <div className={`mt-1 text-[13px] leading-snug ${isRead ? "font-semibold text-ink-soft" : "font-bold text-ink"}`}>{n.title}</div>
                  <p className="mt-0.5 line-clamp-2 text-[12px] text-ink-soft">{n.content}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-ink-muted">{fmtDateTime(n.createdAt)}</span>
                    {n.action && <span className="flex items-center gap-0.5 text-[11px] font-bold text-ocean-600">{n.action.label} <Icons.chevronR size={12} /></span>}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
