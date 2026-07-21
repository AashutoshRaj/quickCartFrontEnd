import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ShoppingCart } from 'lucide-react';

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <section className="grid min-h-[720px] w-full max-w-[1720px] overflow-hidden rounded-xl bg-white shadow-[0_28px_70px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_1fr]">
      <aside className="relative hidden bg-[#243242] px-16 py-16 text-white lg:flex lg:flex-col">
        <Link to="/auth/signup" className="flex items-center gap-4 text-[#37ff84]">
          <ShoppingCart className="h-11 w-11" strokeWidth={2.8} />
          <span className="text-3xl" style={{ fontWeight: 800 }}>QuickCart</span>
        </Link>

        <div className="mt-24 max-w-[660px]">
          <h2 className="text-[50px] leading-[1.22] tracking-normal text-white xl:text-[58px]" style={{ fontWeight: 900 }}>
            Scale your retail empire with precision.
          </h2>
          <p className="mt-10 max-w-[620px] text-2xl leading-10 text-slate-300">
            Experience the gold standard in self-checkout administration and real-time inventory management.
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex max-w-[720px] items-center gap-6 rounded-lg border border-white/14 bg-white/[0.06] px-7 py-6">
            <div className="flex -space-x-2">
              {['SA', 'JM', 'QC'].map((avatar, index) => (
                <div
                  key={avatar}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#243242] text-xs text-white ${
                    index === 0 ? 'bg-sky-600' : index === 1 ? 'bg-slate-100 text-slate-800' : 'bg-emerald-600'
                  }`}
                  style={{ fontWeight: 800 }}
                >
                  {avatar}
                </div>
              ))}
            </div>
            <p className="text-base tracking-[0.08em] text-[#37ff84]" style={{ fontWeight: 800 }}>
              Joining 150+ active retail partners worldwide
            </p>
          </div>

          <div className="mt-12 flex items-center gap-5 text-xl text-slate-300">
            <ShieldCheck className="h-8 w-8 text-[#37ff84]" />
            <span>Secure Enterprise Access Protocol Active</span>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-7 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="w-full max-w-[670px]">
          <div>
            <div className="mb-10 flex items-center gap-3 text-[#05d456] lg:hidden">
              <ShoppingCart className="h-9 w-9" strokeWidth={2.8} />
              <span className="text-2xl" style={{ fontWeight: 800 }}>QuickCart</span>
            </div>
            <h1 className="text-[34px] leading-tight text-[#0b1220] sm:text-[44px]" style={{ fontWeight: 900 }}>
              {title}
            </h1>
            <p className="mt-5 text-xl leading-8 text-slate-600">{subtitle}</p>
          </div>

          {children}

          <div className="mt-8 border-t border-slate-200 pt-8">
            <div className="flex flex-wrap items-center justify-center gap-12 text-sm uppercase text-slate-600">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                PCI DSS Compliant
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                SSL Secured
              </span>
            </div>
            <p className="mt-7 text-center text-sm uppercase tracking-[0.22em] text-slate-500">
              © 2024 QuickCart Fintech Solutions Inc.
            </p>
          </div>
        </div>
      </main>
    </section>
  );
}
