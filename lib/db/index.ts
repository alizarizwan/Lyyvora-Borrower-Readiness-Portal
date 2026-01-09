import Database from "better-sqlite3"
import path from "path"

const db = new Database(path.join(process.cwd(), "data.db"))

db.exec(`
  CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    answers TEXT,
    currentStep INTEGER,
    scoreResult TEXT,
    completedChecklist TEXT,
    createdAt TEXT
  )
`)

export default db
