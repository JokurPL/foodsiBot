import fetch from "node-fetch";
import fs, { readFileSync } from "fs";

import config from "./userConfig.js";

const getData = async () => {
  const raw = JSON.stringify({
    page: 1,
    per_page: 15,
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

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "system-version": "android_3.0.0",
      "User-Agent": "okhttp/3.12.0",
    },
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api.foodsi.pl/api/v2/restaurants",
    requestOptions
  );

  return response.json();
};

const saveData = async (data) => {
  await fs.writeFile(
    "./data.json",
    JSON.stringify(data.data),
    "utf-8",
    (err) => {
      err ? console.error(err) : console.log("Data saved");
    }
  );
};

const updateData = async (newData) => {
  const dataFromFile = JSON.parse(readFileSync("./data.json"));
  if (JSON.stringify(dataFromFile) != JSON.stringify(newData.data)) {
    console.log("Need update");
    const highestId = Math.max(
      ...dataFromFile.map((restaurant) => restaurant.id)
    );
    console.log(`Highest ID: ${highestId}`);
    const newRestauransts = newData.data.filter((restaurant) => {
      console.log(
        `${Number(restaurant.id)} > ${Number(highestId)} \t ${
          Number(restaurant.id) > Number(highestId)
        }`
      );
      return Number(restaurant.id) > Number(highestId);
    });
    // console.log(newRestauransts);
    saveData(newData);
    return newRestauransts;
  } else {
    console.log("Data up to date");
    return [];
  }
};

export { getData, saveData, updateData };
