import React, { useState } from 'react';
import { Award, GraduationCap, Languages } from 'lucide-react';
import { PROFILE, SEMESTERS } from '../data/portfolioData';

export const EducationSection: React.FC = () => {
  const [hoveredSem, setHoveredSem] = useState<{ label: string; gpa: number; x: number; y: number } | null>(
    null
  );

  const w = 520;
  const h = 166;
  const padL = 36;
  const padR = 18;
  const padT = 24;
  const padB = 28;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const minG = 7.5;
  const maxG = 10.0;

  const yFor = (val: number) => padT + ((maxG - val) / (maxG - minG)) * plotH;
  const xFor = (idx: number) => padL + (idx / (SEMESTERS.length - 1)) * plotW;

  const x1 = xFor(0);
  const y1 = yFor(9.02);
  const x2 = xFor(1);
  const y2 = yFor(8.86);
  const base = yFor(minG);

  return (
    <section id="education" className="py-12 border-t border-[#E4E2DC] dark:border-[#232732]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-7">
        <div>
          <p className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] mb-1">
            01. Education &amp; Credentials
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Academic Record &amp; Certifications
          </h2>
        </div>
        <p className="text-xs text-[#555B66] dark:text-[#9CA3AF]">
          Hover data points to inspect semester GPA values
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Degree & GPA Trajectory */}
        <div className="lg:col-span-7 bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-[#F1F0EC] dark:bg-[#191C24] text-[#2557D6] dark:text-[#60A5FA] shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#111318] dark:text-[#F3F4F6]">
                  {PROFILE.university}
                </h3>
                <p className="text-sm text-[#555B66] dark:text-[#9CA3AF] mt-0.5">{PROFILE.degree}</p>
              </div>
            </div>
            <span className="font-mono text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] tabular-nums">
              {PROFILE.batch}
            </span>
          </div>

          <div className="bg-[#F8F8F6] dark:bg-[#191C24] border border-[#E4E2DC] dark:border-[#232732] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-[#555B66] dark:text-[#9CA3AF] mb-3">
              <span className="font-medium">Semester GPA Trajectory</span>
              <span className="font-mono tabular-nums">
                Mean (S1–S2): <strong className="text-[#111318] dark:text-[#F3F4F6]">8.94</strong>
              </span>
            </div>

            <div className="relative">
              {hoveredSem && (
                <div
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-full -mt-2 px-2.5 py-1 rounded-md bg-[#111318] dark:bg-[#F3F4F6] text-white dark:text-[#111318] font-mono text-[11px] font-medium whitespace-nowrap shadow-sm z-10 tabular-nums"
                  style={{
                    left: `${(hoveredSem.x / w) * 100}%`,
                    top: `${(hoveredSem.y / h) * 100}%`,
                  }}
                >
                  {hoveredSem.label}: {hoveredSem.gpa.toFixed(2)} GPA
                </div>
              )}

              <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible" role="img" aria-label="Semester GPA trajectory chart">
                <defs>
                  <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2557D6" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2557D6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[8.0, 9.0, 10.0].map((tick) => {
                  const y = yFor(tick);
                  return (
                    <g key={tick}>
                      <line
                        x1={padL}
                        y1={y}
                        x2={w - padR}
                        y2={y}
                        className="stroke-[#E4E2DC] dark:stroke-[#2A303D]"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={padL - 8}
                        y={y + 3.5}
                        textAnchor="end"
                        fontSize="10"
                        className="fill-[#848B98] dark:fill-[#6B7280] font-mono"
                      >
                        {tick.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                <polygon points={`${x1},${base} ${x1},${y1} ${x2},${y2} ${x2},${base}`} fill="url(#gpaGrad)" />
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-[#2557D6] dark:stroke-[#60A5FA]"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1={x2}
                  y1={y2}
                  x2={xFor(7)}
                  y2={yFor(8.75)}
                  className="stroke-[#CFCCC2] dark:stroke-[#353B4A]"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {SEMESTERS.map((sem, idx) => {
                  const x = xFor(idx);
                  const hasGpa = sem.gpa !== null;
                  const y = hasGpa ? yFor(sem.gpa as number) : yFor(8.75);
                  return (
                    <g key={sem.label}>
                      <text
                        x={x}
                        y={h - 6}
                        textAnchor="middle"
                        fontSize="10"
                        className={
                          hasGpa
                            ? 'fill-[#111318] dark:fill-[#F3F4F6] font-mono font-medium'
                            : 'fill-[#848B98] dark:fill-[#6B7280] font-mono'
                        }
                      >
                        {sem.label}
                      </text>
                      {hasGpa ? (
                        <>
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            className="fill-[#2557D6] dark:fill-[#60A5FA] stroke-white dark:stroke-[#191C24] cursor-pointer"
                            strokeWidth="2.5"
                            onMouseEnter={() => setHoveredSem({ label: sem.label, gpa: sem.gpa as number, x, y })}
                            onMouseLeave={() => setHoveredSem(null)}
                          />
                          <text
                            x={x}
                            y={y - 11}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            className="fill-[#111318] dark:fill-[#F3F4F6] font-mono"
                          >
                            {(sem.gpa as number).toFixed(2)}
                          </text>
                        </>
                      ) : (
                        <circle
                          cx={x}
                          cy={y}
                          r="3"
                          fill="none"
                          className="stroke-[#CFCCC2] dark:stroke-[#353B4A]"
                          strokeDasharray="2 2"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Certification & Languages */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex-1 bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-6 flex flex-col justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-[#F1F0EC] dark:bg-[#191C24] text-[#2557D6] dark:text-[#60A5FA] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555B66] dark:text-[#9CA3AF]">
                  Certification · Udemy
                </p>
                <h3 className="font-display text-base font-bold text-[#111318] dark:text-[#F3F4F6] mt-1">
                  100 Days of Code: The Complete Python Pro Bootcamp
                </h3>
                <p className="text-sm text-[#555B66] dark:text-[#9CA3AF] mt-2 leading-relaxed">
                  Hands-on Python programming, scripting, object-oriented design, data processing, and applied project workflows.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-[#F1F0EC] dark:bg-[#191C24] text-[#2557D6] dark:text-[#60A5FA] shrink-0">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555B66] dark:text-[#9CA3AF]">
                  Working Proficiency
                </p>
                <h3 className="font-display text-base font-bold text-[#111318] dark:text-[#F3F4F6] mt-1">
                  Languages Spoken
                </h3>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#111318] dark:text-[#F3F4F6] mt-2">
                  <span>English</span>
                  <span aria-hidden="true" className="text-[#848B98]">·</span>
                  <span>Hindi</span>
                  <span aria-hidden="true" className="text-[#848B98]">·</span>
                  <span>Telugu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
