import sqlite3 from'sqlite3';
import { randomUUID } from 'crypto';
import fs from 'fs';

// 检查db目录在不在
// 如果不在，创建
if (!fs.existsSync('db')) {
    fs.mkdirSync('db');
}

// 打开数据库连接
const db = new sqlite3.Database('db/source.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        setupDatabase();
    }
});

function setupDatabase() {
    // 先尝试删除已存在的表
    const dropTableQuery = 'DROP TABLE IF EXISTS data';
    db.run(dropTableQuery, (err) => {
        if (err) {
            console.error('Error dropping table:', err);
        } else {
            // 创建表
            const createTableQuery = `
                CREATE TABLE data(
                  id TEXT PRIMARY KEY  NOT NULL,
                  pid TEXT  NOT NULL,
                  project_id TEXT  NOT NULL,
                  report_id TEXT  NOT NULL,
                  sha TEXT NOT NULL,
                  data TEXT NOT NULL
                ) STRICT
            `;
            db.run(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                } else {
                    insertSampleData();
                }
            });
        }
    });
}

function insertSampleData() {
    const insertQuery = 'INSERT INTO data (id, pid, project_id, report_id, sha, data) VALUES (?,?,?,?,?,?)';
    const insert = db.prepare(insertQuery);

    // 生成随机 id 并插入数据
    const id1 = randomUUID();
    insert.run(
        id1,
        String(process.pid),
        'testProjectId1',
        'testReportId1',
        'testSha1',
        'testData1',
        (err) => {
            if (err) {
                console.error('Error inserting data:', err);
            }
        }
    );

    const id2 = randomUUID();
    insert.run(
        id2,
        String(process.pid),
        'sss',
        'ssss',
        'testSha2',
        'testData2',
        (err) => {
            if (err) {
                console.error('Error inserting data:', err);
            }
            insert.finalize();
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database setup completed and connection closed.');
                }
            });
        }
    );
}