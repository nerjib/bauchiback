const express = require('express');
const moment = require ('moment')
const router = express.Router();
const db = require('../../db/index');
const dotenv = require('dotenv');
const upload = require('../multer')
const cloudinary = require('../cloudinary')






router.post('/', upload.single('file'),  async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Advert' ,req.body.title+'_'+req.body.company+'_'+(new Date()).getTime());

    if (req.method === 'POST') {
        const urls = []
        const file = req.file.path;
          const newPath = await uploader(file)
          urls.push(newPath.url)
    
    const createUser = `INSERT INTO
      advert(title, description, price, duration, fileurl1, fileurl2, fileurl3, category,
         time, company, location, contact) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
    console.log(req.body)
    const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.duration,
    urls[0],
    urls[1],
    urls[2],
    req.body.url,
    moment(new Date()),
    req.body.company,
    req.body.location,
    req.body.contact
      ];
    try {
    const { rows } = await db.query(createUser, values);
    // console.log(rows);
    return res.status(201).send(rows);
    } catch (error) {
    return res.status(400).send(error);
    }
  
  
} else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }

  });
 

  router.get('/', async (req, res) => {
    const getAllQ = `SELECT * FROM advert order by id desc`;
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  


  module.exports = router;
