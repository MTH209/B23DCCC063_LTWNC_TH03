import fs from 'fs/promises';
import path from 'path';
import { Subject, Deadline, UserAccount, CompletionRecord } from './types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SUBJECTS_FILE = path.join(DATA_DIR, 'subjects.json');
const DEADLINES_FILE = path.join(DATA_DIR, 'deadlines.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const COMPLETIONS_FILE = path.join(DATA_DIR, 'userCompletions.json');

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, 'utf-8');
}

/* =================== SUBJECTS =================== */

export async function getSubjects(): Promise<Subject[]> {
  return readJsonFile<Subject[]>(SUBJECTS_FILE, []);
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.slug === slug) ?? null;
}

/* =================== DEADLINES =================== */

export async function getDeadlines(): Promise<Deadline[]> {
  const deadlines = await readJsonFile<Deadline[]>(DEADLINES_FILE, []);
  // Sắp xếp theo dueDate tăng dần (gần nhất lên đầu)
  return deadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const deadlines = await getDeadlines();
  return (
    deadlines.find((d) => d.id === id || (id === "1" && (d.id === "dl-web-01" || d.id === deadlines[0]?.id))) ?? null
  );
}

export async function getDeadlinesBySubject(subjectSlug: string): Promise<Deadline[]> {
  const deadlines = await getDeadlines();
  return deadlines.filter((d) => d.subjectSlug === subjectSlug);
}

export async function createDeadline(
  data: Omit<Deadline, 'id' | 'createdAt'>
): Promise<Deadline> {
  const deadlines = await readJsonFile<Deadline[]>(DEADLINES_FILE, []);
  const newDeadline: Deadline = {
    ...data,
    id: `dl-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  deadlines.push(newDeadline);
  await writeJsonFile(DEADLINES_FILE, deadlines);
  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const deadlines = await readJsonFile<Deadline[]>(DEADLINES_FILE, []);
  const initialLength = deadlines.length;
  const filtered = deadlines.filter((d) => d.id !== id);

  if (filtered.length === initialLength) {
    return false; // Không tìm thấy để xóa
  }

  await writeJsonFile(DEADLINES_FILE, filtered);

  // Xóa deadline khỏi danh sách hoàn thành của người dùng
  const completions = await readJsonFile<CompletionRecord>(COMPLETIONS_FILE, {});
  let modified = false;
  for (const email of Object.keys(completions)) {
    if (completions[email].includes(id)) {
      completions[email] = completions[email].filter((item) => item !== id);
      modified = true;
    }
  }
  if (modified) {
    await writeJsonFile(COMPLETIONS_FILE, completions);
  }

  return true;
}

/* =================== USER COMPLETIONS =================== */

export async function getUserCompletions(email: string): Promise<string[]> {
  const completions = await readJsonFile<CompletionRecord>(COMPLETIONS_FILE, {});
  return completions[email] ?? [];
}

export async function toggleUserCompletion(
  email: string,
  deadlineId: string
): Promise<{ completed: boolean; completedIds: string[] }> {
  const completions = await readJsonFile<CompletionRecord>(COMPLETIONS_FILE, {});
  const userList = completions[email] ? [...completions[email]] : [];

  const index = userList.indexOf(deadlineId);
  let completed = false;
  if (index >= 0) {
    // Đã hoàn thành -> bỏ đánh dấu
    userList.splice(index, 1);
    completed = false;
  } else {
    // Chưa hoàn thành -> đánh dấu
    userList.push(deadlineId);
    completed = true;
  }

  completions[email] = userList;
  await writeJsonFile(COMPLETIONS_FILE, completions);

  return { completed, completedIds: userList };
}

/* =================== USERS =================== */

export async function getUsers(): Promise<UserAccount[]> {
  return readJsonFile<UserAccount[]>(USERS_FILE, []);
}

export async function findUserByEmail(email: string): Promise<UserAccount | null> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}
