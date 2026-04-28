export default function IssueLoading() {
  return (
    <main className="max-w-[480px] mx-auto min-h-screen pb-8">
      {/* 뒤로가기 */}
      <div className="sticky top-14 z-40 bg-white border-b border-[#F2F4F6] px-5 h-12 flex items-center">
        <div className="w-10 h-4 bg-[#E5E8EB] rounded animate-pulse" />
      </div>

      {/* 헤더 */}
      <section className="bg-white px-5 pt-5 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-14 h-5 bg-[#E5E8EB] rounded-[6px] animate-pulse" />
          <div className="w-24 h-4 bg-[#E5E8EB] rounded animate-pulse" />
        </div>
        <div className="w-full h-6 bg-[#E5E8EB] rounded animate-pulse mb-2" />
        <div className="w-4/5 h-6 bg-[#E5E8EB] rounded animate-pulse" />
      </section>

      {/* 요약 */}
      <section className="bg-white mt-2 px-5 pt-5 pb-5">
        <div className="w-28 h-4 bg-[#E5E8EB] rounded animate-pulse mb-3" />
        <div className="bg-[#E0F8FA] border-[1.5px] border-[#A8E6EC] rounded-[10px] p-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-2.5">
              <div className="w-3 h-3 bg-[#A8E6EC] rounded-full animate-pulse shrink-0 mt-1" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-[#A8E6EC] rounded animate-pulse" />
                {i === 1 && <div className="h-3.5 w-4/5 bg-[#A8E6EC] rounded animate-pulse" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 영향도 */}
      <section className="bg-white mt-2 px-5 pt-5 pb-5">
        <div className="w-32 h-4 bg-[#E5E8EB] rounded animate-pulse mb-3" />
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3 bg-[#F2F4F6] rounded-[10px] p-3">
              <div className="w-6 h-6 bg-[#E5E8EB] rounded-full animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-4 bg-[#E5E8EB] rounded animate-pulse" />
                  <div className="w-12 h-4 bg-[#E5E8EB] rounded-[6px] animate-pulse" />
                </div>
                <div className="h-3.5 bg-[#E5E8EB] rounded animate-pulse" />
                <div className="h-3.5 w-3/4 bg-[#E5E8EB] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
