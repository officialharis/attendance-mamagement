const Loading = () => {
  return (
    <div className="absolute inset-0 bg-white/30 flex items-center justify-center z-50">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-primary rounded-full animate-pulse" />
        <span className="w-3 h-3 bg-primary/70 rounded-full animate-pulse delay-150" />
        <span className="w-3 h-3 bg-primary/50 rounded-full animate-pulse delay-300" />
        <p className="ml-4 text-black text-lg">Loading...</p>
      </div>
    </div>
  );
};
export default Loading;