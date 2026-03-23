import express from 'express';
const router = express.Router();
import db from '../db/connector.js';

router.get('/', async function(req, res, next) {
  const weapon = await db.query('SELECT * FROM deadSpace');

  const modWeapons = weapon.rows.map(w => {
    return {
      ...w,
      created_at: w.created_at.toLocaleDateString()
    }
  })
  res.render('dead_space', { weapons: modWeapons || [] });
});

router.get('/createGun', async function(req, res, next) {
  res.render('forms/dead_space_form');
})

router.post('/createGun', async function(req, res, next) {
  console.log("Submitted data: ", req.body);

const { name_of_gun, damage_type, damage_dealth, reload_seconds, additional_info } = req.body;

  async function addGun(name_of_gun, damage_type, damage_dealth, reload_seconds, additional_info) {
   try {
      const query = `
      INSERT INTO deadSpace (
            name_of_gun, damage_type, damage_dealth, reload_seconds, additional_info
        )
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`;
   const res = await db.query(query, [name_of_gun, damage_type, damage_dealth, reload_seconds, additional_info]);

   } catch (err) 
      { console.error(err)
        throw err;
   }
}

try {
    await addGun(name_of_gun, damage_type, damage_dealth, reload_seconds, additional_info);
    
    res.redirect('/weapons');
  } catch (err) {
    res.status(500).send("Помилка при додаванні зброї. Можливо, вона вже існує.");
  }
});

export default router;
