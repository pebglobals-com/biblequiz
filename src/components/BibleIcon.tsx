export default function BibleIcon({ className }: { className?: string }) {
  return (
    <img
      src="/images/open-bible-ribbon.jpg"
      alt="Open Bible"
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}
