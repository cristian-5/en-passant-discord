
import {
	createBot, startBot, editBotStatus, sendMessage
} from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';
import { enableCachePlugin, enableCacheSweepers }
from 'https://deno.land/x/discordeno_cache_plugin@0.0.18/mod.ts';

import { serve } from "https://deno.land/std@0.120.0/http/server.ts";

import { parse, text, fetchLog, log, executeTasks, dispatch } from './parser.js';
import { Channels, Welcome, Actions } from './config.js';

// ==== Commands ===========================

import './commands/help.js';
import './commands/ping.js';
import './commands/poll.js';
import './commands/links.js';
import './commands/clear.js';
import './commands/fen.js';
import './commands/rating.js';
import './commands/task.js';
import './commands/shutdown.js';
import './commands/record.js';
import './commands/vote.js';

// ==== Attachments ========================

import './attachments/pgn.js';

// ==== Tasks ==============================

import './tasks/quote.js';
import './tasks/youtube.js';
import './tasks/twitch.js';
import './tasks/attempts.js';
import './tasks/move.js';

// =========================================

function setRandomAction() {
	const action = Actions[
		Math.floor(Math.random() * Actions.length)
	];
	editBotStatus(bot, {
		activities: [{
			name: action.status,
			type: action.type,
			createdAt: Date.now()
		}],
		since: Date.now(),
		afk: false,
		status: 'online'
	});
}

const baseBot = createBot({
	botId: Deno.env.get('ID'),
	token: Deno.env.get('TOKEN'),
	intents: [ 'Guilds', 'GuildMessages', 'GuildMembers' ],
	events: {
		// _ is bot, but it is not necessary
		messageCreate(_, message) {
			parse(message);
			if (Math.random() <= 0.2) setRandomAction();
		},
		guildMemberAdd(bot, member, _) {
			const message = Welcome[Math.floor(Math.random() * Welcome.length)];
			sendMessage(bot, Channels.general, text(`**Welcome** <@${member.id}>, ${message}`));
		},
		interactionCreate(_, interaction) { dispatch(interaction); }
	}
});

export const bot = enableCachePlugin(baseBot);
enableCacheSweepers(bot);
log('status', 'en-passant ready');
setRandomAction();

// =========================================

// web server for constant uptime:
serve(async _ => {
	executeTasks();
	return new Response(fetchLog(), {
		headers: { 'content-type': 'text/plain' },
		status: 200
	});
});
log('status', 'web server ready');

await startBot(bot);
