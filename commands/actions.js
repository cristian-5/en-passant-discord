
import { Prefix, ColorCodes } from '../config.js';
import {
	Option, command, error, info, success, addAction, findAction, removeAction,
	addAliases, fetchActions
} from '../parser.js';

const PRFXRGX = new RegExp(Prefix, 'g');

command({
	name: 'twitch', emoji: ':gem:',
	description: '💎 Manage twitch.tv commands.',
	options: [{
		name: 'action', type: Option.SubCommand,
		description: '🆕 Make a new twitch.tv action.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the new action',
			required: true
		}, {
			name: 'reply', type: Option.String,
			description: 'Expected message reply',
			required: true
		}, {
			name: 'mod', type: Option.Boolean,
			description: 'Is this command mod only?',
			required: false
		}]
	}, {
		name: 'remove', type: Option.SubCommand,
		description: '🚫 Remove a twitch.tv action.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the action to remove',
			required: true
		}]
	}, {
		name: 'alias', type: Option.SubCommand,
		description: '💕 Add aliases to an action.',
		options: [{
			name: 'name', type: Option.String,
			description: 'Name of the action',
			required: true
		}, {
			name: 'aliases', type: Option.String,
			description: 'Aliases, space separated',
			required: true
		}]
	}, {
		name: 'list', type: Option.SubCommand,
		description: '🛟 List all the available actions.',
		options: []
	}],
	execute: async interaction => {
		const options = interaction.data.options[0].options;
		let commands, main, aliases;
		switch (interaction.data.options[0].name) {
			case 'action':
				commands = options[0].value.split(/\w+/g)
					.map(c => c.replace(PRFXRGX, '').toLowerCase());
				if (commands.length == 0)
					return error('Twitch Actions', 'Invalid action name!');
				await addAction({
					commands, reply: options[1].value,
					moderator: options.length > 2 ? options[2].value : false
				});
				return success('Twitch Actions', 'Command `' + Prefix +
				command[0] + '` added.');
			break;
			case 'remove':
				main = options[0].value.replace(PRFXRGX, '').toLowerCase();
				if (!findAction(main)) return error(
					'Twitch Actions', 'Action `' + main + '` not found!'
				);
				await removeAction(main);
			break;
			case 'alias':
				main = options[0].value.replace(PRFXRGX, '').toLowerCase();
				if (!findAction(main)) return error(
					'Twitch Actions', 'Action `' + main + '` not found!'
				);
				aliases = options[1].value.split(/\w+/g)
					.map(c => c.replace(PRFXRGX, '').toLowerCase());
				await addAliases(main, aliases);
			break;
			case 'list':
				const actions = await fetchActions();
				if (actions.length == 0)
					return info('Twitch Actions', 'No actions found!');
				return {
					embeds: [{
						title: 'Twitch Actions',
						color: ColorCodes.normal,
						description: '',
						fields: actions.map(a => ({
							name: a.commands.map(e => '`' + e + '`').join('｜'),
							value: a.reply
						}))
					}]
				};
			break;
		}
	}
});