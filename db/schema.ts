// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const projects = sqliteTable('projects', {
 id: text('id').primaryKey(), title: text('title').notNull(), author: text('author').notNull(),
 description: text('description').notNull(), category: text('category').notNull(), url: text('url').notNull(),
 createdAt: integer('created_at').notNull(),
});
