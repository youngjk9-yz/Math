"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CURRICULUM_UNITS,
  SkillDefinition,
} from "@/lib/math-engine";
import { ProgressMap, loadProgress } from "@/lib/progress-store";
import { PracticeWorkspace } from "@/components/PracticeWorkspace";
import { MathDisplay } from "@/components/MathDisplay";
import {
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const [activeSkill, setActiveSkill] = useState<SkillDefinition | null>(null);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
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

          <span className="text-sm font-medium text-slate-600">
            6th Grade Math
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
          <div className="space-y-6">
            {/* Simple Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h1 className="text-2xl font-bold text-slate-900">
                6th Grade Math Curriculum
              </h1>
              <p className="text-xs text-slate-500">
                6 Units • 18 Topics
              </p>
            </div>

            {/* Clean Curriculum Units List */}
            <div className="space-y-4">
              {CURRICULUM_UNITS.map((unit) => (
                <section
                  key={unit.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  {/* Compact Unit Header */}
                  <div className="bg-slate-50/80 border-b border-slate-200 px-4 py-3 flex items-center gap-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      {unit.code}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900">
                      {unit.title}
                    </h2>
                  </div>

                  {/* Scannable Topic Rows */}
                  <div className="divide-y divide-slate-100">
                    {unit.skills.map((skill) => {
                      const isMastered = progress[skill.id]?.mastered || false;

                      return (
                        <div
                          key={skill.id}
                          onClick={() => setActiveSkill(skill)}
                          className="px-4 py-3.5 hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          {/* Left: Code & Title */}
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-mono font-bold text-slate-500 w-7 shrink-0">
                              {skill.code}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 truncate">
                              {skill.title}
                            </span>
                            {isMastered && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>

                          {/* Right: Example Math + Practice Button */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-10 sm:pl-0">
                            <div className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200/80">
                              <MathDisplay latex={skill.exampleLatex} />
                            </div>

                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition">
                              Practice
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
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
    </div>
  );
}
