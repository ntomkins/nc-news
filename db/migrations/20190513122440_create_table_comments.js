exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .string('author')
      .references('users.username')
      .notNullable();
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable
      .datetime('created_at', { precision: 6 })
      .defaultTo(knex.fn.now(6));
    // commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentsTable.text('body').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
