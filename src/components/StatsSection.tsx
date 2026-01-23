import { StatCard } from './StatCard';

export const StatsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard value="1500" label="Membros Ativos" suffix="+" />
          <StatCard value="10000" label="Créditos gerados/min" suffix="+" />
          <StatCard value="100" label="Satisfação" suffix="%" />
        </div>
      </div>
    </section>
  );
};
