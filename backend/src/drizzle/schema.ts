import { relations, sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export enum UserRoleEnum {
  default = 0,
  admin = 1,
}

export enum BookStatusEnum {
  pending = 0,
  avaliable = 1,
  ordered = 2,
  borrowed = 3,
  lost = 4,
}

export const userModel = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  password: text('password').notNull(),
  avatar: text('avatar').default(sql`null`),
  role: integer('role').default(UserRoleEnum.default).notNull(),
  stuNum: text('stuNum').unique().notNull(),
  college: text('college'),
  class: text('class'),
  lastRevokeTime: integer('lastRevokeTime').default(0).notNull(),
});

export const tagModel = sqliteTable('tags', {
  name: text('name').notNull().primaryKey(),
});

export const bookModel = sqliteTable('books', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  desc: text('desc').notNull(),
  author: text('author').notNull(),
  img: text('img').default(sql`''`),
  status: integer('status').notNull().default(BookStatusEnum.pending),
  orderBy: integer('orderBy', { mode: 'number' }).references(() => userModel.id),
  owner: integer('owner', { mode: 'number' })
    .notNull()
    .references(() => userModel.id),
  number: integer('number').default(0).notNull(),
});

export const tagsToBooksModel = sqliteTable(
  'tagsToBooks',
  {
    tagName: text('tag')
      .notNull()
      .references(() => tagModel.name),
    bookId: integer('bookId', { mode: 'number' })
      .notNull()
      .references(() => bookModel.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.bookId, t.tagName] }) }),
);

export const tagRelations = relations(tagModel, ({ many }) => ({
  tagsToBooks: many(tagsToBooksModel),
}));
export const bookRelations = relations(bookModel, ({ many, one }) => ({
  booksToTags: many(tagsToBooksModel),
  orderBy: one(userModel, {
    fields: [bookModel.orderBy],
    references: [userModel.id],
    relationName: 'orderBy',
  }),
  owner: one(userModel, {
    fields: [bookModel.owner],
    references: [userModel.id],
    relationName: 'owner',
  }),
}));
export const tagToBookRelations = relations(tagsToBooksModel, ({ one }) => ({
  tag: one(tagModel, { fields: [tagsToBooksModel.tagName], references: [tagModel.name] }),
  book: one(bookModel, { fields: [tagsToBooksModel.bookId], references: [bookModel.id] }),
}));
export const userRelations = relations(userModel, ({ many }) => ({
  ordered: many(bookModel, { relationName: 'orderBy' }),
  owned: many(bookModel, { relationName: 'owner' }),
}));

export const numberModel = sqliteTable('numbers', {
  id: integer('id').primaryKey(),
  latest: integer('latest').default(0).notNull(),
});
