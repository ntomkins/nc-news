const { expect } = require('chai');
const {
  timeToDate,
  createRef,
  refArray,
  renameKey
} = require('../utils/seed-utils.js');

describe('timeToDate()', () => {
  it('takes an array, returns a new array with created_at formated to a time string', () => {
    const article = [
      {
        title: 'Living in the shadow of a great man',
        created_at: 1542284514171
      }
    ];
    const newDate = String(timeToDate(article).created_at);
    expect(timeToDate(article)).to.eql([
      {
        title: 'Living in the shadow of a great man',
        created_at: 'Thu, 15 Nov 2018 12:21:54 GMT'
      }
    ]);
  });
});

describe('renameKey()', () => {
  it('returns a new array', () => {
    const arr = [];
    expect(renameKey(arr, 'created_by', 'author')).to.not.equal(arr);
  });
  it('returns array with objects with a key name changed', () => {
    const arr = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(renameKey(arr, 'created_by', 'author')).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        author: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
});

describe('create ref', () => {
  it('takes an array, returns an object', () => {
    const article = [];
    expect(createRef(article, 'title', 'article_id')).to.eql({});
  });
  it('creates a reference object relating title to id', () => {
    const article = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
        article_id: 1
      }
    ];
    const articles = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
        article_id: 1
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171,
        article_id: 2
      }
    ];
    expect(createRef(article, 'title', 'article_id')).to.eql({
      'Living in the shadow of a great man': 1
    });

    expect(createRef(articles, 'title', 'article_id')).to.eql({
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2
    });
  });
});

describe('refArray()', () => {
  const arr = [];
  it('returns a new array', () => {
    expect(refArray(arr, {}, 'belongs_to', 'article_id')).to.not.equal(arr);
    expect(refArray(arr, {}, 'belongs_to', 'article_id')).to.eql([]);
  });
  const arr2 = [
    {
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge'
    },
    {
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge'
    }
  ];
  objRef = {
    "They're not exactly dogs, are they?": 1,
    'Living in the shadow of a great man': 2
  };
  it('returns a new array with key changed to an ID using a reference object', () => {
    expect(refArray(arr, objRef, 'belongs_to', 'article_id')).to.not.equal([
      {
        article_id: 1,
        created_by: 'butter_bridge'
      },
      {
        article_id: 2,
        created_by: 'butter_bridge'
      }
    ]);
  });
});
