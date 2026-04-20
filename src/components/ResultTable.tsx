import type { ResultTable as ResultTableT } from "../data/analyses";

export default function ResultTable({ table }: { table: ResultTableT }) {
  const numCols = new Set(table.numCols ?? []);
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)]/60">
      <div className="px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted)] border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        Output
      </div>
      <div className="overflow-x-auto">
        <table className="result-table">
          <thead>
            <tr>
              {table.columns.map((c, i) => (
                <th key={c} className={numCols.has(i) ? "num" : ""}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className={numCols.has(ci) ? "num" : ""}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
