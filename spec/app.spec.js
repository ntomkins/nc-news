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

describe.only('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => {
    connection.destroy();
  });
  after(() => connection.destroy());
  it('ERROR status:404 with invalid route', () => {
    return request(app)
      .get('/api/pets')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.eql('Route Not Found');
      });
  });

  describe('/api', () => {
    it('GET status:200', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    it('ERROR status:405 with invalid method request', () => {
      return request(app)
        .put('/api')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.eql('Method Not Allowed');
        });
    });
  });

  describe('/topics', () => {
    it('GET status:200, sends array of the topics', () => {
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
    it('ERROR status:405 with invalid method request', () => {
      return request(app)
        .put('/api/topics')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.eql('Method Not Allowed');
        });
    });
  });

  describe('/articles', () => {
    it('GET status:200, sends array of the articles', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
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
    it('GET status:200, takes a sort_by query and sorts by it', () => {
      return request(app)
        .get('/api/articles?sorted_by=votes')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.descendingBy('votes');
        });
    });
    it('GET status:200, takes an order query and orders by it', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.ascendingBy('created_at');
        });
    });
    it('GET status:200, can filter articles for a particular author', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then(({ body }) => {
          body.articles.should.all.have.property('author', 'butter_bridge');
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
    it('GET status:200, can filter articles for a particular topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          body.articles.should.all.have.property('topic', 'mitch');
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
    it('GET status:200, can limit results per page to a query limit', () => {
      return request(app)
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(5);
        });
    });
    it('GET status:200, shows results for a page number, defaults to 1', () => {
      return request(app)
        .get('/api/articles?p=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.eql({
            article_id: 11,
            title: 'Am I a cat?',
            author: 'icellusedkars',
            topic: 'mitch',
            votes: 0,
            created_at: '1978-11-25T12:21:54.171Z',
            comment_count: '0'
          });
        });
    });
    it('GET status:200, sends a total_count of all articles', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).to.eql(12);
        });
    });
    it('GET status:200, sends a total_count of all articles with query topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).to.eql(11);
        });
    });
    it('GET status:200, sends a total_count of all articles with query author', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).to.eql(3);
        });
    });
    it('ERROR status:405 with invalid method request', () => {
      return request(app)
        .put('/api/articles')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.eql('Method Not Allowed');
        });
    });
    it('ERROR status:400 when trying to sort by something that does not exist', () => {
      return request(app)
        .get('/api/articles?sort_by=pets')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql('querry input does not exist');
        });
    });
    it('ERROR status:400 when trying to order by something other than asc or desc', () => {
      return request(app)
        .get('/api/articles?order=random')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql('must order by asc or desc');
        });
    });
    it('ERROR status:400 when trying to filter results by author with one that does not exist', () => {
      return request(app)
        .get('/api/articles?author=tolkien')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('author does not exist');
        });
    });
    it('GET status:200, empty array for articles for users with no articles', () => {
      return request(app)
        .get('/api/articles?author=lurker')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.eql([]);
        });
    });
    it('ERROR status:404, when topic is querried when it does not exist', () => {
      return request(app)
        .get('/api/articles?topic=pineapples')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('topic does not exist');
        });
    });
  });

  describe('/articles/:article_id', () => {
    it('GET status:200 & the article object requested', () => {
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
    it('PATCH status:200, returns patched article, add or subtracts inc_votes from article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 42 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 142,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: '2018-11-15T12:21:54.171Z'
          });
        });
    });
    it('ERROR status:405 method not allowed', () => {
      return request(app)
        .put('/api/articles/1')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.eql('Method Not Allowed');
        });
    });
    it('ERROR status:404 when no article is found for the given article_id', () => {
      return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('No article found for article_id: 999');
        });
    });
    it('ERROR status:404 when no article is found for the given article_id', () => {
      return request(app)
        .patch('/api/articles/999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('article not found');
        });
    });
    it('ERROR status:400 when incorrect article_id syntax is used', () => {
      return request(app)
        .get('/api/articles/Moustache')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql('id must be type integer');
        });
    });
    it('ERROR status:400, returns error when no inc_votes on body', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ pineapples: 42 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('request must include inc_votes');
        });
    });
    it('ERROR status:400, returns error when no inc_votes on body', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 42, pineapples: 42 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('request must only include inc_votes');
        });
    });
    it('ERROR status:400, returns error when no inc_votes on body', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: '42' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('inc_votes must be an integer');
        });
    });
  });

  describe('/articles/:article_id/comments', () => {
    it('GET status:200 an array of comments sent for the article_id given', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(10);
          expect(body.comments).to.be.descendingBy('created_at');
        });
    });
    it('GET status:200 & sorted by the query sorted_by', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=votes')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy('votes');
        });
    });
    it('GET status:200 & ordered by the query order', () => {
      return request(app)
        .get('/api/articles/1/comments?order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.ascendingBy('created_at');
        });
    });
    it('GET status:200, can limit results per page to a query limit', () => {
      return request(app)
        .get('/api/articles/1/comments?limit=5')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(5);
        });
    });
    it('GET status:200, shows results for a page number, defaults to 1', () => {
      return request(app)
        .get('/api/articles/1/comments?p=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy('created_at');
          expect(body.comments[0]).to.eql({
            comment_id: 12,
            votes: 0,
            created_at: '2006-11-25T12:36:03.389Z',
            author: 'icellusedkars',
            body: 'Massive intercranial brain haemorrhage'
          });
        });
    });
    it('GET status:200, shows results for a page number, defaults to 1', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).to.eql(13);
        });
    });
    it('POST status:201 & returns the added comment', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ username: 'butter_bridge', body: 'this is a comment body' })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.comment_id).to.equal(19);
          expect(body.comment.author).to.equal('butter_bridge');
          expect(body.comment.article_id).to.equal(1);
          expect(body.comment.votes).to.equal(0);
          expect(body.comment.body).to.equal('this is a comment body');
          expect(body.comment).to.haveOwnProperty('created_at');
        });
    });
    it('ERROR status:400, invalid article_id', () => {
      return request(app)
        .get('/api/articles/cat/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql('id must be type integer');
        });
    });
    it('ERROR status:404, article not found', () => {
      return request(app)
        .get('/api/articles/9000/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('article not found');
        });
    });
    it('ERROR status:200, article not found', () => {
      return request(app)
        .get('/api/articles/9000/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('article not found');
        });
    });
    it('ERROR status:400 rejects when user does not send a username and body', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({
          pineapples: 'butter_bridge',
          oranges: 'this is a comment body'
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('comment must contain a username and body');
        });
    });
    it('ERROR status:400 rejects when user does not send username and body with the correct syntax', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({
          username: 'butter_bridge',
          body: 'this is a comment body',
          picture: 'picture.jpg'
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal(
            'request must only include a username and body'
          );
        });
    });
    it('ERROR status:400 rejects when user does not send username and body with the correct syntax', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({
          username: 1234,
          body: false
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('comment and username must be text');
        });
    });
    it('ERROR status:404, article not found when trying to post to article with no id', () => {
      return request(app)
        .post('/api/articles/999/comments')
        .send({
          username: 'butter_bridge',
          body: 'this is a comment body'
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('article not found');
        });
    });
  });

  describe('/comments/:comment_id', () => {
    it('PATCH status:200, returns patched comment, add or subtracts inc_votes from comment', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 42 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.eql({
            comment_id: 1,
            author: 'butter_bridge',
            article_id: 9,
            votes: 58,
            created_at: '2017-11-22T12:36:03.389Z',
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          });
        });
    });
    it('DELETE status:204, no content', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({ body }) => {
          expect(body).to.eql({});
        });
    });
    it('ERROR status:405 with invalid method request', () => {
      return request(app)
        .put('/api/comments/1')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.eql('Method Not Allowed');
        });
    });
    it('ERROR status:400 with invalid comment_id input', () => {
      return request(app)
        .patch('/api/comments/two')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql('id must be type integer');
        });
    });
    it('ERROR status:404 when comment_id does not exist', () => {
      return request(app)
        .patch('/api/comments/999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('comment not found');
        });
    });
    it('ERROR status:400, returns error when no inc_votes on body', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ pineapples: 42 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('request must include inc_votes');
        });
    });
    it('ERROR status:400, returns error when no inc_votes on body', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 42, pineapples: 42 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('request must only include inc_votes');
        });
    });
    it('ERROR status:400, returns error when no inc_votes on body', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: '42' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('inc_votes must be an integer');
        });
    });
    it('ERROR status:404, comment not found', () => {
      return request(app)
        .delete('/api/comments/99')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('comment not found');
        });
    });
  });

  describe('/users/:username', () => {
    it('GET status:200, sends the user object', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.eql({
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
            name: 'jonny',
            username: 'butter_bridge'
          });
        });
    });
    it('ERROR status:405, invalid method request', () => {
      return request(app)
        .put('/api/users/butter_bridge')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.eql('Method Not Allowed');
        });
    });
    it('ERROR status:404, user does not exist', () => {
      return request(app)
        .get('/api/users/snoopy')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('user not found');
        });
    });
  });
});
