const { describe, it } = require('node:test');
const assert = require('node:assert');
const { extractHashtags } = require('../../src/routes/posts');

describe('extractHashtags', () => {
  it('should extract hashtags from text', () => {
    const tags = extractHashtags('Hello #world #coding');
    assert.deepStrictEqual(tags, ['world', 'coding']);
  });

  it('should return empty array when no hashtags', () => {
    const tags = extractHashtags('Hello world, no tags here');
    assert.deepStrictEqual(tags, []);
  });

  it('should normalize hashtags to lowercase', () => {
    const tags = extractHashtags('#JavaScript #REACT #nodeJS');
    assert.deepStrictEqual(tags, ['javascript', 'react', 'nodejs']);
  });

  it('should handle hashtags at start and end of text', () => {
    const tags = extractHashtags('#start middle #end');
    assert.deepStrictEqual(tags, ['start', 'end']);
  });

  it('should handle text with only a hashtag', () => {
    const tags = extractHashtags('#solo');
    assert.deepStrictEqual(tags, ['solo']);
  });
});
