import { TokenType } from './enums';

export interface Token {
  readonly type: number;
  readonly value: string;
}

export class Tokenizer {

  private readonly literal = ['true', 'false', 'null', 'unknown'];

  private readonly builtIn = [
    'array', 'bigint', 'binary', 'bit', 'blob', 'bool', 'boolean', 'char', 'character', 'date', 'dec', 'decimal', 'float', 'int', 'int8', 'integer', 'interval',
    'number', 'numeric', 'real', 'record', 'serial', 'serial8', 'smallint', 'text', 'time', 'timestamp', 'tinyint', 'varchar', 'varchar2', 'varying', 'void',
  ];

  private readonly reserved = [
    'accessible',
    'action',
    'after',
    'against',
    'aggregate',
    'algorithm',
    'all',
    'alter',
    'analyse',
    'analyze',
    'as',
    'asc',
    'autocommit',
    'auto_increment',
    'backup',
    'begin',
    'between',
    'binlog',
    'both',
    'cascade',
    'case',
    'change',
    'changed',
    'character set',
    'charset',
    'check',
    'checksum',
    'collate',
    'collation',
    'column',
    'columns',
    'comment',
    'commit',
    'committed',
    'compressed',
    'concurrent',
    'constraint',
    'contains',
    'convert',
    'create',
    'cross',
    'current_timestamp',
    'database',
    'databases',
    'day',
    'day_hour',
    'day_minute',
    'day_second',
    'default',
    'definer',
    'delayed',
    'delete',
    'desc',
    'describe',
    'deterministic',
    'distinct',
    'distinctrow',
    'div',
    'do',
    'dumpfile',
    'duplicate',
    'dynamic',
    'else',
    'enclosed',
    'end',
    'engine',
    'engine_type',
    'engines',
    'escape',
    'escaped',
    'events',
    'exec',
    'execute',
    'exists',
    'explain',
    'extended',
    'fast',
    'fields',
    'file',
    'first',
    'fixed',
    'flush',
    'for',
    'force',
    'foreign',
    'full',
    'fulltext',
    'function',
    'global',
    'grant',
    'grants',
    'group_concat',
    'heap',
    'high_priority',
    'hosts',
    'hour',
    'hour_minute',
    'hour_second',
    'identified',
    'if',
    'ifnull',
    'ignore',
    'in',
    'index',
    'indexes',
    'infile',
    'insert',
    'insert_id',
    'insert_method',
    'interval',
    'into',
    'invoker',
    'is',
    'isolation',
    'key',
    'keys',
    'kill',
    'last_insert_id',
    'leading',
    'level',
    'like',
    'linear',
    'lines',
    'load',
    'local',
    'lock',
    'locks',
    'logs',
    'low_priority',
    'maria',
    'master',
    'master_connect_retry',
    'master_host',
    'master_log_file',
    'match',
    'max_connections_per_hour',
    'max_queries_per_hour',
    'max_rows',
    'max_updates_per_hour',
    'max_user_connections',
    'medium',
    'merge',
    'minute',
    'minute_second',
    'min_rows',
    'mode',
    'month',
    'mrg_myisam',
    'myisam',
    'names',
    'natural',
    'not',
    'now()',
    'null',
    'offset',
    'on',
    'open',
    'optimize',
    'option',
    'optionally',
    'on update',
    'on delete',
    'outfile',
    'pack_keys',
    'page',
    'partial',
    'partition',
    'partitions',
    'password',
    'primary',
    'privileges',
    'procedure',
    'process',
    'processlist',
    'purge',
    'quick',
    'range',
    'raid0',
    'raid_chunks',
    'raid_chunksize',
    'raid_type',
    'read',
    'read_only',
    'read_write',
    'references',
    'regexp',
    'reload',
    'rename',
    'repair',
    'repeatable',
    'replace',
    'replication',
    'reset',
    'restore',
    'restrict',
    'return',
    'returns',
    'revoke',
    'rlike',
    'rollback',
    'row',
    'rows',
    'row_format',
    'second',
    'security',
    'separator',
    'serializable',
    'session',
    'share',
    'show',
    'shutdown',
    'slave',
    'soname',
    'sounds',
    'sql',
    'sql_auto_is_null',
    'sql_big_result',
    'sql_big_selects',
    'sql_big_tables',
    'sql_buffer_result',
    'sql_calc_found_rows',
    'sql_log_bin',
    'sql_log_off',
    'sql_log_update',
    'sql_low_priority_updates',
    'sql_max_join_size',
    'sql_quote_show_create',
    'sql_safe_updates',
    'sql_select_limit',
    'sql_slave_skip_counter',
    'sql_small_result',
    'sql_warnings',
    'sql_cache',
    'sql_no_cache',
    'start',
    'starting',
    'status',
    'stop',
    'storage',
    'straight_join',
    'string',
    'striped',
    'super',
    'table',
    'tables',
    'temporary',
    'terminated',
    'then',
    'to',
    'trailing',
    'transactional',
    'true',
    'truncate',
    'type',
    'types',
    'uncommitted',
    'unique',
    'unlock',
    'unsigned',
    'usage',
    'use',
    'using',
    'variables',
    'view',
    'when',
    'with',
    'work',
    'write',
    'year_month',
  ];

