import { adminsDb } from '../database/database.js';
import { AdminModel } from '../model/admin.model.js';
import { adminController } from '../controller/admin.controller.js';
import { logger } from '../../winston/winston.js';

export const adminHandlerByFunction = async (
    admin: AdminModel,
) => {
    try {
        await adminController(adminsDb, admin);
    } catch (error) {
        logger.crit('Admin handler error:', error);
    }
};
