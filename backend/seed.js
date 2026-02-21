import dotenv from "dotenv";
import { connect, disconnect } from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Destination from "./models/Destinations.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// All 30 local images with correct extensions (served from /images/Images/)
const localImages = [
  "/images/Images/9891.jpg",
  "/images/Images/9892.jpg",
  "/images/Images/9893.jpg",
  "/images/Images/9894.jpg",
  "/images/Images/9895.jpg",
  "/images/Images/9896.jpg",
  "/images/Images/9897.jpg",
  "/images/Images/9898.jpeg",
  "/images/Images/9899.png",
  "/images/Images/9900.jpg",
  "/images/Images/9901.jpg",
  "/images/Images/9902.jpg",
  "/images/Images/9903.jpg",
  "/images/Images/9904.jpg",
  "/images/Images/9905.jpg",
  "/images/Images/9906.jpeg",
  "/images/Images/9907.jpg",
  "/images/Images/9908.jpg",
  "/images/Images/9909.jpg",
  "/images/Images/9910.jpg",
  "/images/Images/9911.jpg",
  "/images/Images/9912.jpg",
  "/images/Images/9913.jpg",
  "/images/Images/9914.jpg",
  "/images/Images/9915.jpg",
  "/images/Images/9916.jpg",
  "/images/Images/9917.jpg",
  "/images/Images/9918.jpg",
  "/images/Images/9919.jpg",
  "/images/Images/9920.jpg",
];

// Map original theme park/desert image IDs to local paths
const tpdImageMap = {
  "9891": "/images/Images/9891.jpg",
  "9892": "/images/Images/9892.jpg",
  "9893": "/images/Images/9893.jpg",
  "9894": "/images/Images/9894.jpg",
  "9895": "/images/Images/9895.jpg",
  "9896": "/images/Images/9896.jpg",
  "9897": "/images/Images/9897.jpg",
  "9898": "/images/Images/9898.jpeg",
  "9899": "/images/Images/9899.png",
  "9900": "/images/Images/9900.jpg",
  "9901": "/images/Images/9901.jpg",
  "9902": "/images/Images/9902.jpg",
  "9903": "/images/Images/9903.jpg",
  "9904": "/images/Images/9904.jpg",
  "9905": "/images/Images/9905.jpg",
  "9906": "/images/Images/9906.jpeg",
  "9907": "/images/Images/9907.jpg",
  "9908": "/images/Images/9908.jpg",
  "9909": "/images/Images/9909.jpg",
  "9910": "/images/Images/9910.jpg",
  "9911": "/images/Images/9911.jpg",
  "9912": "/images/Images/9912.jpg",
  "9913": "/images/Images/9913.jpg",
  "9914": "/images/Images/9914.jpg",
  "9915": "/images/Images/9915.jpg",
  "9916": "/images/Images/9916.jpg",
  "9917": "/images/Images/9917.jpg",
  "9918": "/images/Images/9918.jpg",
  "9919": "/images/Images/9919.jpg",
  "9920": "/images/Images/9920.jpg",
};

// Fix category names to match frontend options
function fixCategory(categories) {
  return categories.map((c) => {
    if (c === "Resort" || c === "Theme Park") return "Theme Parks & Resorts";
    if (c === "Dessert") return "Desserts";
    return c;
  });
}

// Ensure value is an array of strings
function toArray(val) {
  if (Array.isArray(val)) return val.map((v) => v.trim());
  if (typeof val === "string") return val.split(",").map((v) => v.trim());
  return [];
}

// Load placesData.json (Cities & Lights + Scenic)
const placesData = JSON.parse(
  readFileSync(
    join(__dirname, "../frontend/src/app/tempResources/placesData.json"),
    "utf-8"
  )
);

// Load theme parks & deserts dataset
const themeParksAndDeserts = JSON.parse(
  readFileSync(
    join(__dirname, "../full_theme_parks_and_deserts_Dataset.json"),
    "utf-8"
  )
);

// Normalize placesData — cycle through local images since S3 is gone
const normalizedPlaces = placesData.map((d, index) => ({
  id: Number(d.id),
  Image: localImages[index % localImages.length],
  Loc_name: d.Loc_name,
  Description: d.Description,
  Category: fixCategory(toArray(d.Category)),
  Seasons: toArray(d.Seasons),
  Travel_Partner: toArray(d.Travel_Partner),
  Activities: toArray(d.Activities),
  State: d.State,
  Address: d.Address,
  Min_Price: d.Min_Price,
  Max_Price: d.Max_Price,
  Currency: d.Currency,
}));

// Normalize theme parks & deserts — use mapped local images, shift IDs +30
const normalizedTPD = themeParksAndDeserts.map((d) => ({
  id: Number(d.id) + 30,
  Image: tpdImageMap[String(d.id)] || localImages[0],
  Loc_name: d.Loc_name,
  Description: d.Description,
  Category: fixCategory(toArray(d.Category)),
  Seasons: toArray(d.Seasons),
  Travel_Partner: toArray(d["Travel Partner"] || d.Travel_Partner),
  Activities: toArray(d.Activities),
  State: d.State,
  Address: d.Address,
  Min_Price: d.Min_Price,
  Max_Price: d.Max_Price,
  Currency: d.Currency,
}));

const allDestinations = [...normalizedPlaces, ...normalizedTPD];

async function seed() {
  try {
    await connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Destination.deleteMany({});
    console.log("Cleared existing destinations");

    await Destination.insertMany(allDestinations);
    console.log(`Inserted ${allDestinations.length} destinations`);

    await disconnect();
    console.log("Done!");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
