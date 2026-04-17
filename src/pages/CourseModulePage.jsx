import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "../components/Icon";

export function CourseModulePage({
  isWalletConnected,
  modules,
  onCompleteModule,
  onContinue,
  onSelectAnswer,
  selectedAnswers,
}) {
  const { moduleId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const module = useMemo(
    () => modules.find((entry) => entry.id === moduleId) || modules[0],
    [moduleId, modules],
  );

  const selectedAnswer = selectedAnswers[module.id] ?? module.progress?.selected_answer ?? "";
  const isCompleted = Boolean(module.progress?.completed);

  const handleCompleteModule = async () => {
    setIsSubmitting(true);
    const result = await onCompleteModule(module.id, selectedAnswer);
    setIsSubmitting(false);

    if (result?.completed) {
      onContinue();
    }
  };

  return (
    <div className="grid gap-6 pb-4">
      <section className="grid gap-4">
        <div className="flex items-start justify-between gap-4 max-[420px]:flex-col">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-14 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-brand-primary to-brand-primary-bright text-white shadow-lg shadow-brand-primary/25">
              <Icon className="size-6" name={module.icon} />
            </div>
            <div>
              <h1 className="font-display text-[1.65rem] font-extrabold tracking-[-0.04em] text-brand-text dark:text-white">
                {module.title} Core
              </h1>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary/70 dark:text-brand-primary-soft/80">
                Module Certification
              </p>
            </div>
          </div>
          <div className="rounded-full bg-brand-primary-soft/70 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-primary dark:bg-white/10 dark:text-brand-primary-soft">
            {isCompleted ? "Reward Claimed" : `Reward ${module.rewardXp} XP`}
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-brand-outline/15 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-bright"
            style={{ width: `${isCompleted ? 100 : selectedAnswer ? 72 : 20}%` }}
          />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 p-6 shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="absolute -top-10 -left-10 size-28 rounded-full bg-brand-primary/10 blur-3xl dark:bg-brand-primary/20" />
        <div className="absolute -right-8 -bottom-12 size-32 rounded-full bg-brand-secondary/10 blur-3xl dark:bg-emerald-500/10" />
        <div className="relative z-10">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-secondary dark:text-emerald-300">
            {module.missionLabel}
          </p>
          <h2 className="mt-3 font-display text-[1.8rem] leading-tight font-extrabold tracking-[-0.04em] text-brand-text dark:text-white">
            {module.missionTitle}
          </h2>
          <div className="mt-4 grid gap-4 text-sm leading-7 text-brand-muted dark:text-slate-300">
            {module.missionCopy?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-brand-primary dark:text-brand-primary-soft">
            <Icon className="size-5" name="sparkles" />
            <h2 className="font-display text-lg font-extrabold tracking-[-0.03em] text-brand-text dark:text-white">
              Check Point
            </h2>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-secondary dark:bg-emerald-500/15 dark:text-emerald-300">
            NFT reward
          </span>
        </div>
        <div className="grid gap-4 rounded-[2rem] bg-brand-surface-soft/90 p-5 shadow-float dark:bg-white/6">
          <p className="text-sm font-semibold text-brand-text dark:text-white">{module.question}</p>
          <div className="grid gap-3">
            {module.answers?.map((answer) => {
              const active = selectedAnswer === answer.id;

              return (
                <button
                  key={answer.id}
                  className={`flex w-full items-center justify-between gap-4 rounded-[1.4rem] bg-white px-4 py-4 text-left text-sm transition dark:bg-white/8 ${
                    active
                      ? "ring-2 ring-brand-primary text-brand-primary dark:text-brand-primary-soft"
                      : "text-brand-muted hover:bg-brand-primary-soft/35 dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                  disabled={isCompleted}
                  onClick={() => onSelectAnswer(module.id, answer.id)}
                  type="button"
                >
                  <span className="font-medium">{answer.text}</span>
                  {active ? <Icon className="size-5 shrink-0" name="check" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-bright px-5 py-4 font-display text-base font-extrabold text-white shadow-lg shadow-brand-primary/25 disabled:opacity-60"
          disabled={!isWalletConnected || isCompleted || isSubmitting}
          onClick={handleCompleteModule}
          type="button"
        >
          {isCompleted
            ? "Reward Already Claimed"
            : isSubmitting
              ? "Claiming Reward..."
              : "Complete Module & Claim Reward"}
          <Icon className="size-5" name="arrowRight" />
        </button>
        {!isWalletConnected ? (
          <p className="text-sm text-brand-muted dark:text-slate-300">
            Connect your wallet from the top bar to save this module and claim your reward.
          </p>
        ) : null}
      </div>
    </div>
  );
}
