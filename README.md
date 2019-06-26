## NC News

---

The back-end for NC News was created using Node.JS, Express, PostgreSQL and knex. This API allows the user to access Articles, Topics, Comments and Users via various endpoints and queries.

To run locally please follow the instructions bellow, a live hosted version is available on [heroku](https://github.com/ntomkins/nc-news.git)

### Setting Up

---

1. Clone this repository into a suitible folder on your computer

   `git clone https://github.com/ntomkins/nc-news.git`

2. Go into the repository

   `cd nc-news`

3. Install Dependencies

   `npm install`

4. Set up test and developer databases

   `npm run setup-dbs`

5. Migrate data into database

   `npm run seed`

6. host the API locally

   `npm run dev`

7. Lastly you will need to add a `knexfile.js` file at the same level as your app.js. An example is given below, Linux users will need to provide a username and password for database connections.

```
const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfigs = {
  development: {
    connection: {
      database: 'nc_news'
      // username: "",
      // password: "",
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
      // username: "",
      // password: "",
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
```

### Testing

---

The app's endpoints and seed functions have been fully tested using mocha and chai. To begin running the tests use the following command:

    `npm run test`

### Using the API

---

The API can be used locally using the url 'localhost:9090/api'
GET requests can be used via a browser, however POST, PATCH and DELETE requests will require a REST client such as [Insomnia](https://insomnia.rest/)

### Available Endpoints

---

`GET` /api/topics

Responds with an array of topic objects, each of which have the following properties:

- slug
- description

```
{
  "topics": [
    {
      "slug": "coding",
      "description": "Code is love, code is life"
    },
    {
      "slug": "football",
      "description": "FOOTIE!"
    },
    {
      "slug": "cooking",
      "description": "Hey good looking, what you got cooking?"
    }
  ]
}
```

`GET` /api/users/:username

Responds with a user object, which has the following propertyies:

- username
- avatar_url
- name

```
{
user: {
username: "jessjelly",
avatar_url: "https://s-media-cache-ak0.pinimg.com/564x/39/62/ec/3962eca164e60cf46f979c1f57d4078b.jpg",
name: "Jess Jelly"
}
}
```

`GET` /api/articles/:article_id

Responds with an article object, which has the following properties:

- author
- title
- article_id
- body
- topic
- created_at
- votes
- comment_count

```
{
article: {
article_id: 1,
title: "Running a Node App",
author: "jessjelly",
topic: "coding",
body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
votes: 0,
created_at: "2016-08-18T12:07:52.389Z",
comment_count: "8"
}
}
```

`PATCH` /api/articles/:article_id

Request body accepts an object in the form `{ inc_votes: newVote }`

```
{ inc_votes : 1 }

{ inc_votes : -1 }
```

Responds with the updated article with the votes changed.

`POST` /api/articles/:article_id/comments

Request body accepts an object with the following properties:

- username
- body

```
{
	"username": "jessjelly",
	"body": "this article is amazing!"
}
```

Responds with the posted comment

```
{
  "comment": {
    "comment_id": 301,
    "author": "jessjelly",
    "article_id": 1,
    "votes": 0,
    "created_at": "2019-06-16T21:58:21.589Z",
    "body": "this article is amazing!"
  }
}
```

`GET` /api/articles/:article_id/comments

Responds with a total_count of the comments and an array of comments for the given article_id, of which each comment has:

- comment_id
- votes
- created_at
- author
- body

```
{
  "comments": [
    {
      "comment_id": 44,
      "votes": 4,
      "created_at": "2017-11-20T08:58:48.322Z",
      "author": "grumpy19",
      "body": "Error est qui id corrupti et quod enim accusantium minus. Deleniti quae ea magni officiis et qui suscipit non."
    },
    {
      "comment_id": 52,
      "votes": 10,
      "created_at": "2017-07-31T08:14:13.076Z",
      "author": "jessjelly",
      "body": "Consectetur deleniti sed. Omnis et dolore omnis aspernatur. Et porro accusantium. Tempora ullam voluptatum et rerum."
    },
    {
      "comment_id": 286,
      "votes": 19,
      "created_at": "2017-07-05T12:15:40.563Z",
      "author": "cooljmessy",
      "body": "Ut accusamus enim vel voluptate quae temporibus labore neque a. Reprehenderit iste est eos velit fugit vel quod velit."
    },

    ......

  ],
  "total_count": 8
}
```

Accepts queries:

- sort_by
- order (asc or desc)

`GET` /api/articles

Responds with a total_count and an articles array of article objects, each of which should has:

- author
- title
- article_id
- topic
- created_at
- votes
- comment_count

```
{
  "articles": [
    {
      "article_id": 33,
      "title": "Seafood substitutions are increasing",
      "author": "weegembump",
      "topic": "cooking",
      "votes": 0,
      "created_at": "2018-05-30T15:59:13.341Z",
      "comment_count": "6"
    },
    {
      "article_id": 28,
      "title": "High Altitude Cooking",
      "author": "happyamy2016",
      "topic": "cooking",
      "votes": 0,
      "created_at": "2018-05-27T03:32:28.514Z",
      "comment_count": "5"
    },
    {
      "article_id": 30,
      "title": "Twice-Baked Butternut Squash Is the Thanksgiving Side Dish of Your Dreams",
      "author": "jessjelly",
      "topic": "cooking",
      "votes": 0,
      "created_at": "2018-05-06T02:40:35.489Z",
      "comment_count": "8"
    },

    ......

  ],
  "total_count": 36
}
```

Accepts queries:

- sort_by (sorts the articles by any valid field)
- order (asc or desc)
- author (equal to any valid username)
- topic (equal to any valid topic)

`PATCH` /api/comments/:comment_id

Request body accepts an object in the form `{ inc_votes: newVote }`

```
{ inc_votes : 1 }

{ inc_votes : -1 }
```

Responds with the updated comment with the votes changed.

`DELETE` /api/comments/:comment_id

Deletes the given comment by comment_id

Responds with status 204 and no content

### NC News App Front-End

---

The repo for the front-end of this NC News project can be found [here on github](https://github.com/ntomkins/nc-news-app), which is also [hosted on netlify](https://ntomkins-nc-news.netlify.com/)

### Author

---

Nathaniel Tomkins

### Acknowledgments

---

This API was created as part of a project at Northcoders Coding Bootcamp. A big thank you to all the staff and fellow students.
