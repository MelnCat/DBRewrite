import { MessageEmbed } from "discord.js";
import { text } from "../../providers/config";
import { mainChannels } from "../../providers/discord";
import { Command } from "../../structures/Command";
import { format } from "../../utils/string";

export const command = new Command("tickle", "Tickle your friends.")
	.addOption("string", o => o.setName("tickle").setDescription("Tickle your friends.").setRequired(true))
	.setExecutor(async int => {
		const nekos = new Client();
    const yeeeee = await nekos.sfw.tickle();
		const slapped = int.options.getString("tickle", true);
		const tcfe = text.commands.feedback.embed;
		await int.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Bam someone got tickled")
					.setImage(yeeeee.url)
					.setDescription(`${slapped} got tickled by ${int.user.tag}`)
					.setFooter({ text: format(tcfe.footer, int.user.tag), iconURL: int.user.displayAvatarURL() }),
					
			],
		});
	}); 
