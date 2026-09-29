import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building2,
  ArrowRight,
  Info,
  CheckCircle,
} from 'lucide-react';

export const AffordabilityCalculator: React.FC = () => {
  const { setCurrentView, setPriceRange, showToast, incrementAiQueries } = useApp();

  // Inputs
  const [grossIncomeKsh, setGrossIncomeKsh] = useState<number>(180000);
  const [commitmentsKsh, setCommitmentsKsh] = useState<number>(30000);
  const [depositKsh, setDepositKsh] = useState<number>(1500000);
  const [termYears, setTermYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(12.5); // % p.a.

  // AI Insights State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Financial calculations
  const calculations = useMemo(() => {
    // Net disposable income
    const netDisposable = Math.max(0, grossIncomeKsh - commitmentsKsh);

    // Standard banking rule in Kenya: Maximum housing debt service ratio = 35% - 40% of gross income
    // Max monthly payment borrower can safely afford:
    const maxMonthlyPayment = Math.max(0, grossIncomeKsh * 0.35 - commitmentsKsh);

    // Monthly interest rate
    const r = interestRate / 100 / 12;
    const n = termYears * 12;

    // Loan amount formula: PV = PMT * [ (1 - (1+r)^-n) / r ]
    let maxLoanAmount = 0;
    if (r > 0 && n > 0 && maxMonthlyPayment > 0) {
      maxLoanAmount = maxMonthlyPayment * ((1 - Math.pow(1 + r, -n)) / r);
    }

    // Affordable purchase price = Available Deposit + Max Loan Amount
    const affordablePropertyPrice = Math.round(depositKsh + maxLoanAmount);

    // Minimum deposit requirement (Kenyan banks typically require 10% to 20% down payment)
    const minDepositReq = Math.round(affordablePropertyPrice * 0.15);

    // Debt to Income ratio
    const totalMonthlyDebtService = commitmentsKsh + maxMonthlyPayment;
    const dtiRatio = Math.round((totalMonthlyDebtService / Math.max(1, grossIncomeKsh)) * 100);

    return {
      maxMonthlyPayment: Math.round(maxMonthlyPayment),
      maxLoanAmount: Math.round(maxLoanAmount),
      affordablePropertyPrice,
      minDepositReq,
      dtiRatio,
      conservativePrice: Math.round(affordablePropertyPrice * 0.85),
      optimisticPrice: Math.round(affordablePropertyPrice * 1.05),
    };
  }, [grossIncomeKsh, commitmentsKsh, depositKsh, termYears, interestRate]);

  // Request AI Advisory from server
  const handleRequestAiAdvice = async () => {
    setIsAiLoading(true);
    incrementAiQueries();

    try {
      const res = await fetch('/api/gemini/affordability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: grossIncomeKsh,
          commitments: commitmentsKsh,
          deposit: depositKsh,
          termYears,
          interestRate,
        }),
      });

      if (!res.ok) throw new Error('Affordability analysis failed');
      const data = await res.json();
      setAiReport(data);
      showToast('Gemini Affordability Advisory generated', 'success');
    } catch (err) {
      console.warn('Fallback affordability insights:', err);
      setAiReport({
        advisorNotes: `With a gross monthly income of KSh ${grossIncomeKsh.toLocaleString()} and KSh ${depositKsh.toLocaleString()} in liquid deposit, you qualify for substantial residential acquisition in Kenya. Your debt-to-income is sitting at ${calculations.dtiRatio}%, safely under the central bank's 40% prudential guideline.`,
        budgetTier: 'Balanced & Low Risk',
        recommendations: [
          'Investigate Kenya Mortgage Refinance Company (KMRC) single-digit mortgages at 9.5% p.a. through participating SACCOs or banks.',
          'Budget 4% for Ministry of Lands stamp duty (urban) plus 1.5% legal conveyancing fees.',
          'Consider emerging high-growth corridors in Ruaka, Kiambu or Nyanchwa, Kisii for superior capital yield.',
        ],
        saccoVsBankComparison:
          'SACCOs in Kenya (e.g. Stima SACCO, Harambee) typically offer 3x multiplier on savings at 12% fixed reducing balance without punitive early settlement penalties.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleBrowseAffordableProperties = () => {
    setPriceRange([0, calculations.affordablePropertyPrice]);
    setCurrentView('marketplace');
    showToast(`Filtered properties under KSh ${calculations.affordablePropertyPrice.toLocaleString()}`, 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Calculator className="w-3.5 h-3.5 text-emerald-500" />
          <span>Affordability AI · Financial Planning Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-display">
          Calculate Your Kenyan Property Purchasing Power
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-3xl">
          Evaluate what property price range suits your monthly cash flow, taking into account deposit savings, existing debts,
          and Kenyan commercial bank / SACCO mortgage rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm text-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white uppercase tracking-wider pb-2 border-b border-stone-200 dark:border-stone-800">
            Financial Profile Inputs
          </h3>

          {/* Gross Monthly Income */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Gross Monthly Income
              </label>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                KSh {grossIncomeKsh.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="30000"
              max="1500000"
              step="10000"
              value={grossIncomeKsh}
              onChange={e => setGrossIncomeKsh(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600"
            />
            <span className="text-[10px] text-stone-400">Salary, business profits, agricultural income</span>
          </div>

          {/* Existing Commitments */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Existing Monthly Debt & SACCO Loans
              </label>
              <span className="font-bold text-stone-800 dark:text-stone-200">
                KSh {commitmentsKsh.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              step="5000"
              value={commitmentsKsh}
              onChange={e => setCommitmentsKsh(parseInt(e.target.value, 10))}
              className="w-full accent-stone-600"
            />
            <span className="text-[10px] text-stone-400">Car loan, check-off SACCO deduction, credit cards</span>
          </div>

          {/* Available Cash Deposit */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Available Cash Deposit
              </label>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                KSh {depositKsh.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="25000000"
              step="100000"
              value={depositKsh}
              onChange={e => setDepositKsh(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600"
            />
            <span className="text-[10px] text-stone-400">Personal savings, SACCO dividends, asset sale</span>
          </div>

          {/* Desired Loan Period */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Loan Period
              </label>
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {termYears} Years ({termYears * 12} Months)
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={termYears}
              onChange={e => setTermYears(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600"
            />
          </div>

          {/* Financing Rate Presets */}
          <div className="space-y-2 pt-2">
            <label className="font-semibold text-stone-700 dark:text-stone-300 block">
              Interest Rate Benchmark
            </label>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setInterestRate(9.5)}
                className={`p-2 rounded-lg border text-center transition ${
                  interestRate === 9.5
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div>KMRC Rate</div>
                <div className="font-mono text-xs">9.5%</div>
              </button>
              <button
                type="button"
                onClick={() => setInterestRate(12.5)}
                className={`p-2 rounded-lg border text-center transition ${
                  interestRate === 12.5
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div>SACCO Rate</div>
                <div className="font-mono text-xs">12.5%</div>
              </button>
              <button
                type="button"
                onClick={() => setInterestRate(15.0)}
                className={`p-2 rounded-lg border text-center transition ${
                  interestRate === 15.0
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div>Bank Std</div>
                <div className="font-mono text-xs">15.0%</div>
              </button>
            </div>
          </div>

          <button
            onClick={handleRequestAiAdvice}
            disabled={isAiLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAiLoading ? 'Consulting Gemini...' : 'Generate Gemini Advisory'}</span>
          </button>
        </div>

        {/* Right Output Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Purchasing Power Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-white dark:to-stone-900 border border-amber-500/30 shadow-lg space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Estimated Purchasing Capacity
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white font-display">
                KSh {calculations.affordablePropertyPrice.toLocaleString()}
              </div>
              <div className="text-xs text-stone-500">
                Estimated safe property acquisition range: KSh {calculations.conservativePrice.toLocaleString()} – KSh {calculations.optimisticPrice.toLocaleString()}
              </div>
            </div>

            {/* Estimated Monthly Payment & Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200/80 dark:border-stone-800 text-xs">
              <div className="space-y-1">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] block">
                  Est. Monthly Payment
                </span>
                <span className="text-base font-extrabold text-stone-900 dark:text-white">
                  KSh {calculations.maxMonthlyPayment.toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-400 block">Principle + Interest</span>
              </div>

              <div className="space-y-1">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] block">
                  Est. Max Loan Amount
                </span>
                <span className="text-base font-extrabold text-stone-900 dark:text-white">
                  KSh {calculations.maxLoanAmount.toLocaleString()}
                </span>
                <span className="text-[10px] text-stone-400 block">Bank or SACCO funded</span>
              </div>

              <div className="space-y-1">
                <span className="text-stone-500 dark:text-stone-400 text-[11px] block">
                  Min. Deposit Required (15%)
                </span>
                <span className="text-base font-extrabold text-stone-900 dark:text-white">
                  KSh {calculations.minDepositReq.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  {depositKsh >= calculations.minDepositReq ? 'Deposit Ready' : 'Top-Up Needed'}
                </span>
              </div>
            </div>

            {/* Debt to Income Ratio Meter */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  Debt-to-Income (DTI) Health Index
                </span>
                <span
                  className={`font-bold ${
                    calculations.dtiRatio <= 35
                      ? 'text-emerald-600'
                      : calculations.dtiRatio <= 45
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  {calculations.dtiRatio}% (Prudential Limit: 40%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    calculations.dtiRatio <= 35
                      ? 'bg-emerald-500'
                      : calculations.dtiRatio <= 45
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(calculations.dtiRatio, 100)}%` }}
                />
              </div>
            </div>

            {/* Direct CTA to Browse Affordable Listings */}
            <button
              onClick={handleBrowseAffordableProperties}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow transition"
            >
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>Browse Properties Within KSh {calculations.affordablePropertyPrice.toLocaleString()} Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Gemini AI Advisory Breakdown */}
          {aiReport && (
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 text-xs animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                    Gemini Mortgage & Structuring Insights
                  </h4>
                </div>
                {aiReport.budgetTier && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20">
                    {aiReport.budgetTier}
                  </span>
                )}
              </div>

              <p className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {aiReport.advisorNotes}
              </p>

              {aiReport.recommendations && (
                <div className="space-y-1.5 pt-2">
                  <span className="font-bold text-stone-900 dark:text-white block">
                    Strategic Recommendations:
                  </span>
                  <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                    {aiReport.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiReport.saccoVsBankComparison && (
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  <strong className="text-stone-800 dark:text-stone-200 block mb-0.5">
                    Kenyan SACCO vs Commercial Bank Option:
                  </strong>
                  {aiReport.saccoVsBankComparison}
                </div>
              )}
            </div>
          )}

          {/* Mandatory Disclaimer as requested */}
          <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 flex items-start gap-2.5 text-[11px] text-stone-500">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note on estimates:</strong> All calculated prices, loan installments, and deposit thresholds are indicative
              estimates for financial modeling. Actual terms depend on formal appraisal, credit bureau scoring (CRB check in Kenya),
              and statutory transaction costs (4% stamp duty, 1.5% legal fees, valuation charges).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
