import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  RefreshCw,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { evaluateStudent } from '../services/predictionEngine';
import { Student, PredictionResult } from '../types';

export const ExplainModal: React.FC = () => {
  const { 
    isExplainModalOpen, 
    setIsExplainModalOpen, 
    explainModalStudentId, 
    students, 
    settings,
    theme
  } = useApp();

  const isDark = theme === 'dark';

  const [student, setStudent] = useState<Student | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [source, setSource] = useState<string>('EduPredict Explainable AI Engine');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!explainModalStudentId) return;
    const s = students.find(item => item.id === explainModalStudentId);
    if (s) {
      setStudent(s);
      const evalRes = evaluateStudent(s, settings);
      setPrediction(evalRes.prediction);
      fetchDetailedExplanation(s.id);
    }
  }, [explainModalStudentId, students, settings]);

  const fetchDetailedExplanation = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await api.explainPrediction(id);
      if (data && data.narrative) {
        setNarrative(data.narrative);
        if (data.source) setSource(data.source);
      }
    } catch (e) {
      setNarrative(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExplainModalOpen || !student || !prediction) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className={`${isDark ? 'gradient-border-wrapper' : 'gradient-border-light'} max-w-2xl w-full max-h-[90vh]`}>
        <div className={`rounded-[calc(1.5rem-1px)] w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors ${
          isDark ? 'bg-[#0E1526] text-white' : 'bg-white text-slate-900'
        }`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between sticky top-0 backdrop-blur z-10 ${
          isDark ? 'bg-[#0E1526]/95 border-slate-800' : 'bg-white/95 border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Explainable AI Diagnostics</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  Glass-Box AI
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Factor attribution & decision decomposition for {student.name} ({student.rollNumber})
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExplainModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Top Prediction Summary Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Target Outcome</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black font-mono">{prediction.predictedScore}%</span>
                <span className="text-sm font-semibold text-purple-300">Grade: {prediction.expectedGrade}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Risk Assessment</span>
              <p className={`text-base font-extrabold mt-0.5 ${
                prediction.riskLevel === 'High' ? 'text-rose-400' : prediction.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {prediction.riskLevel} Risk ({prediction.riskScore}/100)
              </p>
            </div>
          </div>

          {/* AI Qualitative Synthesis Narrative */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-purple-950/30 border-purple-900/50' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                Comprehensive Diagnostic Summary
              </span>
              <span className="text-[10px] text-purple-400 font-mono font-medium">Source: {source}</span>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 py-3 text-xs text-purple-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing qualitative model parameters...</span>
              </div>
            ) : (
              <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {narrative || (
                  `${student.name}'s predicted score of ${prediction.predictedScore}% is calibrated with ${prediction.confidence}% confidence. Primary deficit drivers stem from attendance disruptions and late lab submissions, while historical performance suggests substantial recovery capacity with faculty check-ins.`
                )}
              </p>
            )}
          </div>

          {/* Factor Breakdown List */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Factor Contribution Breakdown
            </h3>

            <div className="space-y-3">
              {prediction.factors.map((factor, idx) => {
                const isPos = factor.impact === 'positive';
                const isNeg = factor.impact === 'negative';
                return (
                  <div key={idx} className={`p-3.5 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          isPos ? 'bg-emerald-500' : isNeg ? 'bg-rose-500' : 'bg-slate-400'
                        }`} />
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{factor.name}</span>
                        <span className="text-slate-500 font-mono font-normal">({factor.weight}% model weight)</span>
                      </div>
                      <span className="font-extrabold font-mono">{factor.score}%</span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${isPos ? 'bg-emerald-500' : isNeg ? 'bg-rose-500' : 'bg-indigo-500'}`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>

                    <p className={`text-[11px] leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {factor.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <span className="text-[11px] text-slate-500 italic">
              Probabilistic estimates designed for faculty advisory interventions.
            </span>
            <button
              onClick={() => setIsExplainModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Close Diagnostic
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
