export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-pink-500/20 border-b-pink-500 animate-spin [animation-direction:reverse]"></div>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400 animate-pulse tracking-wide">
        Đang tải dữ liệu Class Deadline Hub...
      </p>
    </div>
  );
}