  private readonly reservedToplevel = [
    'select',
    'from',
    'where',
    'set',
    'order by',
    'group by',
    'limit',
    'drop',
    'values',
    'update',
    'having',
    'add',
    'change',
    'modify',
    'alter table',
    'delete from',
    'union all',
    'union',
    'except',
    'intersect',
  ];

  private readonly reservedNewline = [
    'left outer join',
    'right outer join',
    'left join',
    'right join',
    'outer join',
    'inner join',
    'join',
    'xor',
    'or',
    'and',
  ];

  private readonly functions = [
    'abs',
    'acos',
    'adddate',
    'addtime',
    'aes_decrypt',
    'aes_encrypt',
    'area',
    'asbinary',
    'ascii',
    'asin',
    'astext',
    'atan',
    'atan2',
    'avg',
    'bdmpolyfromtext',
    'bdmpolyfromwkb',
    'bdpolyfromtext',
    'bdpolyfromwkb',
    'benchmark',
    'bin',
    'bit_and',
    'bit_count',
    'bit_length',
    'bit_or',
    'bit_xor',
    'boundary',
    'buffer',
    'cast',
    'ceil',
    'ceiling',
    'centroid',
    'char',
    'character_length',
    'charset',
    'char_length',
    'coalesce',
    'coercibility',
    'collation',
    'compress',
    'concat',
    'concat_ws',
    'connection_id',
    'contains',
    'conv',
    'convert',
    'convert_tz',
    'convexhull',
    'cos',
    'cot',
    'count',
    'crc32',
    'crosses',
    'curdate',
    'current_date',
    'current_time',
    'current_timestamp',
    'current_user',
    'curtime',
    'database',
    'date',
    'datediff',
    'date_add',
    'date_diff',
    'date_format',
    'date_sub',
    'day',
    'dayname',
    'dayofmonth',
    'dayofweek',
    'dayofyear',
    'decode',
    'default',
    'degrees',
    'des_decrypt',
    'des_encrypt',
    'difference',
    'dimension',
    'disjoint',
    'distance',
    'elt',
    'encode',
    'encrypt',
    'endpoint',
    'envelope',
    'equals',
    'exp',
    'export_set',
    'exteriorring',
    'extract',
    'extractvalue',
    'field',
    'find_in_set',
    'floor',
    'format',
    'found_rows',
    'from_days',
    'from_unixtime',
    'geomcollfromtext',
    'geomcollfromwkb',
    'geometrycollection',
    'geometrycollectionfromtext',
    'geometrycollectionfromwkb',
    'geometryfromtext',
    'geometryfromwkb',
    'geometryn',
    'geometrytype',
    'geomfromtext',
    'geomfromwkb',
    'get_format',
    'get_lock',
    'glength',
    'greatest',
    'group_concat',
    'group_unique_users',
    'hex',
    'hour',
    'if',
    'ifnull',
    'inet_aton',
    'inet_ntoa',
    'insert',
    'instr',
    'interiorringn',
    'intersection',
    'intersects',
    'interval',
    'isclosed',
    'isempty',
    'isnull',
    'isring',
    'issimple',
    'is_free_lock',
    'is_used_lock',
    'last_day',
    'last_insert_id',
    'lcase',
    'least',
    'left',
    'length',
    'linefromtext',
    'linefromwkb',
    'linestring',
    'linestringfromtext',
    'linestringfromwkb',
    'ln',
    'load_file',
    'localtime',
    'localtimestamp',
    'locate',
    'log',
    'log10',
    'log2',
    'lower',
    'lpad',
    'ltrim',
    'makedate',
    'maketime',
    'make_set',
    'master_pos_wait',
    'max',
    'mbrcontains',
    'mbrdisjoint',
    'mbrequal',
    'mbrintersects',
    'mbroverlaps',
    'mbrtouches',
    'mbrwithin',
    'md5',
    'microsecond',
    'mid',
    'min',
    'minute',
    'mlinefromtext',
    'mlinefromwkb',
    'mod',
    'month',
    'monthname',
    'mpointfromtext',
    'mpointfromwkb',
    'mpolyfromtext',
    'mpolyfromwkb',
    'multilinestring',
    'multilinestringfromtext',
    'multilinestringfromwkb',
    'multipoint',
    'multipointfromtext',
    'multipointfromwkb',
    'multipolygon',
    'multipolygonfromtext',
    'multipolygonfromwkb',
    'name_const',
    'nullif',
    'numgeometries',
    'numinteriorrings',
    'numpoints',
    'oct',
    'octet_length',
    'old_password',
    'ord',
    'overlaps',
    'password',
    'period_add',
    'period_diff',
    'pi',
    'point',
    'pointfromtext',
    'pointfromwkb',
    'pointn',
    'pointonsurface',
    'polyfromtext',
    'polyfromwkb',
    'polygon',
    'polygonfromtext',
    'polygonfromwkb',
    'position',
    'pow',
    'power',
    'quarter',
    'quote',
    'radians',
    'rand',
    'related',
    'release_lock',
    'repeat',
    'replace',
    'reverse',
    'right',
    'round',
    'row_count',
    'rpad',
    'rtrim',
    'schema',
    'second',
    'sec_to_time',
    'session_user',
    'sha',
    'sha1',
    'sign',
    'sin',
    'sleep',
    'soundex',
    'space',
    'sqrt',
    'srid',
    'startpoint',
    'std',
    'stddev',
    'stddev_pop',
    'stddev_samp',
    'strcmp',
    'str_to_date',
    'subdate',
    'substr',
    'substring',
    'substring_index',
    'subtime',
    'sum',
    'symdifference',
    'sysdate',
    'system_user',
    'tan',
    'time',
    'timediff',
    'timestamp',
    'timestampadd',
    'timestampdiff',
    'time_format',
    'time_to_sec',
    'touches',
    'to_days',
    'trim',
    'truncate',
    'ucase',
    'uncompress',
    'uncompressed_length',
    'unhex',
    'unique_users',
    'unix_timestamp',
    'updatexml',
    'upper',
    'user',
    'utc_date',
    'utc_time',
    'utc_timestamp',
    'uuid',
    'variance',
    'var_pop',
    'var_samp',
    'version',
    'week',
    'weekday',
    'weekofyear',
    'within',
    'x',
    'y',
    'year',
    'yearweek',
  ];

