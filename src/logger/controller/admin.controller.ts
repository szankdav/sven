import { Database } from 'sqlite3';
import { AdminModel, createAdmin } from '../model/admin.model.js';
import { DatabaseError } from '../utils/customErrorClasses/databaseError.class.js';

export const adminController = async (
  db: Database,
  admin: AdminModel,
): Promise<void> => {
  try {
    await createAdmin(db, [admin.username, admin.password, admin.createdAt]);
  } catch (error) {
    throw new DatabaseError(`Error creating admin in database: ${error}`, 500);
  }
};
