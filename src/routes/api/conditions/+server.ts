import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import type { Conditions } from '../../types';

export const GET: RequestHandler = async ({ url }) => {
  const beachId = url.searchParams.get('beachId');

  if (!beachId) {
    return json({ error: 'Beach ID is required' }, { status: 400 });
  }

  try {
    const client = await db.connect();
    try {
      const result = await client.query(`
        SELECT 
          c.timestamp,
          w.height_min, w.height_max, w.height_avg, w.height_human_relation, w.period, w.direction as wave_direction,
          wind.speed as wind_speed, wind.direction as wind_direction,
          t.high_tide, t.low_tide,
          wt.temperature, wt.condition as weather_condition
        FROM conditions c
        JOIN wave_conditions w ON c.wave_id = w.id
        JOIN wind_conditions wind ON c.wind_id = wind.id
        JOIN tide_conditions t ON c.tide_id = t.id
        JOIN weather_conditions wt ON c.weather_id = wt.id
        WHERE c.beach_id = $1
        ORDER BY c.timestamp DESC
        LIMIT 1
      `, [beachId]);

      if (result.rows.length === 0) {
        return json({ error: 'No conditions found for this beach' }, { status: 404 });
      }

      const row = result.rows[0];
      const conditions: Conditions = {
        timestamp: row.timestamp,
        wave: {
          height: {
            min: row.height_min,
            max: row.height_max,
            avg: row.height_avg,
            humanRelation: row.height_human_relation
          },
          period: row.period,
          direction: row.wave_direction
        },
        wind: {
          speed: row.wind_speed,
          direction: row.wind_direction
        },
        tide: {
          high_tide: row.high_tide,
          low_tide: row.low_tide
        },
        weather: {
          temperature: row.temperature,
          condition: row.weather_condition
        }
      };

      return json(conditions);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  const condition = await request.json();
  try {
    const { rows } = await db.sql`
      INSERT INTO conditions (
        beach_id, wave_height, wind_speed, wind_direction, temperature, tide
      ) VALUES (
        ${condition.beachId}, ${condition.waveHeight}, ${condition.windSpeed}, 
        ${condition.windDirection}, ${condition.temperature}, ${condition.tide}
      )
      RETURNING *
    `;
    return json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding condition:', error);
    return json({ error: 'Failed to add condition' }, { status: 500 });
  }
};