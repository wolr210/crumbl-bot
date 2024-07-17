const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = async (interaction, pages, time = 300 * 1000) => {

    try {

        if(!interaction || !pages || !pages > 0) throw new Error('[PAGINATION] Invalid args')

        await interaction.deferReply();

        if(pages.length === 1) {
            return await interaction.editReply({embeds: pages, components: [], fetchReply: true});
        }

        var index = 0;

        const first = new ButtonBuilder()
        .setCustomId('pagefirst')
        .setLabel('<<')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

        const prev = new ButtonBuilder()
        .setCustomId('pageprev')
        .setLabel('<')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

        const pageCount = new ButtonBuilder()
        .setCustomId('pagecount')
        .setLabel(`${index + 1}/${pages.length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

        const next = new ButtonBuilder()
        .setCustomId('pagenext')
        .setLabel('>')
        .setStyle(ButtonStyle.Primary)

        const last = new ButtonBuilder()
        .setCustomId('pagelast')
        .setLabel('>>')
        .setStyle(ButtonStyle.Primary)

        const buttons = new ActionRowBuilder().addComponents([first, prev, pageCount, next, last]);

        const msg = await interaction.editReply({embeds: [pages[index]], components: [buttons], fetchReply: true});

        const collector = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        });

        collector.on('collect', async i => {
            if(i.user.id !== interaction.user.id) return await i.reply({content: `Only **${interaction.user.username}** can use these buttons!`, ephemeral: true});

            await i.deferUpdate();

            if(i.customId === 'pagefirst') {
                index = 0;
            } else if(i.customId === 'pageprev') {
                if(index > 0) index--;
            } else if(i.customId === 'pagenext') {
                if(index < pages.length - 1) index++;
            } else if(i.customId === 'pagelast') {
                index = pages.length - 1;
            }
            pageCount.setLabel(`${index + 1}/${pages.length}`);

            first.setDisabled(index === 0);
            prev.setDisabled(index === 0);
            next.setDisabled(index === pages.length - 1);
            last.setDisabled(index === pages.length - 1);

            await msg.edit({embeds: [pages[index]], components: [buttons]}).catch(err => {});

            collector.resetTimer();
        });

        collector.on("end", async () => {
            await msg.edit({embeds: [pages[index]], components: []}).catch(err => {});
        });

        return msg;

    } catch(e) {
        console.error(`[ERROR] ${e}`);
    }

}