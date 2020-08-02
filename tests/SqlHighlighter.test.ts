import { SqlHighlighter } from '../src';
import { readFileSync } from "fs";

describe('SqlHighlighter', () => {

  const highlighter = new SqlHighlighter();

  test('highlights SQL', async () => {
    const sql = readFileSync(__dirname + '/test.sql').toString().split('\n---\n').map(s => s.trim());

    for (const str of sql) {
      const s = highlighter.highlight(str);
      expect(s).toMatchSnapshot(str);
    }
  });

});
