import { NavProvider, useNav, type TabKey } from "./app/store";
import { Icons } from "./app/ui";
import { notifications } from "./app/data";
import Auth from "./screens/Auth";
import Home from "./screens/Home";
import { SeasonsList } from "./screens/Seasons";
import PondHub, { WaterScreen, HealthScreen, OpsScreen, CasesScreen } from "./screens/Pond";
import OperationDetail from "./screens/Operation";
import { CaseDetail, CaseNew } from "./screens/Cases";
import { AIDiagnosis, Chat } from "./screens/AI";
import { TasksList, TaskDetail } from "./screens/Tasks";
import { NotificationsList } from "./screens/Notifications";
import { Account } from "./screens/Account";

const tabs: { key: TabKey; label: string; icon: keyof typeof Icons }[] = [
  { key: "home", label: "Trang chủ", icon: "home" },
  { key: "seasons", label: "Vụ nuôi", icon: "layers" },
  { key: "tasks", label: "Nhiệm vụ", icon: "checkList" },
  { key: "notifications", label: "Thông báo", icon: "bell" },
  { key: "account", label: "Tài khoản", icon: "user" },
];

function TabRoot({ tab }: { tab: TabKey }) {
  switch (tab) {
    case "home":
      return <Home />;
    case "seasons":
      return <SeasonsList />;
    case "tasks":
      return <TasksList />;
    case "notifications":
      return <NotificationsList />;
    case "account":
      return <Account />;
  }
}

function StackRoute({ name, params }: { name: string; params?: Record<string, string> }) {
  const p = params ?? {};
  switch (name) {
    case "pond":
      return <PondHub seasonId={p.seasonId} />;
    case "water":
      return <WaterScreen seasonId={p.seasonId} />;
    case "health":
      return <HealthScreen seasonId={p.seasonId} />;
    case "ops":
      return <OpsScreen seasonId={p.seasonId} />;
    case "cases":
      return <CasesScreen seasonId={p.seasonId} />;
    case "op":
      return <OperationDetail id={p.id} />;
    case "case":
      return <CaseDetail id={p.id} />;
    case "case-new":
      return <CaseNew seasonId={p.seasonId} />;
    case "ai":
      return <AIDiagnosis seasonId={p.seasonId} />;
    case "chat":
      return <Chat seasonId={p.seasonId} />;
    case "task":
      return <TaskDetail id={p.id} />;
    default:
      return null;
  }
}

function Shell() {
  const nav = useNav();
  const top = nav.stack[nav.stack.length - 1];
  // full-height screens manage their own scroll; tab roots scroll in the body
  const fullHeightRoute = top && ["case", "chat"].includes(top.name);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* content */}
      <div className={`min-h-0 flex-1 ${fullHeightRoute ? "overflow-hidden" : "overflow-y-auto scroll-clean"}`}>
        {top ? <StackRoute key={nav.stack.length} name={top.name} params={top.params} /> : <TabRoot tab={nav.tab} />}
      </div>

      {/* bottom nav — hidden on full-screen conversational routes */}
      {!fullHeightRoute && (
        <nav className="grid shrink-0 grid-cols-5 border-t border-line/70 bg-white/90 px-1 pb-1 pt-1.5 backdrop-blur-lg">
          {tabs.map((t) => {
            const Icon = Icons[t.icon];
            const active = nav.tab === t.key && nav.stack.length === 0;
            return (
              <button
                key={t.key}
                onClick={() => nav.setTab(t.key)}
                className={`relative flex flex-col items-center gap-1 rounded-xl py-1.5 transition ${active ? "text-ocean-600" : "text-ink-muted"}`}
              >
                <span className="relative">
                  <Icon size={22} />
                  {t.key === "notifications" && unread > 0 && (
                    <span className="absolute -right-1.5 -top-1 grid size-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-semibold">{t.label}</span>
                {active && <span className="absolute -top-[7px] h-1 w-8 rounded-full bg-ocean-500" />}
              </button>
            );
          })}
        </nav>
      )}

      {/* toast */}
      {nav.toastMsg && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center px-6">
          <div className="animate-[toast_.25s_ease] rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-white shadow-xl">
            {nav.toastMsg}
          </div>
        </div>
      )}
      <style>{`@keyframes toast{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

function Gate() {
  const nav = useNav();
  return nav.loggedIn ? <Shell /> : <Auth />;
}

export default function App() {
  return (
    <NavProvider>
      <div className="flex h-full w-full items-center justify-center p-0 sm:p-6">
        {/* phone frame on larger screens, full-bleed on mobile */}
        <div className="relative h-full w-full overflow-hidden bg-white/40 sm:h-[956px] sm:max-h-full sm:w-[440px] sm:rounded-[55px] sm:border-[14px] sm:border-ink/90 sm:shadow-[0_40px_120px_-30px_rgba(15,28,46,.6)]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,#a9caff 0%,#b8cbff 16.667%,#d3cbff 33.333%,#f0c8f9 50%,#ffc5f1 66.667%,#ffc0ec 83.333%,#ffbaec 100%)",
            }}
          />
          <div className="relative h-full">
            <Gate />
          </div>
        </div>
      </div>
    </NavProvider>
  );
}
