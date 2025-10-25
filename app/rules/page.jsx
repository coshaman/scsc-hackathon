export default function RulesPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="font-semibold hover:opacity-90">← 홈으로</a>
          <div className="flex items-center gap-3">
            <a href="/rules.pdf" download className="rounded-xl px-4 py-2 bg-white text-black text-sm font-semibold hover:opacity-90">
              PDF 다운로드
            </a>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold">대회 규정</h1>
        <p className="text-white/70 mt-2">아래 뷰어로 전체 규정을 확인할 수 있습니다.</p>

        <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-black">
          {/* 브라우저 기본 PDF 뷰어 */}
          <object data="/rules.pdf" type="application/pdf" width="100%" height="900">
            <p className="p-6 text-white/80">
              PDF 미리보기를 표시할 수 없습니다.{" "}
              <a className="underline" href="/rules.pdf" target="_blank" rel="noopener noreferrer">
                새 창에서 열기
              </a>{" "}
              또는{" "}
              <a className="underline" href="/rules.pdf" download>
                다운로드
              </a>
              를 이용하세요.
            </p>
          </object>
        </div>
      </section>
    </main>
  );
}
