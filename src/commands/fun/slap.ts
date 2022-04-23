import { MessageEmbed } from "discord.js";
import { text } from "../../providers/config";
import { mainChannels } from "../../providers/discord";
import { Command } from "../../structures/Command";
import { format } from "../../utils/string";

export const command = new Command("slap", "Give your friends a good slap.")
	.addOption("string", o => o.setName("slap").setDescription("Slap your friends.").setRequired(true))
	.setExecutor(async int => {
		const slapped = int.options.getString("slap", true);
		const tcfe = text.commands.feedback.embed;
		await int.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Bam someone got slapped")
					.setDescription(`${slapped} got slapped by ${int.user.tag}`)
					.setFooter({ text: format(tcfe.footer, int.user.tag), iconURL: int.user.displayAvatarURL() }),
					
			],
		});
	});
