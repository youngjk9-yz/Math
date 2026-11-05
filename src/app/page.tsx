"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  GRADES,
  getUnitsByGrade,
  SkillDefinition,
} from "@/lib/math-engine";
import { ProgressMap, loadProgress } from "@/lib/progress-store";
import { PracticeWorkspace } from "@/components/PracticeWorkspace";
import { MathDisplay } from "@/components/MathDisplay";
import {
  BookOpen,
  Zap,
  Trophy,
  Flame,
  Play,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  ChevronRight,
  Infinity as InfinityIcon,
} from "lucide-react";

export default function HomePage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [activeSkill, setActiveSkill] = useState<SkillDefinition | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const unitsForGrade = useMemo(() => getUnitsByGrade(selectedGrade), [selectedGrade]);

  const allSkillsInGrade = useMemo(
    () => unitsForGrade.flatMap((u) => u.skills),
    [unitsForGrade]
  );

  const nextSkillInSequence = useMemo(() => {
    if (!activeSkill) return undefined;
    const idx = allSkillsInGrade.findIndex((s) => s.id === activeSkill.id);
    if (idx >= 0 && idx + 1 < allSkillsInGrade.length) {
      return allSkillsInGrade[idx + 1];
    }
    return undefined;
  }, [activeSkill, allSkillsInGrade]);

  const gradeStats = useMemo(() => {
    let masteredCount = 0;
    let totalSolved = 0;
    let bestStreak = 0;

    for (const s of allSkillsInGrade) {
      const p = progress[s.id];
      if (p) {
        if (p.mastered) masteredCount++;
        totalSolved += p.totalSolved;
        if (p.bestStreak > bestStreak) bestStreak = p.bestStreak;
      }
    }

    const recommendedSkill =
      allSkillsInGrade.find((s) => !progress[s.id]?.mastered) || allSkillsInGrade[0];

    return {
      masteredCount,
      totalSkills: allSkillsInGrade.length,
      totalSolved,
      bestStreak,
      recommendedSkill,
    };
  }, [allSkillsInGrade, progress]);

  const currentGradeInfo = GRADES.find((g) => g.grade === selectedGrade) || GRADES[1];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => setActiveSkill(null)}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-indigo-700 transition">
              K+
            </div>
            <div>
              <div className="font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>KumonFlow Math</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <InfinityIcon className="w-3 h-3" />
                  Infinite Drills
                </span>
              </div>
              <div className="text-xs text-slate-500">
                High-Repetition Mastery & Fastest Solution Methods
              </div>
            </div>
          </button>

          {/* Grade Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {GRADES.map((g) => {
              const active = selectedGrade === g.grade;
              return (
                <button
                  key={g.grade}
                  onClick={() => {
                    setSelectedGrade(g.grade);
                    setActiveSkill(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                    active
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>{g.label}</span>
                  {g.isFeaturedPrototype && (
                    <span className="hidden md:inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeSkill ? (
          <PracticeWorkspace
            skill={activeSkill}
            nextSkill={nextSkillInSequence}
            progress={progress}
            onUpdateProgress={setProgress}
            onBackToCurriculum={() => setActiveSkill(null)}
            onSelectSkill={(skill) => setActiveSkill(skill)}
          />
        ) : (
          <div className="space-y-8">
            {/* Hero / Grade Curriculum Overview Banner */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
                    <GraduationCap className="w-4 h-4" />
                    <span>
                      {currentGradeInfo.label} Curriculum • {currentGradeInfo.kumonEquivalent}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                    {currentGradeInfo.label} Math Mastery Path
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {currentGradeInfo.description} Select any micro-skill below to practice an{" "}
                    <strong className="text-white">indefinite stream of generated problems</strong>{" "}
                    with instant step-by-step keys showing the{" "}
                    <strong className="text-amber-300">most efficient way to solve</strong>.
                  </p>

                  {gradeStats.recommendedSkill && (
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveSkill(gradeStats.recommendedSkill)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm transition"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Start Recommended Skill: {gradeStats.recommendedSkill.code}{" "}
                        {gradeStats.recommendedSkill.title}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Grade Mastery Summary Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-center">
                    <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-black">
                      {gradeStats.masteredCount}/{gradeStats.totalSkills}
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium">Skills Mastered</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-black">{gradeStats.totalSolved}</div>
                    <div className="text-[11px] text-slate-300 font-medium">Problems Solved</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-center">
                    <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-black">{gradeStats.bestStreak}</div>
                    <div className="text-[11px] text-slate-300 font-medium">Best Streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Units & Micro-Skills Tree */}
            <div className="space-y-8">
              {unitsForGrade.map((unit) => (
                <section
                  key={unit.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Unit Header */}
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider">
                          {unit.code}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                          {unit.title}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">{unit.description}</p>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 shrink-0">
                      {unit.skills.filter((s) => progress[s.id]?.mastered).length} of{" "}
                      {unit.skills.length} Mastered
                    </div>
                  </div>

                  {/* Skills List inside Unit */}
                  <div className="divide-y divide-slate-200">
                    {unit.skills.map((skill) => {
                      const sp = progress[skill.id];
                      const isMastered = sp?.mastered || false;
                      const currentStreak = sp?.currentStreak || 0;
                      const totalSolved = sp?.totalSolved || 0;
                      const pct = Math.min(
                        100,
                        Math.round((currentStreak / skill.masteryStreak) * 100)
                      );

                      return (
                        <div
                          key={skill.id}
                          className="p-5 sm:p-6 hover:bg-slate-50/80 transition flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                        >
                          <div className="space-y-2.5 flex-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-slate-900 text-white">
                                {skill.code}
                              </span>
                              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                {skill.title}
                              </h3>
                              {isMastered && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                                  Mastered
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600">{skill.subtitle}</p>

                            {/* Efficiency Method Preview Pill */}
                            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start gap-2 text-xs text-indigo-950">
                                <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold">Fastest Method: </span>
                                  {skill.efficiencySummary}
                                </div>
                              </div>
                              <div className="shrink-0 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 text-xs sm:text-sm text-slate-800">
                                <MathDisplay latex={skill.exampleLatex} />
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Progress & Launch Button */}
                          <div className="flex sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0 lg:w-52">
                            <div className="w-full space-y-1">
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>
                                  Streak:{" "}
                                  <strong className="text-slate-800">
                                    {currentStreak}/{skill.masteryStreak}
                                  </strong>
                                </span>
                                <span>{totalSolved} solved</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => setActiveSkill(skill)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition w-full"
                            >
                              <Sparkles className="w-4 h-4" />
                              {totalSolved > 0 ? "Continue Practice" : "Start Session"}
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>
              <strong>KumonFlow Math</strong> — Endless procedural problem generation with
              step-by-step efficient solution keys.
            </span>
          </div>
          <div>Progress automatically saved in your browser</div>
        </div>
      </footer>
    </div>
  );
}

