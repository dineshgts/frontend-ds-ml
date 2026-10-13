export default function DashboardPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-indigo-600">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Dashboard route is working.
        </p>

        <p className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">
          /dashboard
        </p>
      </div>
    </div>
  );
}