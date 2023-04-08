import axios from "axios";
import fs, { readFileSync } from "fs";

import config from "./userConfig.js";

const getData = async () => {
  const data = JSON.stringify({
    page: 1,
    per_page: 100,
    distance: {
      lat: config.location.lat,
      lng: config.location.lng,
      range: config.location.range,
    },
    hide_unavailable: "True",
    food_type: [],
    collection_time: {
      from: "00:00:00",
      to: "23:59:59",
    },
  });

  const requestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.foodsi.pl/api/v2/restaurants",
    headers: {
      "Content-Type": "application/json",
      "system-version": "android_3.0.0",
      "User-Agent": "okhttp/3.12.0",
    },
    data: data,
  };

  try {
    const response = await axios.request(requestConfig);

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const saveData = async (data) => {
  await fs.writeFile("./data.json", JSON.stringify(data), "utf-8", (err) => {
    err ? console.error(err) : console.log("Data saved");
  });
};

const updateData = async (newData) => {
  const dataFromFile = JSON.parse(readFileSync("./data.json"));
  const idFromFile = dataFromFile.map((restaurant) => restaurant.id);
  console.log(idFromFile);
  const newRestaurants = newData.filter((restaurant) => {
    return !idFromFile.includes(restaurant.id);
  });
  console.log(newRestaurants.map((restuarant) => restuarant.id));
  await saveData(newData);
  return newRestaurants;
};

export { getData, saveData, updateData };