  /** Punctuation that can be used as a boundary between other tokens */
  private readonly boundaries = [',', ';', ':', ')', '(', '.', '=', '<', '>', '+', '-', '*', '/', '!', '^', '%', '|', '&', '#'];

  // Regular expressions for tokenizing
  private readonly regexBoundaries = '(' + this.quoteRegex(this.boundaries).join('|') + ')';
  private readonly regexReserved = '(' + this.quoteRegex(this.reserved).join('|') + ')';
  private readonly regexReservedToplevel = `(${this.quoteRegex(this.reservedToplevel).join('|')})`.replace(/ /g, '\\s+');
  private readonly regexReservedNewline = `(${this.quoteRegex(this.reservedNewline).join('|')})`.replace(/ /g, '\\s+');
  private readonly regexFunction = '(' + this.quoteRegex(this.functions).join('|') + ')';
  private readonly regexLiteral = '(' + this.quoteRegex(this.literal).join('|') + ')';
  private readonly regexBuiltIn = '(' + this.quoteRegex(this.builtIn).join('|') + ')';

  /**
   * Takes an SQL string and breaks it into tokens.
   */
  tokenize(string: string): Token[] {
    const tokens: Token[] = [];

    // Used to make sure the string keeps shrinking on each iteration
    let oldStringLen = string.length + 1;
    let token: Token | undefined;
    let currentLength = string.length;

    // Keep processing the string until it is empty
    while (currentLength) {
      // If the string stopped shrinking, there was a problem
      if (oldStringLen <= currentLength) {
        tokens.push({ type: TokenType.ERROR, value: string });
        return tokens;
      }

      oldStringLen = currentLength;

      // Get the next token and the token type
      token = this.createNextToken(string, token);
      const tokenLength = token.value.length;
      tokens.push(token);

      // Advance the string
      string = string.substr(tokenLength);
      currentLength -= tokenLength;
    }

    return tokens;
  }

