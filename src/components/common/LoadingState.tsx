interface LoadingStateProps {
  label?: string;
  rows?: number;
}

export default function LoadingState({
  label = "Loading...",
  rows = 3,
}: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="space-y-4 p-5">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-lg bg-slate-100"
        />
      ))}
    </div>
  );
}
