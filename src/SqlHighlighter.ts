import c from 'ansi-colors';
import { Token, Tokenizer } from './Tokenizer';
import { TokenType, HighlightSubject, TOKEN_TYPE_TO_HIGHLIGHT } from './enums';

type Theme = { [key in HighlightSubject]?: c.StyleFunction };

export class SqlHighlighter {

  static readonly DEFAULT_THEME: Theme = {
    [HighlightSubject.QUOTE]: c.yellow,
    [HighlightSubject.BACKTICK_QUOTE]: c.yellow,
    [HighlightSubject.RESERVED]: c.white.bold,
    [HighlightSubject.BOUNDARY]: c.reset,
    [HighlightSubject.NUMBER]: c.green,
    [HighlightSubject.WORD]: undefined,
    [HighlightSubject.COMMENT]: c.green.dim,
    [HighlightSubject.VARIABLE]: c.yellow,
    [HighlightSubject.FUNCTIONS]: c.green.bold,
    [HighlightSubject.BUILT_IN]: c.cyan,
    [HighlightSubject.LITERAL]: c.cyan,
    [HighlightSubject.WHITESPACE]: undefined,
    [HighlightSubject.ERROR]: undefined,
  };

  private readonly tokenizer = new Tokenizer();

  constructor(private readonly theme: Theme = {}) {
    this.theme = { ...SqlHighlighter.DEFAULT_THEME, ...this.theme };
  }

  /**
   * Add syntax highlighting to a SQL string
   */
  highlight(sql: string): string {
    const tokens = this.tokenizer.tokenize(sql);
    let token: Token | undefined;
    let ret = '';
    let position = 0;

    // eslint-disable-next-line no-cond-assign
    while (token = tokens[position++]) {
      ret += this.highlightToken(token.type, token.value);
    }

    return ret;
  }

  private highlightToken(type: TokenType, value: string): string {
    if (type === TokenType.BOUNDARY && ['(', ')'].includes(value)) {
      return value;
    }

    return this.colorize(type, value);
  }

  private colorize(type: TokenType, value: string): string {
    const subject = TOKEN_TYPE_TO_HIGHLIGHT[type];
    if (!subject) {
      return value;
    }
    const fct = this.theme[subject];
    if (!fct) {
      return value;
    }
    return fct(value);
  }

}
