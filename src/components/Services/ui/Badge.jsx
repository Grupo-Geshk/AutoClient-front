export default function Badge({ tone = "slate", children }) {
  const map = {
    slate: "bg-gray-200 text-gray-800 ring-gray-300",
    violet: "bg-violet-200 text-violet-900 ring-violet-300",
    green: "bg-green-100 text-green-800 ring-green-200",
    yellow: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ${map[tone]}`}>
      {children}
    </span>
  );
}
