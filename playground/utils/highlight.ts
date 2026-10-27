// Resaltado mínimo para SFC de Vue, TS y CSS. Evita añadir dependencias al
// playground: solo distingue los tokens que aportan lectura al ejemplo.
export type CodeLanguage = "vue" | "ts" | "css" | "bash";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const wrap = (kind: string, value: string) =>
  `<span class="tok-${kind}">${escapeHtml(value)}</span>`;

const scriptRules: Array<[RegExp, string | null]> = [
  [/^\/\/[^\n]*/, "comment"],
  [/^\/\*[\s\S]*?\*\//, "comment"],
  [/^(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/, "string"],
  [
    /^\b(?:import|from|export|default|const|let|var|function|return|if|else|for|of|in|new|type|interface|as|async|await|true|false|null|undefined)\b/,
    "keyword",
  ],
  [/^\b\d+(?:\.\d+)?\b/, "number"],
  [/^[A-Za-z_$][\w$]*(?=\s*\()/, "function"],
  [/^[A-Za-z_$][\w$]*/, null],
  [/^\s+/, null],
  [/^[\s\S]/, null],
];

function highlightScript(code: string) {
  let output = "";
  let rest = code;
  while (rest) {
    for (const [pattern, kind] of scriptRules) {
      const match = rest.match(pattern);
      if (!match) continue;
      output += kind ? wrap(kind, match[0]) : escapeHtml(match[0]);
      rest = rest.slice(match[0].length);
      break;
    }
  }
  return output;
}

function highlightCss(code: string) {
  return code
    .split(/(\/\*[\s\S]*?\*\/|[^{}]+\{|[\w-]+(?=\s*:)|\})/)
    .map((part) => {
      if (!part) return "";
      if (part.startsWith("/*")) return wrap("comment", part);
      if (part.endsWith("{"))
        return wrap("tag", part.slice(0, -1)) + escapeHtml("{");
      if (/^[\w-]+$/.test(part)) return wrap("attr", part);
      return escapeHtml(part);
    })
    .join("");
}

function highlightTag(tag: string) {
  const match = tag.match(/^(<\/?)([\w-]+)([\s\S]*?)(\/?>)$/);
  if (!match) return escapeHtml(tag);
  const [, open, name, attrs, close] = match;
  const highlightedAttrs = attrs.replace(
    /([:@#]?[\w.:-]+)(?:(\s*=\s*)("[^"]*"|'[^']*'))?|([^\w:@#]+)/g,
    (_all, attr, equals, value, other) => {
      if (other) return escapeHtml(other);
      let result = wrap("attr", attr);
      if (equals) result += escapeHtml(equals) + wrap("string", value);
      return result;
    },
  );
  return (
    wrap("punct", open) +
    wrap("tag", name) +
    highlightedAttrs +
    wrap("punct", close)
  );
}

function highlightTemplate(code: string) {
  return code
    .split(/(<!--[\s\S]*?-->|<\/?[\w-]+(?:\s[^<>]*?)?\/?>|\{\{[\s\S]*?\}\})/)
    .map((part) => {
      if (!part) return "";
      if (part.startsWith("<!--")) return wrap("comment", part);
      if (part.startsWith("{{")) return wrap("interp", part);
      if (part.startsWith("<")) return highlightTag(part);
      return escapeHtml(part);
    })
    .join("");
}

function highlightVue(code: string) {
  return code
    .split(
      /(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)/,
    )
    .map((part) => {
      const block = part.match(/^(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2>)$/);
      if (!block) return highlightTemplate(part);
      const [, open, kind, body, close] = block;
      return (
        highlightTag(open) +
        (kind === "script" ? highlightScript(body) : highlightCss(body)) +
        highlightTag(close)
      );
    })
    .join("");
}

function highlightBash(code: string) {
  return code
    .split("\n")
    .map((line) =>
      line.startsWith("#")
        ? wrap("comment", line)
        : line.replace(
            /^(\S+)(.*)$/,
            (_all, command: string, rest: string) =>
              wrap("keyword", command) + escapeHtml(rest),
          ),
    )
    .join("\n");
}

export function highlight(code: string, language: CodeLanguage) {
  if (language === "ts") return highlightScript(code);
  if (language === "css") return highlightCss(code);
  if (language === "bash") return highlightBash(code);
  return highlightVue(code);
}
