import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'crypto';
import fs from 'node:fs';

// 检查db目录在不在
// 如果不在，创建

if (!fs.existsSync('db')) {
    fs.mkdirSync('db');
}
const database = new DatabaseSync('db/source.db');

try {
    // 先尝试删除已存在的表
    database.exec(`DROP TABLE IF EXISTS data`);

    // 创建表
    database.exec(`
        CREATE TABLE data(
          id TEXT PRIMARY KEY  NOT NULL,
          pid TEXT  NOT NULL,
          project_id TEXT  NOT NULL,
          report_id TEXT  NOT NULL,
          sha TEXT NOT NULL,
          data TEXT NOT NULL
        ) STRICT
      `);

    // 插入示例数据
    const insert = database.prepare(
        'INSERT INTO data (id, pid, project_id, report_id, sha, data) VALUES (?, ?, ?, ?, ?, ?)',
    );

    // 生成随机 id 并插入数据
    const id1 = randomUUID();
    insert.run(
        id1,
        String(process.pid),
        'testProjectId1',
        'testReportId1',
        'testSha1',
        'testData1',
    );

    const id2 = randomUUID();
    insert.run(
        id2,
        String(process.pid),
        'testProjectId2',
        'testReportId2',
        'testSha2',
        'testData2',
    );
} catch (error) {
    console.error('Database setup error:', error);
}