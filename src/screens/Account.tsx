import { useNav } from "../app/store";
import { currentUser } from "../app/data";
import { actionGradient, GhostButton, Icons, Stat } from "../app/ui";
import { TopBar } from "./common";

export function Account() {
  const nav = useNav();
  const initials = currentUser.name.split(" ").slice(-1)[0][0];
  const joined = new Date(currentUser.memberSince + "-01").toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const rows: { icon: keyof typeof Icons; label: string; value?: string }[] = [
    { icon: "bell", label: "Email", value: currentUser.email },
    { icon: "pin", label: "Số điện thoại", value: currentUser.phone },
    { icon: "layers", label: "Trực thuộc", value: currentUser.ownerName },
    { icon: "clock", label: "Tham gia từ", value: joined },
  ];

  return (
    <div className="pb-6">
      <TopBar title="Tài khoản" />
      <div className="px-4">
        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-3xl p-5 text-white shadow-[0_20px_50px_-24px_rgba(15,28,46,.6)]"
          style={{ backgroundImage: actionGradient, backgroundSize: "160% auto" }}
        >
          <div className="absolute -right-8 -top-10 size-40 rounded-full bg-white/15" />
          <div className="absolute -bottom-12 -left-6 size-32 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/25 font-display text-[24px] font-extrabold text-white backdrop-blur-sm ring-1 ring-white/40">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-display text-[19px] font-extrabold leading-tight">{currentUser.name}</div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-sm">
                  <Icons.shield size={12} /> {currentUser.role}
                </span>
                <span className="truncate rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                  {currentUser.ownerName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat label="Vụ tham gia" value={currentUser.seasonsParticipated} />
          <Stat label="Việc hoàn thành" value={currentUser.completedTasks} tone="teal" />
          <Stat label="Đúng hạn" value={`${currentUser.onTimeRatePct}%`} tone="ocean" />
        </div>

        {/* Info */}
        <div className="mt-4 mb-2 px-1 font-display text-[14px] font-bold text-ink">Thông tin tài khoản</div>
        <div className="card divide-y divide-line-soft">
          {rows.map((r) => {
            const Icon = Icons[r.icon];
            return (
              <div key={r.label} className="flex items-center gap-3 px-4 py-3">
                <span className="grid size-9 place-items-center rounded-xl bg-ocean-50 text-ocean-600"><Icon size={16} /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-ink-muted">{r.label}</div>
                  <div className="truncate text-[13px] font-semibold text-ink">{r.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-2">
          <GhostButton full icon={Icons.user} onClick={() => nav.toast("Mở cập nhật hồ sơ cá nhân.")}>Cập nhật hồ sơ</GhostButton>
          <GhostButton full icon={Icons.shield} onClick={() => nav.toast("Mở đổi mật khẩu.")}>Đổi mật khẩu</GhostButton>
          <button onClick={nav.logout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-50/50 px-4 py-3 text-[14px] font-semibold text-rose-500 transition active:scale-[0.98]">
            <Icons.logout size={18} /> Đăng xuất
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] text-ink-muted">SmartShrimp · v1.0</p>
      </div>
    </div>
  );
}
