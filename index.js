import { getData, saveData, updateData } from "./foodsiApi.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import config from "./config.json" assert { type: "json" };
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const intervalTime = 0.1;
const channelId = "1092473836739506386";

const getLeadingZero = (date) => {
  return (date < 10 ? "0" : "") + date;
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
                value: `~~${restaurant.meal.original_price}zł~~ | ${restaurant.meal.price} zł`,
              },
              {
                name: "Typ paczki",
                value: restaurant.package_type,
              },
              {
                name: "Data odbioru",
                value: `${restaurant.for_day} ${getLeadingZero(
                  new Date(
                    restaurant.package_day.collection_day.opened_at
                  ).getHours()
                )}:${getLeadingZero(
                  new Date(
                    restaurant.package_day.collection_day.opened_at
                  ).getMinutes()
                )} - ${getLeadingZero(
                  new Date(
                    restaurant.package_day.collection_day.closed_at
                  ).getHours()
                )}:${getLeadingZero(
                  new Date(
                    restaurant.package_day.collection_day.closed_at
                  ).getMinutes()
                )}`,
              },
            ],
          },
        ],
      });
    });
  }, intervalTime * 1000 * 60);
});

client.login(config.token);
