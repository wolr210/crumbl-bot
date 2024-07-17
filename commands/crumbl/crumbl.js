const { SlashCommandBuilder, EmbedBuilder, IntegrationApplication } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const pagination = require('../../functions/pagination');

var numCookies = 0;
const cookieNames = [];
const cookieDescs = [];
const cookieImages = [];

const getCookies = async () => {
    try {
        // const {data} = await axios.get("https://crumblcookies.com/");
        // const $ = cheerio.load(data);
        // const cookieList = $(`[id="weekly-cookie-flavors"] > li`);
        // console.log(cookieList);
        // numCookies = cookieList.length;
        // for(var i = 0; i < numCookies; i++) {
        //     cookieNames.push(cookieList[i].find('h3')[0].text());
        //     cookieDescs.push(cookieList[i].find('p')[0].text());
        //     cookieImages.push(cookieList[i].find('img')[0].attr('src'));
        // }
        // console.log(cookieNames);
        // console.log(cookieDescs);
        // console.log(cookieImages);
        const {data} = await axios.get("https://crumblcookies.com/");
        const $ = cheerio.load(data);
        $(`[id="weekly-cookie-flavors"]`).find('li').map(function () {
            numCookies++;
            cookieNames.push($(this).find('h3').text());
            cookieDescs.push($(this).find('p').text());
            cookieImages.push($(this).find('img').attr('src'));
        });
        console.log(cookieNames);
        console.log(cookieDescs);
        console.log(cookieImages);
    } catch (error) {
		throw error;
	}
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('crumbl')
    .setDescription('Displays the current Crumbl menu'),
    async execute (interaction) {
        await getCookies();
        const embeds = [];
        for(var i = 0; i < numCookies; i++) {
            embeds.push(new EmbedBuilder()
            .setTitle(cookieNames[i])
            .setColor(0xFDC1CD)
            .setDescription(cookieDescs[i])
            .setImage(cookieImages[i])
            );
        }

        await pagination(interaction, embeds);
    }
}