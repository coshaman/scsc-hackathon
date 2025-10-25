"use client";

import React, { useMemo, useState, useEffect } from "react";

export default function HackathonLanding() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(null);
  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const schedule = useMemo(
    () => [
      { date: "2025.10.25 – 11.15", title: "참가자 모집", desc: "1~5인의 팀을 구성하고 기획안을 제출해주세요.", id: "recruit" },
      { date: "2025.11.16", title: "예선 합격팀 발표", desc: "기획서 기반으로 심사를 진행해 합격팀을 발표합니다.", id: "prelim" },
      { date: "2025.11.10 – 12.07", title: "본선", desc: "자유롭게 각자 개발을 진행해주세요.", id: "final" },
      { date: "2025.12.14 23:59", title: "제출 마감", desc: "시연 영상, ppt, 코드, 산출물을 제출해주세요.", id: "deadline" },
      { date: "2025.12.15 – 12.17", title: "심사 진행", desc: "SCSC 내부 심사위원들이 평가를 진행합니다. 평가기준을 참고해주세요.", id: "review" },
      { date: "2025.12.18", title: "최종 결과 발표", desc: "모든 팀에 결과를 안내할 예정입니다.", id: "announce" },
      { date: "~ 2025.12.25", title: "상금 및 부상 전달", desc: "상금과 부상을 전달합니다. 별개의 시상식은 없지만, 상황에 따라 진행이 가능합니다.", id: "prize" },
      { date: "2026.01", title: "캠퍼스 투어(예선 통과팀)", desc: "예선 통과팀은 모두 1~2월 중 일정을 잡아 캠퍼스투어를 받을 수 있습니다.", id: "tour" },
    ],
    []
  );

  const criteria = [
    { name: "창의성", score: 30, detail: "목표의 중요성, 기존 프로젝트와의 차별성" },
    { name: "완성도", score: 30, detail: "기술적 완성도와 완결성" },
    { name: "기술성", score: 20, detail: "난이도, 구현 깊이" },
    { name: "발전성", score: 20, detail: "의의, 개선 방향" },
  ];
  const prelimCriteria = [
    { name: "창의성", detail: "아이디어의 참신함/차별성" },
    { name: "실현 가능성", detail: "구체성, 참가자 스택의 적합성" },
  ];

  function parseKDateRange(s) {
    const str = s.replace(/\s+/g, " ").trim();
    if (/^~\s*\d{4}\.\d{2}\.\d{2}$/.test(str)) {
      const end = toDate(str.replace(/^~\s*/, ""));
      return { start: null, end };
    }
    if (/^\d{4}\.\d{2}$/.test(str)) {
      const [y, m] = str.split(".").map(Number);
      const start = new Date(y, m - 1, 1, 0, 0, 0);
      const end = new Date(y, m, 0, 23, 59, 59);
      return { start, end };
    }
    if (!str.includes("–")) {
      return { start: toDate(str), end: toDate(str, true) };
    }
    const [left, right] = str.split("–").map((t) => t.trim());
    const leftDate = toDate(left);
    let rightDate = null;
    if (/^\d{2}\.\d{2}(\s+\d{2}:\d{2})?$/.test(right)) {
      const [m, d] = right.split(" ")[0].split(".").map(Number);
      const time = (right.split(" ")[1] || "23:59").split(":").map(Number);
      rightDate = new Date(leftDate.getFullYear(), m - 1, d, time[0], time[1] || 0, 0);
    } else {
      rightDate = toDate(right, true);
    }
    return { start: leftDate, end: rightDate };
  }

  function toDate(token, endOfDay = false) {
    const t = token.trim();
    if (/^\d{4}\.\d{2}\.\d{2}\s+\d{2}:\d{2}$/.test(t)) {
      const [datePart, hm] = t.split(" ");
      const [y, m, d] = datePart.split(".").map(Number);
      const [H, M] = hm.split(":").map(Number);
      return new Date(y, m - 1, d, H, M, 0);
    }
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(t)) {
      const [y, m, d] = t.split(".").map(Number);
      return new Date(y, m - 1, d, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0);
    }
    if (/^\d{4}\.\d{2}$/.test(t)) {
      const [y, m] = t.split(".").map(Number);
      return new Date(
        y,
        m - 1,
        endOfDay ? new Date(y, m, 0).getDate() : 1,
        endOfDay ? 23 : 0,
        endOfDay ? 59 : 0,
        endOfDay ? 59 : 0
      );
    }
    return new Date();
  }

  const timedSchedule = useMemo(() => {
    return schedule.map((s) => {
      const { start, end } = parseKDateRange(s.date);
      return { ...s, start, end };
    });
  }, [schedule]);

  const { active, target } = useMemo(() => {
    if (!now) return { active: null, target: null };
    const n = now.getTime();
    const activeItem =
      timedSchedule.find((s) => s.start && s.end && s.start.getTime() <= n && n <= s.end.getTime()) || null;
    let targetDate = null;
    if (activeItem?.end) {
      targetDate = activeItem.end;
    } else {
      const futureStarts = timedSchedule
        .filter((s) => s.start && s.start.getTime() > n)
        .sort((a, b) => a.start.getTime() - b.start.getTime());
      targetDate = futureStarts[0]?.start || null;
    }
    return { active: activeItem, target: targetDate };
  }, [timedSchedule, now]);

  function diffDHMS(to) {
    if (!to || !now) return null;
    const diff = Math.max(0, Math.floor((to.getTime() - now.getTime()) / 1000));
    const dd = Math.floor(diff / (3600 * 24));
    const hh = Math.floor((diff % (3600 * 24)) / 3600);
    const mm = Math.floor((diff % 3600) / 60);
    const ss = diff % 60;
    return { dd, hh, mm, ss };
  }
  const remain = diffDHMS(target);

  return (
    <main
      className={`min-h-screen text-zinc-100 transition-all duration-[1600ms] ease-out ${
        mounted ? "opacity-100" : "opacity-0 translate-y-1"
      }`}
      style={{
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,.25), transparent)," +
          "radial-gradient(900px 500px at 95% 0%, rgba(16,185,129,.18), transparent)," +
          "radial-gradient(700px 400px at 50% 110%, rgba(56,189,248,.14), transparent)," +
          "linear-gradient(180deg, #0B1020 0%, #0D1228 50%, #0A1022 100%)",
      }}
    >
      <style jsx global>{`
        html { scroll-behavior: smooth; user-select: none; }
        section { scroll-margin-top: 90px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .reveal { animation: fadeUp .9s ease-out both; }
        .count-seg { min-width: 4.2rem; }
        .timeline { --tl-pad: 1.5rem; position: relative; border-left: 1px solid rgba(255,255,255,0.15); padding-left: var(--tl-pad); }
        .timeline-item { position: relative; margin-bottom: 2.5rem; }
        .timeline-dot { position: absolute; left: calc(var(--tl-pad) * -1 - 0.45rem); top: 0.6rem; width: 0.9rem; height: 0.9rem; border-radius: 9999px; box-shadow: 0 0 0 2px rgba(255,255,255,0.08); }
      `}</style>

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="SCSC" className="h-8 w-auto object-contain group-hover:scale-[1.02] transition" />
            <div className="leading-tight">
              <div className="font-bold">제1회 SCSC 온라인 해커톤</div>
              <div className="text-xs text-zinc-300/80">2025.10 – 12 | 온라인</div>
            </div>
          </a>
          <nav className="hidden md:flex gap-6 text-sm">
            {[
              ["일정", "#schedule"],
              ["운영 요강", "#guides"],
              ["수상", "#awards"],
              ["제출 양식 / 심사 기준", "#format"],
              ["규정", "/rules"],
              ["제출", "#submit"],
            ].map(([t, href]) => (
              <a key={t} href={href} className="hover:text-white/90 text-white/70">{t}</a>
            ))}
          </nav>
          <a href="#submit" className="rounded-xl px-4 py-2 bg-white text-black text-sm font-semibold hover:opacity-90">참가 신청</a>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 min-h-[calc(100svh-76px)] flex items-center py-16 md:py-20">
          <div className="w-full">
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight reveal">
              전국 고등학생 대상
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                서울대학교 SCSC 온라인 해커톤
              </span>
            </h1>

            <div className="mt-8 grid gap-4 md:grid-cols-2 reveal">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-white/70">지금 진행중</div>
                <div className="mt-1 text-xl font-semibold">
                  {active ? active.title : "대기 중"}
                </div>
                <div className="text-white/80">
                  {active ? active.desc : "예정된 다음 일정을 확인해 주세요."}
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/10 to-transparent p-5">
                <div className="flex items-baseline justify-between">
                  <div className="text-sm text-white/70">{active ? "진행 마감까지" : "다음 일정 시작까지"}</div>
                  <div className="text-xs text-white/60">
                    {mounted && target ? target.toLocaleString() : ""}
                  </div>
                </div>
                <div className="mt-3 flex gap-2 font-mono">
                  {mounted && remain ? (
                    <>
                      <TimeSeg label="일" value={remain.dd} />
                      <Colon />
                      <TimeSeg label="시" value={remain.hh} />
                      <Colon />
                      <TimeSeg label="분" value={remain.mm} />
                      <Colon />
                      <TimeSeg label="초" value={remain.ss} />
                    </>
                  ) : (
                    <div className="text-white/70">D-DAY 계산 중</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 reveal">
              <a href="#submit" className="rounded-xl px-5 py-3 bg-white text-black font-semibold hover:opacity-90">제출하러 가기</a>
              <a href="#guides" className="rounded-xl px-5 py-3 bg-white/10 border border-white/15 hover:border-white/25">운영 요강 보기</a>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="mx-auto max-w-6xl px-4 py-16 md:py-24 reveal">
        <h2 className="text-2xl md:text-3xl font-bold">일정</h2>
        <ol className="timeline mt-8">
          {timedSchedule.map((s) => {
            const isActive =
              now && s.start && s.end && s.start.getTime() <= now.getTime() && now.getTime() <= s.end.getTime();
            return (
              <li key={s.id} className="timeline-item">
                <span className={`timeline-dot ${isActive ? "bg-emerald-300" : "bg-white/90"}`} />
                <div className="flex items-center gap-2">
                  <div className="text-sm text-white/70">{s.date}</div>
                  {isActive && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-400/15 text-emerald-200 border border-emerald-300/30">
                      진행중
                    </span>
                  )}
                </div>
                <div className={`mt-1 text-lg font-semibold ${isActive ? "text-emerald-200" : ""}`}>{s.title}</div>
                <div className="text-white/80">{s.desc}</div>
                {isActive && <div className="absolute inset-0 -z-10 rounded-xl" />}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-sm text-white/60">* 일정은 운영상 사정에 따라 변동될 수 있습니다.</p>
      </section>

      <section id="guides" className="mx-auto max-w-6xl px-4 py-16 md:py-24 reveal">
        <h2 className="text-2xl md:text-3xl font-bold">운영 요강</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-xl">대상</h3>
            <p className="mt-2 text-white/80">AI 등 IT 기술에 관심이 많은 고등학생. 대학 프로그래밍 동아리에 관심 있는 학생.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-xl">참가 형태</h3>
            <p className="mt-2 text-white/80">1–5인 팀. 온라인 진행. 예선(기획서) – 본선(개발) – 심사 – 시상.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-xl">예선</h3>
            <ul className="mt-2 list-disc list-inside text-white/80 space-y-1">
              <li>pdf 기획서 심사, 최대 30팀 선발</li>
              <li>평가: 창의성 · 실현 가능성(규정 참고)</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-xl">본선</h3>
            <ul className="mt-2 list-disc list-inside text-white/80 space-y-1">
              <li>자율 개발(웹/앱/하드웨어 등 제한 없음)</li>
              <li>시연 영상, 10장 내외 소개용 PPT, GitHub 또는 ZIP, 산출물 제출</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/rules"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-black font-semibold hover:opacity-90"
          >
            규정 확인
          </a>
        </div>
      </section>

      <section id="awards" className="mx-auto max-w-6xl px-4 py-16 md:py-24 reveal">
        <h2 className="text-2xl md:text-3xl font-bold">수상</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-amber-300/15 to-transparent p-6">
            <div className="text-amber-300 font-bold">1위</div>
            <div className="mt-1 text-xl font-semibold leading-snug">
              상금 100,000원<br/>서울대학교 기계공학부 학부장상
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-200/15 to-transparent p-6">
            <div className="text-slate-200 font-bold">2위</div>
            <div className="mt-1 text-xl font-semibold leading-snug">
              상금 50,000원<br/>서울대학교 기계공학부 학부장상
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-amber-100/10 to-transparent p-6">
            <div className="text-amber-100 font-bold">3위</div>
            <div className="mt-1 text-xl font-semibold leading-snug">
              서울대학교 기계공학부 학부장상
            </div>
          </div>
          <div className="rounded-2xl border border-cyan-300/30 bg-gradient-to-b from-cyan-300/15 to-transparent p-6 md:col-span-3">
            <div className="text-cyan-200 font-bold">모든 예선 참가자 혜택</div>
            <div className="mt-1 text-xl font-semibold">1–2월 중 캠퍼스 투어 진행</div>
            <p className="mt-2 text-sm text-white/80">예선 참가자 전원 대상(일정은 개별 결정)</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-white/60">* 상금/부상 내역은 내부 사정에 따라 일부 조정될 수 있습니다.</p>
      </section>

      <section id="format" className="mx-auto max-w-6xl px-4 py-16 md:py-24 reveal">
        <h2 className="text-2xl md:text-3xl font-bold">제출 양식 / 심사 기준</h2>
        <div className="mt-6 grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-xl">예선 제출(기획서)</h3>
            <ul className="mt-3 list-disc list-inside text-white/80 space-y-1">
              <li>형식: PDF(자유 양식, 5–10쪽 권장)</li>
              <li>포함: 문제 정의, 핵심 아이디어, 타겟 사용자, 구현 계획(기술 스택 포함), 기대 효과</li>
            </ul>
            <h4 className="mt-5 font-medium">예선 심사 기준</h4>
            <ul className="mt-2 list-disc list-inside text-white/80 space-y-1">
              {prelimCriteria.map((c) => (
                <li key={c.name}><span className="font-semibold">{c.name}</span> – {c.detail}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-xl">본선 제출(산출물)</h3>
            <ul className="mt-3 list-disc list-inside text-white/80 space-y-1">
              <li>시연 영상(링크), 소개용 PPT(약 10장), 결과물(GitHub 또는 ZIP), 배포 링크·구조도 등</li>
              <li>하드웨어의 경우 회로/구조/동작 영상 등 심사가 가능한 자료 첨부</li>
            </ul>
            <h4 className="mt-5 font-medium">본선 심사 기준</h4>
            <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-white/80">
                  <tr>
                    <th className="px-4 py-2">항목</th>
                    <th className="px-4 py-2">배점</th>
                    <th className="px-4 py-2">세부</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((c, i) => (
                    <tr key={c.name} className={i % 2 ? "bg-white/0" : "bg-white/5"}>
                      <td className="px-4 py-2 font-medium">{c.name}</td>
                      <td className="px-4 py-2">{c.score}</td>
                      <td className="px-4 py-2 text-white/80">{c.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/rules"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-black font-semibold hover:opacity-90"
          >
            규정 확인
          </a>
        </div>

        <p className="mt-4 text-sm text-white/60">* 심사 기준 및 제출물 예시는 운영 상황에 따라 보완될 수 있습니다.</p>
      </section>

      <section id="submit" className="mx-auto max-w-6xl px-4 py-16 md:py-24 reveal">
        <h2 className="text-2xl md:text-3xl font-bold">제출</h2>
        <p className="mt-2 text-white/80">
          예선 기획안은 아래 Google Form으로 제출해 주세요. 기획서 템플릿이 필요하면 양식을 다운로드할 수 있습니다.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://forms.gle/bNT3jsEXzbA93vz27"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl px-6 py-3 bg-white text-black font-semibold hover:opacity-90"
          >
            Google Form으로 제출하기
          </a>
          <a
            href={encodeURI("/기획서 양식.zip")}
            download
            className="rounded-xl px-6 py-3 bg-white/10 border border-white/15 hover:border-white/25"
          >
            기획서 양식 다운로드 (ZIP)
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-white/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>주최: 서울대학교 중앙 컴퓨터 연구회 SCSC · 문의: 01035372998 / scsc.snu@gmail.com</div>
          <div className="flex gap-4">
            <a href="#top" className="hover:text-white/90">맨 위로</a>
            <a href="#guides" className="hover:text-white/90">운영 요강</a>
            <a href="#format" className="hover:text-white/90">심사 기준</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function TimeSeg({ label, value }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="count-seg rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-center">
      <div className="text-2xl font-semibold tabular-nums">{v}</div>
      <div className="text-[10px] mt-0.5 text-white/70">{label}</div>
    </div>
  );
}
function Colon() {
  return <div className="self-center opacity-60">:</div>;
}
