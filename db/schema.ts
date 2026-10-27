import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const workspaces = sqliteTable('workspaces', { id: text('id').primaryKey(), data: text('data').notNull(), updatedAt: text('updated_at').notNull() });
export const policyScenarios = sqliteTable('policy_scenarios', {
 id: text('id').primaryKey(),
 ownerId: text('owner_id').notNull(),
 name: text('name').notNull(),
 adjustments: text('adjustments').notNull(),
 result: text('result').notNull(),
 createdAt: text('created_at').notNull()
});
