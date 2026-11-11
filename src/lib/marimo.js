// Reads a marimo notebook (.py) into cells for the "Read the cells" view.
// This is a reading aid, not a Python parser: it relies on the layout marimo itself writes.

const indentOf = (line) => /^\s*/.exec(line)[0].length;

function dedent(lines) {
  const depth = Math.min(...lines.filter((l) => l.trim()).map(indentOf));
  return lines.map((l) => l.slice(depth));
}

export function parseNotebook(text) {
  // Notebooks saved on Windows use \r\n, which would break every line-based check below.
  const src = text
    .replace(/\r\n?/g, '\n')
    // The run-as-script footer is not a cell.
    .replace(/\nif __name__ == ["']__main__["']:[\s\S]*$/, '\n');
  const version = /__generated_with\s*=\s*"([^"]+)"/.exec(src)?.[1] ?? '';
  const cells = [];

  src
    .split(/\n(?=@app\.cell)/)
    .slice(1)
    .forEach((chunk, index) => {
      const decorator = chunk.split('\n')[0];
      const hidden = /hide_code\s*=\s*True/.test(decorator);
      const def = chunk.indexOf('\ndef ');
      if (def < 0) return;

      let body = chunk.slice(chunk.indexOf('\n', def + 1) + 1);
      let outputs = [];
      body = body.replace(/\n\s*return\s*\(?([^)\n]*)\)?\s*$/, (_, names) => {
        outputs = names
          .split(',')
          .map((n) => n.trim())
          .filter(Boolean);
        return '';
      });

      const code = dedent(body.replace(/\s+$/, '').split('\n')).join('\n');
      const markdown = /^mo\.md\(\s*r?(?:"""|''')([\s\S]*?)(?:"""|''')\s*\)\s*$/.exec(code.trim());
      if (markdown) {
        cells.push({ index, kind: 'markdown', hidden, source: dedent(markdown[1].split('\n')).join('\n').trim(), outputs: [] });
      } else {
        cells.push({ index, kind: 'code', hidden, source: code, outputs });
      }
    });

  return { version, cells };
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

/** The small subset of Markdown the notebooks use: headings, rules, tables, lists, paragraphs. */
export function renderMarkdown(text) {
  const lines = text.split('\n');
  const out = [];
  let i = 0;

  const take = (test, strip) => {
    const items = [];
    while (i < lines.length && test.test(lines[i])) {
      items.push(strip ? lines[i].replace(strip, '') : lines[i]);
      i++;
    }
    return items;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (/^\*\*\*+$|^---+$/.test(line.trim())) {
      out.push('<hr>');
      i++;
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length + 1; // the page already has an h1
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }
    if (/^\|/.test(line)) {
      const rows = take(/^\|/);
      const cellsOf = (row) =>
        row
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim());
      const head = cellsOf(rows[0]);
      const body = rows.slice(1).filter((row) => !/^\|\s*:?-+/.test(row));
      out.push(
        '<table><thead><tr>' +
          head.map((c) => `<th>${inline(c)}</th>`).join('') +
          '</tr></thead><tbody>' +
          body.map((row) => '<tr>' + cellsOf(row).map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') +
          '</tbody></table>',
      );
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items = take(/^\s*[-*]\s+/, /^\s*[-*]\s+/);
      out.push('<ul>' + items.map((item) => `<li>${inline(item)}</li>`).join('') + '</ul>');
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = take(/^\s*\d+\.\s+/, /^\s*\d+\.\s+/);
      out.push('<ol>' + items.map((item) => `<li>${inline(item)}</li>`).join('') + '</ol>');
      continue;
    }
    const paragraph = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#|\||\s*[-*]\s|\*\*\*|---)/.test(lines[i])) {
      paragraph.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }
  return out.join('\n');
}
