import { recommendDestinations } from './recommendDestinations.js';

async function runRecommendation() {
  const userEmail = 'jessica@gmail.com'; // Pass user's email
  const recommendations = await recommendDestinations(userEmail);

  console.log('Top Recommendations:', recommendations);
}

runRecommendation();