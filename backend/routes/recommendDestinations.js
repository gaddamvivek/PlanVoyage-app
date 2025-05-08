import Destination from '../models/Destinations.js';
import UserPreference from '../models/userPreferences.js';

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

async function getUniqueActivities(destinations) {
  const uniqueActivities = new Set();
  destinations.forEach(destination => {
    if (destination && Array.isArray(destination.Activities)) {
      destination.Activities.forEach(activity => uniqueActivities.add(activity));
    }
  });
  return Array.from(uniqueActivities);
}

async function createFeatureVector(destination, allActivities, maxPrice) {
  const predefinedCategories = ['Islands', 'Mountains', 'Beaches', 'Cities & Lights', 'Desserts', 'Historical & Cultural Sites', 'Scenic', 'Theme Parks & Resorts','Forests & Jungles','Sports'];
  const seasons = ['Summer', 'Spring', 'Fall', 'Winter'];
  const travelPartners = ['Solo', 'Couple', 'Family', 'Friends'];

  const vector = [];

  predefinedCategories.forEach(category => {
    vector.push(destination.Category?.includes(category) ? 1 : 0);
  });

  seasons.forEach(season => {
    vector.push(destination.Seasons?.includes(season) ? 1 : 0);
  });

  travelPartners.forEach(partner => {
    vector.push(destination.Travel_Partner?.includes(partner) ? 1 : 0);
  });

  allActivities.forEach(activity => {
    vector.push(destination.Activities?.includes(activity) ? 1 : 0);
  });

  const avgPrice = (destination.Min_Price + destination.Max_Price) / 2;
  const normalizedPrice = maxPrice ? avgPrice / maxPrice : avgPrice / 1000;
  vector.push(normalizedPrice);

  return vector;
}

export async function recommendDestinations(email) {
  try {
    const userLikes = await UserPreference.find({ email, preference: 'like' });
    const userDislikes = await UserPreference.find({ email, preference: 'dislike' });
    const userBudgetPref = await UserPreference.findOne({ email, Budget: { $exists: true } });

    if (!userLikes.length) {
      console.log('No liked destinations found for this user.');
      return [];
    }

    const allDestinations = await Destination.find();

    let filteredDestinations = allDestinations;
    let userBudget = null;

    if (userBudgetPref?.Budget) {
      userBudget = parseFloat(userBudgetPref.Budget);
      if (!isNaN(userBudget)) {
        filteredDestinations = allDestinations.filter(dest => {
          const avg = (dest.Min_Price + dest.Max_Price) / 2;
          return avg <= userBudget;
        });
      }
    }

    if (!filteredDestinations.length) {
      console.log('No destinations under budget.');
      return [];
    }

    const allActivities = await getUniqueActivities(filteredDestinations);
    const maxAvgPrice = Math.max(...filteredDestinations.map(d => (d.Min_Price + d.Max_Price) / 2));

    const likedVectors = [];
    for (const like of userLikes) {
      const likedDestination = filteredDestinations.find(dest => dest.id === like.placeId);
      if (likedDestination) {
        const vector = await createFeatureVector(likedDestination, allActivities, maxAvgPrice);
        likedVectors.push(vector);
      }
    }

    if (!likedVectors.length) {
      console.log('No liked destinations found in budget.');
      return [];
    }

    const profileVector = likedVectors[0].map((_, idx) => {
      const sum = likedVectors.reduce((acc, vec) => acc + vec[idx], 0);
      return sum / likedVectors.length;
    });

    let dislikeProfileVector = null;
    if (userDislikes.length) {
      const dislikedVectors = [];
      for (const dislike of userDislikes) {
        const dislikedDestination = filteredDestinations.find(dest => dest.id === dislike.placeId);
        if (dislikedDestination) {
          const vector = await createFeatureVector(dislikedDestination, allActivities, maxAvgPrice);
          dislikedVectors.push(vector);
        }
      }
      if (dislikedVectors.length) {
        dislikeProfileVector = dislikedVectors[0].map((_, idx) => {
          const sum = dislikedVectors.reduce((acc, vec) => acc + vec[idx], 0);
          return sum / dislikedVectors.length;
        });
      }
    }

    const recommendations = [];

    for (const destination of filteredDestinations) {
      const destinationVector = await createFeatureVector(destination, allActivities, maxAvgPrice);
      let similarity = cosineSimilarity(profileVector, destinationVector);

      if (dislikeProfileVector) {
        const dislikeSim = cosineSimilarity(dislikeProfileVector, destinationVector);
        similarity = Math.max(0, similarity - 0.5 * dislikeSim);
      }

      recommendations.push({ destination, similarity });
    }

    recommendations.sort((a, b) => b.similarity - a.similarity);

    const likedIds = new Set(userLikes.map(like => like.placeId));
    const seen = new Set();
    const final = recommendations.filter(rec => {
      const id = rec.destination.id;
      if (seen.has(id) || likedIds.has(id)) return false;
      seen.add(id);
      return true;
    });

    return final.slice(0, 15).map(rec => ({
      _id: rec.destination._id,
      id: rec.destination.id,
      Loc_name: rec.destination.Loc_name,
      similarity: rec.similarity.toFixed(3),
      Image: rec.destination.Image,
      State: rec.destination.State,
      Activities: rec.destination.Activities,
      Min_Price: rec.destination.Min_Price,
      Max_Price: rec.destination.Max_Price
    }));

  } catch (error) {
    console.error('Error recommending destinations:', error);
    throw error;
  }
}

