// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
export const projects = sqliteTable('projects', {
 id: text('id').primaryKey(), title: text('title').notNull(), author: text('author').notNull(),
 description: text('description').notNull(), category: text('category').notNull(), url: text('url').notNull(),
 createdAt: integer('created_at').notNull(),
 members: text('members').notNull().default(''),
 mascot: text('mascot').notNull().default('ghost'),
 screenshot: text('screenshot').notNull().default(''),
 story: text('story').notNull().default(''),
 technologies: text('technologies').notNull().default(''),
 sourceUrl: text('source_url').notNull().default(''),
});
export const applause = sqliteTable('applause', {
 projectId:text('project_id').notNull().references(()=>projects.id),
 visitor:text('visitor').notNull(), kind:text('kind').notNull(),
},t=>[primaryKey({columns:[t.projectId,t.visitor,t.kind]})]);

export const projectComments = sqliteTable('project_comments', {
 id: text('id').primaryKey(),
 projectId: text('project_id').notNull().references(() => projects.id),
 author: text('author').notNull(),
 message: text('message').notNull(),
 kind: text('kind', { enum: ['comment', 'connect'] }).notNull(),
 createdAt: integer('created_at').notNull(),
}, table => [index('project_comments_thread').on(table.projectId, table.createdAt)]);
