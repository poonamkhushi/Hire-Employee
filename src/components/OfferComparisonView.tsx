import React, { useMemo, useState } from 'react';
import { Check, CheckCircle2, Star } from 'lucide-react';
import { JobApplication } from '../types/career';

interface OfferComparisonViewProps {
  applications: JobApplication[];
  onSetPreferredOffer: (appId: string) => void;
  onToggleSignOffer: (appId: string) => void;
  onSelectApp: (app: JobApplication) => void;
  onGoToApplications: () => void;
}

function fmtUsd(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

export const OfferComparisonView: React.FC<OfferComparisonViewProps> = ({
  applications,
  onSetPreferredOffer,
  onToggleSignOffer,
  onSelectApp,
  onGoToApplications,
}) => {
  const [equityMultiplierPct, setEquityMultiplierPct] = useState(0); // -20 to +40
  const [bonusAttainmentPct, setBonusAttainmentPct] = useState(100); // 80 to 125

  const offerApps = useMemo(
    () => applications.filter((app) => app.stage === 'offer' && app.offer),
    [applications]
  );

  const computedOffers = useMemo(() => {
    return offerApps.map((app) => {
      const offer = app.offer!;
      const adjustedEquity = offer.annualEquity * (1 + equityMultiplierPct / 100);
      const targetBonusAmount =
        offer.baseSalary * (offer.targetBonusPct / 100) * (bonusAttainmentPct / 100);
      const year1Total =
        offer.baseSalary + adjustedEquity + targetBonusAmount + offer.signOnBonus;
      const annualRecurring = offer.baseSalary + adjustedEquity + targetBonusAmount;
      const fourYearTotal = annualRecurring * 4 + offer.signOnBonus;
      return {
        app,
        offer,
        adjustedEquity,
        targetBonusAmount,
        year1Total,
        annualRecurring,
        fourYearTotal,
      };
    });
  }, [offerApps, equityMultiplierPct, bonusAttainmentPct]);

  const maxYear1 = useMemo(
    () => Math.max(0, ...computedOffers.map((o) => o.year1Total)),
    [computedOffers]
  );
  const maxBase = useMemo(
    () => Math.max(0, ...computedOffers.map((o) => o.offer.baseSalary)),
    [computedOffers]
  );
  const maxFourYrEquity = useMemo(
    () => Math.max(0, ...computedOffers.map((o) => o.adjustedEquity * 4)),
    [computedOffers]
  );

  if (offerApps.length === 0) {
    return (
      <section aria-labelledby="offers-heading" className="space-y-6">
        <div>
          <h1
            id="offers-heading"
            className="text-[28px] md:text-[36px] font-bold leading-tight tracking-tight text-[#0B1C30]"
          >
            Offer Comparison
          </h1>
          <p className="mt-1.5 text-sm text-[#475569]">
            Evaluate base salary, RSU equity vesting, sign-on bonuses, and 4-year total compensation.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <h2 className="text-lg font-bold text-[#0B1C30]">No offers in Offer Stage yet</h2>
          <p className="mt-1.5 text-sm text-[#64748B] max-w-md mx-auto">
            Move an active application to Offer Stage from your pipeline to unlock side-by-side compensation modeling.
          </p>
          <button
            type="button"
            onClick={onGoToApplications}
            className="mt-5 h-12 px-5 rounded-lg bg-[#1E1B4B] hover:bg-[#312E81] text-white text-sm font-semibold transition-colors"
          >
            Open Active Applications
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="offers-heading" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            id="offers-heading"
            className="text-[28px] md:text-[36px] font-bold leading-tight tracking-tight text-[#0B1C30]"
          >
            Offer Comparison
          </h1>
          <p className="mt-1.5 text-sm text-[#475569] tabular-nums">
            Comparing <span className="font-semibold text-[#0B1C30]">{offerApps.length}</span> active offer packages
            <span className="mx-2 text-[#CBD5E1]" aria-hidden="true">·</span>
            Year-1 &amp; 4-Year annualized modeling
          </p>
        </div>
      </div>

      {/* 4-Column Summary Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-semibold text-[#64748B]">Top Year-1 Comp</p>
          <p className="mt-1.5 text-2xl font-bold text-[#059669] tabular-nums">
            {fmtUsd(maxYear1)}
          </p>
          <p className="mt-1 text-xs text-[#64748B]">Includes sign-on &amp; bonus</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-semibold text-[#64748B]">Highest Base Salary</p>
          <p className="mt-1.5 text-2xl font-bold text-[#0B1C30] tabular-nums">
            {fmtUsd(maxBase)}
          </p>
          <p className="mt-1 text-xs text-[#64748B]">Guaranteed annual cash</p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-semibold text-[#64748B]">Peak 4-Yr Equity</p>
          <p className="mt-1.5 text-2xl font-bold text-[#4F46E5] tabular-nums">
            {fmtUsd(maxFourYrEquity)}
          </p>
          <p className="mt-1 text-xs text-[#64748B] tabular-nums">
            At {equityMultiplierPct >= 0 ? `+${equityMultiplierPct}%` : `${equityMultiplierPct}%`} valuation
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-semibold text-[#64748B]">Next Deadline</p>
          <p className="mt-1.5 text-2xl font-bold text-[#D97706] tabular-nums">
            {computedOffers[0]?.offer.deadlineLabel ?? 'TBD'}
          </p>
          <p className="mt-1 text-xs text-[#64748B] truncate">
            {computedOffers[0]?.app.company} decision window
          </p>
        </div>
      </div>

      {/* Interactive Scenario Modelers */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="equity-slider" className="text-xs font-bold text-[#475569]">
              Equity Valuation Scenario
            </label>
            <span className="text-xs font-bold text-[#4F46E5] tabular-nums">
              {equityMultiplierPct >= 0 ? `+${equityMultiplierPct}%` : `${equityMultiplierPct}%`}
            </span>
          </div>
          <input
            id="equity-slider"
            type="range"
            min={-20}
            max={40}
            step={5}
            value={equityMultiplierPct}
            onChange={(e) => setEquityMultiplierPct(Number(e.target.value))}
            className="w-full accent-[#4F46E5] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#64748B] mt-1 tabular-nums">
            <span>-20% Conservative</span>
            <span>0% Grant</span>
            <span>+40% Upside</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="bonus-slider" className="text-xs font-bold text-[#475569]">
              Target Bonus Attainment
            </label>
            <span className="text-xs font-bold text-[#059669] tabular-nums">
              {bonusAttainmentPct}%
            </span>
          </div>
          <input
            id="bonus-slider"
            type="range"
            min={80}
            max={125}
            step={5}
            value={bonusAttainmentPct}
            onChange={(e) => setBonusAttainmentPct(Number(e.target.value))}
            className="w-full accent-[#059669] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#64748B] mt-1 tabular-nums">
            <span>80% Floor</span>
            <span>100% Target</span>
            <span>125% Exceeds</span>
          </div>
        </div>
      </div>

      {/* Offer Package Cards (Mobile & Desktop Side-by-Side Highlight) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {computedOffers.map(({ app, offer, adjustedEquity, targetBonusAmount, year1Total, fourYearTotal }) => {
          const isLeader = year1Total === maxYear1 && computedOffers.length > 1;
          return (
            <div
              key={app.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                offer.isSigned
                  ? 'border-[#059669] shadow-[0_8px_16px_-4px_rgba(5,150,105,0.12)]'
                  : offer.isPreferred
                  ? 'border-[#4F46E5] shadow-[0_8px_16px_-4px_rgba(30,27,75,0.08)]'
                  : 'border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.04)]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectApp(app)}
                  className="flex items-start gap-3 text-left group min-w-0"
                >
                  <div
                    className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: app.brandHue }}
                    aria-hidden="true"
                  >
                    {app.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#475569]">{app.company}</span>
                      {offer.isSigned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Signed
                        </span>
                      )}
                      {!offer.isSigned && isLeader && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[11px] font-bold">
                          Highest Year-1
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-[#0B1C30] group-hover:text-[#4F46E5] transition-colors truncate">
                      {app.role}
                    </h2>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {app.location} · {app.workMode} · Deadline {offer.deadlineLabel}
                    </p>
                  </div>
                </button>
              </div>

              {/* Total Comp Banner */}
              <div className="mt-5 pt-4 border-t border-[#F1F5F9] grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-[#64748B]">Year-1 Total Comp</p>
                  <p className="mt-1 text-2xl font-bold text-[#059669] tabular-nums">
                    {fmtUsd(year1Total)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#64748B]">4-Year Cumulative</p>
                  <p className="mt-1 text-2xl font-bold text-[#1E1B4B] tabular-nums">
                    {fmtUsd(fourYearTotal)}
                  </p>
                </div>
              </div>

              {/* Line-by-Line Breakdown */}
              <dl className="mt-4 divide-y divide-[#F1F5F9] text-sm">
                <div className="py-2.5 flex items-center justify-between">
                  <dt className="text-[#475569]">Base Salary</dt>
                  <dd className="font-semibold text-[#0B1C30] tabular-nums">
                    {fmtUsd(offer.baseSalary)} / yr
                  </dd>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <dt className="text-[#475569]">Annual Equity (RSU)</dt>
                  <dd className="font-semibold text-[#0B1C30] tabular-nums">
                    {fmtUsd(adjustedEquity)} / yr
                  </dd>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <dt className="text-[#475569]">
                    Target Bonus ({offer.targetBonusPct}% × {bonusAttainmentPct}%)
                  </dt>
                  <dd className="font-semibold text-[#0B1C30] tabular-nums">
                    {fmtUsd(targetBonusAmount)} / yr
                  </dd>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <dt className="text-[#475569]">Sign-On Bonus (Yr 1)</dt>
                  <dd className="font-semibold text-[#0B1C30] tabular-nums">
                    {fmtUsd(offer.signOnBonus)}
                  </dd>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <dt className="text-[#475569]">PTO &amp; Learning Stipend</dt>
                  <dd className="font-medium text-[#475569] tabular-nums">
                    {offer.ptoDays} days · {fmtUsd(offer.learningStipend)}
                  </dd>
                </div>
              </dl>

              {/* Action Row */}
              <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSetPreferredOffer(app.id)}
                  className={`flex-1 h-12 px-4 rounded-lg border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                    offer.isPreferred
                      ? 'bg-[#4F46E5]/10 border-[#4F46E5] text-[#4F46E5]'
                      : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#1E1B4B]'
                  }`}
                >
                  <Star className={`w-4 h-4 ${offer.isPreferred ? 'fill-current' : ''}`} />
                  <span>{offer.isPreferred ? 'Preferred Offer' : 'Mark Preferred'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSignOffer(app.id)}
                  className={`flex-1 h-12 px-4 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                    offer.isSigned
                      ? 'bg-[#059669] hover:bg-[#047857] text-white'
                      : 'bg-[#1E1B4B] hover:bg-[#312E81] text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{offer.isSigned ? 'Offer Signed' : 'Accept & Sign'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop High-Density Side-by-Side Matrix */}
      <div className="hidden md:block bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h2 className="text-sm font-bold text-[#1E1B4B]">Executive Breakdown Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-5">Component</th>
                {computedOffers.map(({ app }) => (
                  <th key={app.id} className="py-3 px-5 text-right">
                    {app.company}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-sm">
              <tr>
                <td className="py-3 px-5 font-medium text-[#475569]">Base Salary</td>
                {computedOffers.map(({ app, offer }) => (
                  <td key={app.id} className="py-3 px-5 text-right font-semibold tabular-nums text-[#0B1C30]">
                    {fmtUsd(offer.baseSalary)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-[#475569]">Annual Equity (Adjusted)</td>
                {computedOffers.map(({ app, adjustedEquity }) => (
                  <td key={app.id} className="py-3 px-5 text-right font-semibold tabular-nums text-[#0B1C30]">
                    {fmtUsd(adjustedEquity)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-[#475569]">Annual Cash Bonus</td>
                {computedOffers.map(({ app, targetBonusAmount }) => (
                  <td key={app.id} className="py-3 px-5 text-right font-semibold tabular-nums text-[#0B1C30]">
                    {fmtUsd(targetBonusAmount)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-[#475569]">Sign-On Bonus</td>
                {computedOffers.map(({ app, offer }) => (
                  <td key={app.id} className="py-3 px-5 text-right font-semibold tabular-nums text-[#0B1C30]">
                    {fmtUsd(offer.signOnBonus)}
                  </td>
                ))}
              </tr>
              <tr className="bg-[#F8FAFC]">
                <td className="py-3.5 px-5 font-bold text-[#1E1B4B]">Year-1 Total Compensation</td>
                {computedOffers.map(({ app, year1Total }) => (
                  <td
                    key={app.id}
                    className={`py-3.5 px-5 text-right font-bold tabular-nums ${
                      year1Total === maxYear1 ? 'text-[#059669]' : 'text-[#1E1B4B]'
                    }`}
                  >
                    {fmtUsd(year1Total)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-bold text-[#1E1B4B]">4-Year Total Value</td>
                {computedOffers.map(({ app, fourYearTotal }) => (
                  <td key={app.id} className="py-3.5 px-5 text-right font-bold tabular-nums text-[#1E1B4B]">
                    {fmtUsd(fourYearTotal)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
