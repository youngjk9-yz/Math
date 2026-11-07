"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CURRICULUM_UNITS,
  SkillDefinition,
} from "@/lib/math-engine";
import { ProgressMap, loadProgress } from "@/lib/progress-store";
import { PracticeWorkspace } from "@/components/PracticeWorkspace";
import { ExampleView } from "@/components/ExampleView";
import { MathDisplay } from "@/components/MathDisplay";
import {
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const UNIT_THEMES = [
  {
    headerBg: "bg-indigo-950 text-white",
    badgeBg: "bg-indigo-500 text-white",
    borderAccent: "border-indigo-200",
    codeColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
  },
  {
    headerBg: "bg-blue-950 text-white",
    badgeBg: "bg-blue-500 text-white",
    borderAccent: "border-blue-200",
    codeColor: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    headerBg: "bg-teal-950 text-white",
    badgeBg: "bg-teal-500 text-white",
    borderAccent: "border-teal-200",
    codeColor: "text-teal-700 bg-teal-50 border-teal-200",
  },
  {
    headerBg: "bg-amber-950 text-white",
    badgeBg: "bg-amber-500 text-slate-950",
    borderAccent: "border-amber-200",
    codeColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    headerBg: "bg-purple-950 text-white",
    badgeBg: "bg-purple-500 text-white",
    borderAccent: "border-purple-200",
    codeColor: "text-purple-700 bg-purple-50 border-purple-200",
  },
  {
    headerBg: "bg-emerald-950 text-white",
    badgeBg: "bg-emerald-500 text-slate-950",
    borderAccent: "border-emerald-200",
    codeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
];

export default function HomePage() {
  const [activeSkill, setActiveSkill] = useState<SkillDefinition | null>(null);
  const [activeView, setActiveView] = useState<"example" | "questions">("questions");
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const allSkills = useMemo(
    () => CURRICULUM_UNITS.flatMap((u) => u.skills),
    []
  );

  const nextSkillInSequence = useMemo(() => {
    if (!activeSkill) return undefined;
    const idx = allSkills.findIndex((s) => s.id === activeSkill.id);
    if (idx >= 0 && idx + 1 < allSkills.length) {
      return allSkills[idx + 1];
    }
    return undefined;
  }, [activeSkill, allSkills]);

  function openSkillView(skill: SkillDefinition, view: "example" | "questions") {
    setActiveSkill(skill);
    setActiveView(view);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Minimal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setActiveSkill(null)}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">
              Advanone
            </span>
          </button>

          <span className="text-sm font-semibold text-slate-600">
            6th Grade Math
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeSkill ? (
          activeView === "example" ? (
            <ExampleView
              skill={activeSkill}
              onBackToCurriculum={() => setActiveSkill(null)}
              onGoToQuestions={() => setActiveView("questions")}
            />
          ) : (
            <PracticeWorkspace
              skill={activeSkill}
              nextSkill={nextSkillInSequence}
              progress={progress}
              onUpdateProgress={setProgress}
              onBackToCurriculum={() => setActiveSkill(null)}
              onOpenExamples={() => setActiveView("example")}
              onSelectSkill={(skill) => {
                setActiveSkill(skill);
                setActiveView("questions");
              }}
            />
          )
        ) : (
          <div className="space-y-8">
            {/* Simple Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-slate-200 pb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                6th Grade Math Curriculum
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                6 Units • 18 Topics
              </p>
            </div>

            {/* Clearly Distinguished Curriculum Units */}
            <div className="space-y-7">
              {CURRICULUM_UNITS.map((unit, unitIdx) => {
                const theme = UNIT_THEMES[unitIdx % UNIT_THEMES.length];

                return (
                  <section
                    key={unit.id}
                    className={`bg-white rounded-2xl border-2 ${theme.borderAccent} shadow-sm overflow-hidden`}
                  >
                    {/* High-Contrast Unit Header Banner */}
                    <div className={`${theme.headerBg} px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider ${theme.badgeBg}`}>
                          {unit.code}
                        </span>
                        <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                          {unit.title}
                        </h2>
                      </div>
                      <span className="text-xs text-white/75 font-medium">
                        {unit.description}
                      </span>
                    </div>

                    {/* Scannable Topic Rows */}
                    <div className="divide-y divide-slate-200/80">
                      {unit.skills.map((skill) => {
                        const isMastered = progress[skill.id]?.mastered || false;

                        return (
                          <div
                            key={skill.id}
                            className="px-5 py-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            {/* Left: Code Pill & Title */}
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className={`px-2 py-0.5 rounded-md border text-xs font-mono font-bold shrink-0 ${theme.codeColor}`}>
                                {skill.code}
                              </span>
                              <span className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                                {skill.title}
                              </span>
                              {isMastered && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </div>

                            {/* Right: Sample Math + Example Button + Questions Button */}
                            <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pl-11 sm:pl-0">
                              <div className="hidden md:block text-xs text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
                                <MathDisplay latex={skill.exampleLatex} />
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openSkillView(skill, "example")}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                                >
                                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                                  Example
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openSkillView(skill, "questions")}
                                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
                                >
                                  Questions
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
