export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full space-y-2">
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-primary via-accent to-secondary transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}