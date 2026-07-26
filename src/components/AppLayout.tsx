import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (<>
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 text-ink sm:py-8">
      {/* Mobile-first: fills the screen on phones, centered phone frame on desktop */}
      <main className="flex min-h-dvh w-full flex-col bg-white sm:min-h-195 sm:w-100 sm:overflow-hidden sm:rounded-[2.25rem] sm:shadow-phone">
        <Outlet />
      </main>
    </div>
    </>
  );
};
