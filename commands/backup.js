
import { Roles } from '../config.js';
import { createCommand } from '../parser.js';
import { Database } from '../database.js';

createCommand({
	name: 'backup', emoji: ':radioactive:', hidden: true,
	description: 'Backup of the entire **BOT** database.',
    permissions: Roles.moderator,
	execute: async () => ({
        file: {
            blob: new Blob([ JSON.parse(await Database.dictionary()) ]),
            name: 'en-passant.json',
        }
	})
});
