interface FormErrorProps {
  error: string | null | undefined;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400"
    >
      {error}
    </div>
  );
}
