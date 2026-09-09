import { useEffect, useRef, useState } from "react";
import { useNav } from "../app/store";
import { actionGradient, Field, Icons, inputClass, PrimaryButton } from "../app/ui";
import logo from "../imports/logo.png";

type Step = "login" | "activate" | "verify" | "complete";

// Demo-only correct code. In production this is verified server-side against
// email_verification_challenges (10-min expiry, failed_attempts ≤ 5).
const DEMO_OTP = "123456";
const RESEND_SECONDS = 60; // resend_available_at = NOW + 60s
const MAX_ATTEMPTS = 5; // challenge invalidated at failed_attempts = 5

export default function Auth() {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  // Shared resend gate so the 60s rate-limit persists across activate → verify.
  const [resendLeft, setResendLeft] = useState(0);

  useEffect(() => {
    if (resendLeft <= 0) return;
    const t = window.setInterval(() => setResendLeft((n) => (n <= 1 ? 0 : n - 1)), 1000);
    return () => window.clearInterval(t);
  }, [resendLeft]);

  const startChallenge = () => setResendLeft(RESEND_SECONDS);

  return (
    <div className="scroll-clean flex h-full flex-col overflow-y-auto px-6 py-8">
      <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col">
        {step === "login" && <LoginStep email={email} setEmail={setEmail} onActivate={() => setStep("activate")} />}
        {step === "activate" && (
          <ActivateStep
            email={email}
            setEmail={setEmail}
            resendLeft={resendLeft}
            onSend={() => { startChallenge(); setStep("verify"); }}
            onBack={() => setStep("login")}
          />
        )}
        {step === "verify" && (
          <VerifyStep
            email={email}
            resendLeft={resendLeft}
            onResend={startChallenge}
            onVerified={() => setStep("complete")}
            onBack={() => setStep("activate")}
          />
        )}
        {step === "complete" && (
          <CompleteStep email={email} onDone={() => { setStep("login"); }} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ shell */
function Brand({ tagline }: { tagline: string }) {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      <img src={logo} alt="SmartShrimp" className="h-24 w-auto object-contain" />
      <p className="mt-1 max-w-[260px] text-[12.5px] font-medium text-ink-soft">{tagline}</p>
    </div>
  );
}

function StepHeader({ title, desc, onBack }: { title: string; desc: string; onBack: () => void }) {
  return (
    <div className="mb-5">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 py-1.5 pl-2 pr-3 text-[12px] font-semibold text-ink-soft transition active:scale-95"
      >
        <Icons.back size={16} /> Quay lại
      </button>
      <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink">{title}</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{desc}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ login */
function LoginStep({
  email,
  setEmail,
  onActivate,
}: {
  email: string;
  setEmail: (v: string) => void;
  onActivate: () => void;
}) {
  const nav = useNav();
  return (
    <div className="flex flex-1 flex-col justify-center">
      <Brand tagline="Nền tảng vận hành & tư vấn kỹ thuật nuôi tôm thông minh" />

      <div className="card space-y-4 p-5">
        <div className="font-display text-[16px] font-bold text-ink">Đăng nhập</div>
        <Field label="Email">
          <input
            className={`${inputClass} font-sans`}
            placeholder="ban@trangtrai.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Mật khẩu">
          <input type="password" className={`${inputClass} font-sans`} placeholder="••••••••" defaultValue="password" />
        </Field>
        <PrimaryButton full icon={Icons.check} onClick={nav.login}>
          Đăng nhập
        </PrimaryButton>
        <div className="flex items-center justify-between pt-0.5">
          <button onClick={onActivate} className="text-[12.5px] font-bold text-ocean-600">
            Kích hoạt tài khoản
          </button>
          <button onClick={() => nav.toast("Đã gửi hướng dẫn đặt lại mật khẩu qua email.")} className="text-[12.5px] font-semibold text-ink-soft">
            Quên mật khẩu?
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-muted">
        Dành cho Kỹ thuật viên & Chủ trang trại.
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- activate */
function ActivateStep({
  email,
  setEmail,
  resendLeft,
  onSend,
  onBack,
}: {
  email: string;
  setEmail: (v: string) => void;
  resendLeft: number;
  onSend: () => void;
  onBack: () => void;
}) {
  const nav = useNav();
  const valid = /\S+@\S+\.\S+/.test(email);
  const blocked = resendLeft > 0;

  const submit = () => {
    if (!valid) return nav.toast("Vui lòng nhập email hợp lệ.");
    if (blocked) return nav.toast(`Vui lòng chờ ${resendLeft}s trước khi gửi lại mã.`);
    nav.toast("Đã gửi mã kích hoạt 6 số tới email của bạn.");
    onSend();
  };

  return (
    <div className="py-2">
      <StepHeader
        title="Kích hoạt tài khoản"
        desc="Nhập email đã được quản trị viên cấp. Chúng tôi sẽ gửi mã xác thực gồm 6 chữ số tới hộp thư của bạn."
        onBack={onBack}
      />
      <div className="card space-y-4 p-5">
        <Field label="Email tài khoản">
          <input
            className={`${inputClass} font-sans`}
            placeholder="ban@trangtrai.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </Field>
        <PrimaryButton full icon={Icons.send} onClick={submit}>
          {blocked ? `Gửi lại sau ${resendLeft}s` : "Gửi mã kích hoạt"}
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- verify */
function VerifyStep({
  email,
  resendLeft,
  onResend,
  onVerified,
  onBack,
}: {
  email: string;
  resendLeft: number;
  onResend: () => void;
  onVerified: () => void;
  onBack: () => void;
}) {
  const nav = useNav();
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: 6 }, () => String(Math.floor(Math.random() * 10)))
  );
  const [attempts, setAttempts] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const invalidated = attempts >= MAX_ATTEMPTS;
  const code = digits.join("");

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((arr) => {
      const next = [...arr];
      next[i] = d;
      return next;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const verify = () => {
    if (invalidated) return nav.toast("Mã đã bị vô hiệu hóa. Vui lòng gửi lại mã mới.");
    if (code.length < 6) return nav.toast("Vui lòng nhập đủ 6 chữ số.");
    nav.toast("Xác thực email thành công.");
    onVerified();
  };

  const resend = () => {
    if (resendLeft > 0) return;
    setAttempts(0);
    setDigits(["", "", "", "", "", ""]);
    onResend();
    refs.current[0]?.focus();
    nav.toast("Đã gửi mã xác thực mới tới email của bạn.");
  };

  return (
    <div className="py-2">
      <StepHeader
        title="Xác thực email"
        desc={`Nhập mã 6 chữ số vừa được gửi tới ${email || "email của bạn"}.`}
        onBack={onBack}
      />
      <div className="card space-y-4 p-5">
        <div className="flex justify-center gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              disabled={invalidated}
              className={`size-12 rounded-xl border text-center font-mono text-[20px] font-bold text-ink outline-none transition focus:border-ocean-400 focus:ring-4 focus:ring-ocean-50 ${
                invalidated ? "border-rose-500/40 bg-rose-50/50" : "border-line bg-white"
              }`}
            />
          ))}
        </div>

        {invalidated ? (
          <div className="rounded-xl bg-rose-50 px-3 py-2.5 text-[11.5px] font-semibold leading-snug text-rose-500">
            Mã đã bị vô hiệu hóa sau 5 lần nhập sai. Vui lòng gửi lại mã mới để tiếp tục.
          </div>
        ) : attempts > 0 ? (
          <div className="rounded-xl bg-amber-50 px-3 py-2 text-[11.5px] font-semibold text-amber-500">
            Còn {MAX_ATTEMPTS - attempts} lần thử · mã hiệu lực 10 phút.
          </div>
        ) : null}

        <PrimaryButton full icon={Icons.check} onClick={verify}>
          Xác nhận mã
        </PrimaryButton>
        <button
          onClick={resend}
          disabled={resendLeft > 0}
          className="w-full text-center text-[12.5px] font-semibold text-ocean-600 disabled:text-ink-muted"
        >
          {resendLeft > 0 ? `Gửi lại mã sau ${resendLeft}s` : "Không nhận được mã? Gửi lại"}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- complete */
function CompleteStep({ email, onDone }: { email: string; onDone: () => void }) {
  const nav = useNav();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const submit = () => {
    if (!name.trim()) return nav.toast("Vui lòng nhập họ tên.");
    if (pw.length < 6) return nav.toast("Mật khẩu cần tối thiểu 6 ký tự.");
    if (pw !== pw2) return nav.toast("Mật khẩu nhập lại không khớp.");
    nav.toast("Kích hoạt thành công! Vui lòng đăng nhập.");
    onDone();
  };

  return (
    <div className="py-2">
      <div className="mb-5">
        <div className="mb-3 inline-flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-500">
          <Icons.check size={22} />
        </div>
        <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink">Hoàn tất hồ sơ</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          Email <span className="font-semibold text-ink">{email || "của bạn"}</span> đã xác thực. Bổ sung thông tin và đặt mật khẩu để hoàn tất.
        </p>
      </div>

      <div className="card space-y-4 p-5">
        <Field label="Họ và tên">
          <input className={`${inputClass} font-sans`} placeholder="VD: Trần Quốc Bảo" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Số điện thoại">
          <input className={`${inputClass} font-sans`} inputMode="tel" placeholder="09xx xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label="Mật khẩu" hint="Tối thiểu 6 ký tự.">
          <input type="password" className={`${inputClass} font-sans`} placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
        </Field>
        <Field label="Nhập lại mật khẩu">
          <input type="password" className={`${inputClass} font-sans`} placeholder="••••••••" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </Field>
        <PrimaryButton full icon={Icons.check} onClick={submit}>
          Hoàn tất & kích hoạt
        </PrimaryButton>
      </div>
    </div>
  );
}
