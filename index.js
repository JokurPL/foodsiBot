import { getData, saveData, updateData } from "./foodsiApi.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import config from "./config.json" assert { type: "json" };
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const intervalTime = 0.1;
const channelId = "1092473836739506386";
const foodsiEmbed = {
  color: 0x0099ff,
  title: "Nazwa",
  url: "https://discord.js.org",
  author: {
    name: "Nazwa restauracji",
    icon_url: "https://i.imgur.com/AfFp7pu.png",
    url: "https://discord.js.org",
  },
  description: "opis",
  thumbnail: {
    url: "https://i.imgur.com/AfFp7pu.png",
  },
  fields: [
    {
      name: "Regular field title",
      value: "Some value here",
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
  ],
  image: {
    url: "https://i.imgur.com/AfFp7pu.png",
  },
  timestamp: new Date().toISOString(),
  footer: {
    text: "Some footer text here",
    icon_url: "https://i.imgur.com/AfFp7pu.png",
  },
};
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const channel = client.channels.cache.get(channelId);

  setInterval(async () => {
    let restaurants = await updateData(await getData());
    // console.log(restaurants);
    restaurants.map((restaurant) => {
      channel.send({
        embeds: [
          {
            color: 2415509,
            title: restaurant.name,
            description: restaurant.meal.description,
            thumbnail: {
              url: restaurant.image.url,
            },
            fields: [
              {
                name: "Informacja",
                value: restaurant.important_notes
                  ? restaurant.important_notes
                  : "Brak informacji",
              },
              {
                name: "Cena:",
                value: `~~${restaurant.meal.original_price}~~ zł | ${restaurant.meal.price} zł`,
              },
              {
                name: "Typ paczki",
                value: restaurant.package_type,
              },
              {
                name: "Godziny odbioru",
                value: `${new Date(
                  restaurant.package_day.collection_day.opened_at
                ).getHours()}:${new Date(
                  restaurant.package_day.collection_day.opened_at
                ).getMinutes()} - ${new Date(
                  restaurant.package_day.collection_day.closed_at
                ).getHours()}:${new Date(
                  restaurant.package_day.collection_day.closed_at
                ).getMinutes()}`,
              },
            ],
          },
        ],
      });
    });
  }, intervalTime * 1000 * 60);
});

client.login(config.token);
