import pkg from 'pg';
import fetch from 'node-fetch';
import 'dotenv/config';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgres://default:EGW37RNvTOiV@ep-small-flower-a4mgckd2-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
});

async function fetchAndStoreConditions(beach) {
  const baseUrl = 'https://services.surfline.com/kbyg/spots/forecasts';
  const spotId = beach.location_id;
  const days = 1;

  try {
    const urls = [
      `${baseUrl}/wave?spotId=${spotId}&days=${days}`,
      `${baseUrl}/wind?spotId=${spotId}&days=${days}`,
      `${baseUrl}/tides?spotId=${spotId}&days=${days}`,
      `${baseUrl}/weather?spotId=${spotId}&days=${days}`
    ];

    console.log('URLs to fetch:', urls);

    const [wave, wind, tides, weather] = await Promise.all(
      urls.map(url => fetch(url).then(res => res.json()))
    );

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert wave conditions
      const waveResult = await client.query(
        'INSERT INTO wave_conditions (height, period, direction) VALUES ($1, $2, $3) RETURNING id',
        [wave.data.wave[0].surf.min, wave.data.wave[0].period, wave.data.wave[0].direction]
      );

      // Insert wind conditions
      const windResult = await client.query(
        'INSERT INTO wind_conditions (speed, direction) VALUES ($1, $2) RETURNING id',
        [wind.data.wind[0].speed, wind.data.wind[0].direction]
      );

      // Insert tide conditions
      const tideResult = await client.query(
        'INSERT INTO tide_conditions (high_tide, low_tide) VALUES ($1, $2) RETURNING id',
        [tides.data.tides[0].height, tides.data.tides[1].height]
      );

      // Insert weather conditions
      const weatherResult = await client.query(
        'INSERT INTO weather_conditions (temperature, condition) VALUES ($1, $2) RETURNING id',
        [weather.data.weather[0].temperature, weather.data.weather[0].condition]
      );

      // Insert main conditions record
      await client.query(
        'INSERT INTO conditions (beach_id, wave_id, wind_id, tide_id, weather_id) VALUES ($1, $2, $3, $4, $5)',
        [beach.id, waveResult.rows[0].id, windResult.rows[0].id, tideResult.rows[0].id, weatherResult.rows[0].id]
      );

      await client.query('COMMIT');
      console.log('Conditions stored successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error fetching and storing conditions:', error);
  }
}

async function fetchAllBeachesAndConditions() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, location_id FROM beaches');
    const beaches = result.rows;

    for (const beach of beaches) {
      await fetchAndStoreConditions(beach);
    }

    console.log('Conditions fetched and stored for all beaches');
  } catch (error) {
    console.error('Error fetching beaches:', error);
  } finally {
    client.release();
  }
}

// Run the script
fetchAllBeachesAndConditions();
