"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { Analysis } from "@/lib/types";

const tooltipStyle = {
  background: "rgba(17,19,26,0.94)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
  color: "#f8fafc"
};

export function RadarAnalysis({ analysis }: { analysis: Analysis }) {
  return (
    <div className="h-[320px] sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={analysis.radar} outerRadius="72%">
          <PolarGrid stroke="rgba(255,255,255,0.13)" radialLines={false} />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#b5bdca", fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="score" stroke="#39e6b5" strokeWidth={2.5} fill="url(#radarFill)" fillOpacity={0.34} />
          <defs>
            <linearGradient id="radarFill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#39e6b5" />
              <stop offset="100%" stopColor="#5cc8ff" />
            </linearGradient>
          </defs>
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.12)" }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillGapChart({ analysis }: { analysis: Analysis }) {
  return (
    <div className="h-[320px] sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={analysis.skill_gap} margin={{ top: 10, right: 8, left: -18, bottom: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#a4adbb", fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={64} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#a4adbb", fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
          <defs>
            <linearGradient id="matchedBar" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#39e6b5" />
              <stop offset="100%" stopColor="#5cc8ff" />
            </linearGradient>
            <linearGradient id="gapBar" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffcc66" />
              <stop offset="100%" stopColor="#ff6b98" />
            </linearGradient>
          </defs>
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {analysis.skill_gap.map((entry) => (
              <Cell key={entry.name} fill={entry.matched ? "url(#matchedBar)" : "url(#gapBar)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
