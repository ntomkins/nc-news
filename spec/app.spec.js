process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const request = require('supertest');
const chaiSorted = require('chai-sorted');
chai.use(require('chai-things'));
chai.should();
chai.use(chaiSorted);

const app = require('../app');
const connection = require('../db/connection');

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => {
    connection.destroy();
  });
  after(() => connection.destroy());

  describe('/api', () => {
    it('GET status:200', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
  });

  describe('/topics', () => {
    it('GET returns status 200 & array of the topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({
            topics: [
              {
                description: 'The man, the Mitch, the legend',
                slug: 'mitch'
              },
              {
                description: 'Not dogs',
                slug: 'cats'
              },
              {
                description: 'what books are made of',
                slug: 'paper'
              }
            ]
          });
        });
    });
  });

  describe('/articles', () => {
    it('GET returns status 200 & array of the articles', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.eql({
            article_id: 1,
            author: 'butter_bridge',
            comment_count: '13',
            created_at: '2018-11-15T12:21:54.171Z',
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            votes: 100
          });
          expect(body.articles).to.be.descendingBy('created_at');
        });
    });
    it('takes a sort_by query and sorts by it', () => {
      return request(app)
        .get('/api/articles/?sorted_by=votes')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.descendingBy('votes');
        });
    });
    it('takes an order query and orders by it', () => {
      return request(app)
        .get('/api/articles/?order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.ascendingBy('created_at');
        });
    });
    it('can filter articles for a particular author', () => {
      return request(app)
        .get('/api/articles/?author=butter_bridge')
        .expect(200)
        .then(({ body }) => {
          body.articles.should.all.have.property('author', 'butter_bridge');
          expect(body.articles).to.have.length(3);
          expect(body.articles[0]).to.eql({
            article_id: 1,
            author: 'butter_bridge',
            comment_count: '13',
            created_at: '2018-11-15T12:21:54.171Z',
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            votes: 100
          });
        });
    });
    it('can filter articles for a particular topic', () => {
      return request(app)
        .get('/api/articles/?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          body.articles.should.all.have.property('topic', 'mitch');
          expect(body.articles).to.have.length(11);
          expect(body.articles[0]).to.eql({
            article_id: 1,
            author: 'butter_bridge',
            comment_count: '13',
            created_at: '2018-11-15T12:21:54.171Z',
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            votes: 100
          });
        });
    });
  });

  describe('/articles/:article_id', () => {
    it('GET returns status 200 & the article object requested', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            author: 'butter_bridge',
            topic: 'mitch',
            body: 'I find this existence challenging',
            votes: 100,
            created_at: '2018-11-15T12:21:54.171Z',
            comment_count: '13'
          });
        });
    });
    it('PATCH returns status 200 & returns modified article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 42 })
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle).to.eql([
            {
              article_id: 1,
              title: 'Living in the shadow of a great man',
              body: 'I find this existence challenging',
              votes: 142,
              topic: 'mitch',
              author: 'butter_bridge',
              created_at: '2018-11-15T12:21:54.171Z'
            }
          ]);
        });
    });
  });
  describe('/articles/:article_id/comments', () => {
    it('GET returns status 200 & an array of comments with the article_id given', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.articleComments).to.have.length(13);
        });
    });
  });
});
