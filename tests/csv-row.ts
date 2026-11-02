// The public audit can emit either quoted or unquoted single-line CSV fields.
export function parseCsvRow(line: string) {
  const fields: string[] = [];
  let value = "", quoted = false, closed = false;
  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index++; }
      else if (quoted) { quoted = false; closed = true; }
      else if (!value && !closed) quoted = true;
      else throw new Error("Malformed CSV quote");
    } else if (char === "," && !quoted) { fields.push(value); value = ""; closed = false; }
    else if (closed || /[\r\n]/.test(char)) throw new Error("Malformed CSV field");
    else value += char;
  }
  if (quoted) throw new Error("Unclosed CSV quote");
  return [...fields, value];
}
