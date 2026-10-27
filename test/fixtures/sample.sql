-- SQL 注释
/* 多行注释 */
SELECT id, name, COUNT(*) AS total
FROM users
WHERE status = 'active'
GROUP BY id
ORDER BY id DESC
LIMIT 10;