import { useState } from "react";
import { Check, Copy } from "lucide-react";

const KEYWORDS = new Set([
  "select",
  "from",
  "where",
  "group",
  "by",
  "order",
  "having",
  "join",
  "left",
  "right",
  "inner",
  "outer",
  "full",
  "cross",
  "on",
  "as",
  "with",
  "case",
  "when",
  "then",
  "else",
  "end",
  "and",
  "or",
  "not",
  "in",
  "is",
  "null",
  "asc",
  "desc",
  "limit",
  "distinct",
  "union",
  "all",
  "over",
  "partition",
  "between",
]);

const FUNCTIONS = new Set([
  "count",
  "sum",
  "avg",
  "min",
  "max",
  "round",
  "ntile",
  "row_number",
  "rank",
  "dense_rank",
  "lag",
  "lead",
  "coalesce",
  "nullif",
  "cast",
  "abs",
  "length",
  "upper",
  "lower",
  "substr",
  "date",
]);

type Token = { kind: string; text: string };

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = sql.length;

  while (i < n) {
    const ch = sql[i];

    // Single-line comment
    if (ch === "-" && sql[i + 1] === "-") {
      const end = sql.indexOf("\n", i);
      const stop = end === -1 ? n : end;
      tokens.push({ kind: "com", text: sql.slice(i, stop) });
      i = stop;
      continue;
    }

    // String literal
    if (ch === "'") {
      let j = i + 1;
      while (j < n && sql[j] !== "'") j++;
      tokens.push({ kind: "str", text: sql.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Number
    if (/\d/.test(ch)) {
      let j = i;
      while (j < n && /[\d.]/.test(sql[j])) j++;
      tokens.push({ kind: "num", text: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Word
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(sql[j])) j++;
      const text = sql.slice(i, j);
      const lower = text.toLowerCase();
      let kind = "id";
      if (KEYWORDS.has(lower)) kind = "kw";
      else if (FUNCTIONS.has(lower) && sql[j] === "(") kind = "fn";
      tokens.push({ kind, text });
      i = j;
      continue;
    }

    // Operators / punctuation
    if (/[+\-*/=<>!,;()]/.test(ch)) {
      tokens.push({ kind: "op", text: ch });
      i++;
      continue;
    }

    // Whitespace
    tokens.push({ kind: "ws", text: ch });
    i++;
  }

  return tokens;
}

export default function SqlBlock({ sql }: { sql: string }) {
  const [copied, setCopied] = useState(false);
  const tokens = tokenize(sql);

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(sql);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        }}
        className="press absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-2.5 py-1 text-[11px] uppercase tracking-wider text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy SQL"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" /> copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> copy
          </>
        )}
      </button>
      <pre className="sql-pre">
        <code>
          {tokens.map((t, idx) =>
            t.kind === "ws" || t.kind === "id" ? (
              <span key={idx}>{t.text}</span>
            ) : (
              <span key={idx} className={`tok-${t.kind}`}>
                {t.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