  /**
   * Return the next token and token type in an SQL string.
   * Quoted strings, comments, reserved words, whitespace, and punctuation are all their own tokens.
   */
  private createNextToken(str: string, previous?: Token): Token {
    let match: RegExpMatchArray | null;

    // Whitespace
    match = str.match(/^\s+/);

    if (match) {
      return { type: TokenType.WHITESPACE, value: match[0] };
    }

    // Comment
    if (str[0] === '#' || (str[1] && (str[0] === '-' && str[1] === '-') || (str[1] && str[0] === '/' && str[1] === '*'))) {
      let type: number;
      let last: number;

      // Comment until end of line
      if (str[0] === '-' || str[0] === '#') {
        last = str.indexOf('\n');
        type = TokenType.COMMENT;
      } else { // Comment until closing comment tag
        last = str.indexOf('*/', 2) + 2;
        type = TokenType.BLOCK_COMMENT;
      }

      if (last === -1) {
        last = str.length;
      }

      return { type, value: str.substr(0, last) };
    }

    // Quoted String
    if (['"', '\'', '`', '['].includes(str[0])) {
      const type = str[0] === '`' || str[0] === '[' ? TokenType.BACKTICK_QUOTE : TokenType.QUOTE;
      return { type, value: this.getQuotedString(str) };
    }

    // User-defined Variable
    if ((str[0] === '@' || str[0] === ':') && str[1]) {
      // If the variable name is quoted
      if (['"', '\'', '`'].includes(str[1])) {
        const value = str[0] + this.getQuotedString(str.substr(1));
        return { type: TokenType.VARIABLE, value };
      }

      // Non-quoted variable name
      match = new RegExp(`^(${str[0]}[a-zA-Z0-9._$]+)`).exec(str);

      if (match) {
        return { type: TokenType.VARIABLE, value: match[1] };
      }
    }

    // Number (decimal, binary, or hex)
    match = new RegExp(`^([0-9]+(.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)($|\\s|"'\`|${this.regexBoundaries})`).exec(str);

    if (match) {
      return { type: TokenType.NUMBER, value: match[1] };
    }

    // Boundary Character (punctuation and symbols)
    match = new RegExp(`^(${this.regexBoundaries})`).exec(str);

    if (match) {
      return { type: TokenType.BOUNDARY, value: match[1] };
    }

    const lower = str.toLowerCase();

    // A reserved word cannot be preceded by a '.'
    // this makes it so in "mytable.from", "from" is not considered a reserved word
    if (!previous || previous.value !== '.') {
      match = new RegExp(`^(${this.regexReservedToplevel})($|\\s|${this.regexBoundaries})`).exec(lower);

      // Top Level Reserved Word
      if (match) {
        return { type: TokenType.RESERVED_TOPLEVEL, value: str.substr(0, match[1].length) };
      }

      // Newline Reserved Word
      match = new RegExp(`^(${this.regexReservedNewline})($|\\s|${this.regexBoundaries})`).exec(lower);

      if (match) {
        return { type: TokenType.RESERVED_NEWLINE, value: str.substr(0, match[1].length) };
      }

      // literal
      match = new RegExp(`^(${this.regexLiteral})($|\\s|${this.regexBoundaries})`).exec(lower);

      if (match) {
        return { type: TokenType.LITERAL, value: str.substr(0, match[1].length) };
      }

      // built in
      match = new RegExp(`^(${this.regexBuiltIn})($|\\s|${this.regexBoundaries})`).exec(lower);

      if (match) {
        return { type: TokenType.BUILT_IN, value: str.substr(0, match[1].length) };
      }

      // Other Reserved Word
      match = new RegExp(`^(${this.regexReserved})($|\\s|${this.regexBoundaries})`).exec(lower);

      if (match) {
        return { type: TokenType.RESERVED, value: str.substr(0, match[1].length) };
      }
    }

    // A function must be succeeded by '(', this makes it so "count(" is considered a function, but "count" alone is not
    match = new RegExp(`^(${this.regexFunction}[(]|\\s|[)])`).exec(lower);

    if (match) {
      return { type: TokenType.RESERVED, value: str.substr(0, match[1].length - 1) };
    }

    // Non reserved word
    match = new RegExp(`^(.*?)($|\\s|["'\`]|${this.regexBoundaries})`).exec(str);

    return { type: TokenType.WORD, value: match![1] };
  }

  /**
   * Helper function for building regular expressions for reserved words and boundary characters
   */
  private quoteRegex(strings: string[]): string[] {
    return strings.map(str => str.replace(new RegExp(`[.\\\\+*?\\[^\\]$(){}=!<>|:\\${'/'}-]`, 'g'), '\\$&'));
  }

  private getQuotedString(string: string): string {
    const re = '^(((`[^`]*($|`))+)|'                    // backtick quoted string using `` to escape
      + '((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)|'    // square bracket quoted string (SQL Server) using ]] to escape
      + '(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)|'      // double quoted string using "" or \" to escape
      + '((\'[^\'\\\\]*(?:\\\\.[^\'\\\\]*)*(\'|$))+))'; // single quoted string using '' or \' to escape
    const m = new RegExp(re, 's').exec(string);

    return m?.[1] ?? '';
  }

}
