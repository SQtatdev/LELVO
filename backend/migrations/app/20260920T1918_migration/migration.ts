#!/usr/bin/env -S node
// @ts-nocheck
import type { Contract as End } from '../../snapshots/774740fb323e265fc50ea29a85f165943b34424e6642a3ad3a588c4b99995cfe/contract';
import endContract from '../../snapshots/774740fb323e265fc50ea29a85f165943b34424e6642a3ad3a588c4b99995cfe/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a88efadc2c33b16ba9c162cac906f0debe45e1e4bcd5aeb4b83c74dd8abab49e/contract';
import startContract from '../../snapshots/a88efadc2c33b16ba9c162cac906f0debe45e1e4bcd5aeb4b83c74dd8abab49e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';


export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations(): ReturnType<Migration<Start, End>['operations']> {
  return [
      this.setDefault({
        schema: 'public',
        table: 'user',
        column: 'updatedAt',
        defaultSql: 'now()',
      }),

      this.setDefault({
        schema: 'public',
        table: 'shift',
        column: 'updatedAt',
        defaultSql: 'now()',
      }),

    this.createTable({
      schema: 'public',
      table: 'availability',
      columns: [
        col('id', 'SERIAL', {
          notNull: true,
          codecRef: { codecId: 'pg/int4@1' },
        }),

        col('createdAt', 'timestamptz', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),

        col('updatedAt', 'timestamptz', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),

        col('date', 'timestamptz', {
          notNull: true,
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),

        col('available', 'bool', {
          notNull: true,
          codecRef: { codecId: 'pg/bool@1' },
        }),

        col('startTime', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),

        col('endTime', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),

        col('userId', 'int4', {
          notNull: true,
          codecRef: { codecId: 'pg/int4@1' },
        }),
      ],

      constraints: [
        primaryKey(['id']),
      ],
    }),

    this.createIndex({
      schema: 'public',
      table: 'availability',
      index: 'availability_userId_idx',
      columns: ['userId'],
    }),

    this.addForeignKey({
      schema: 'public',
      table: 'availability',
      foreignKey: {
        name: 'availability_userId_fkey',
        columns: ['userId'],
        references: {
          schema: 'public',
          table: 'user',
          columns: ['id'],
        },
      },
    }),
  ];
}
}

MigrationCLI.run(import.meta.url, M);
