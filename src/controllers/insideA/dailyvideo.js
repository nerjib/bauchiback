const express = require('express');
const moment = require ('moment')
const router = express.Router();
const db = require('../../db/index');
const dotenv = require('dotenv');
const upload = require('../multer')
const cloudinary = require('../cloudinary')






router.post('/', upload.single('file'),  async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'dailyvideo' ,req.body.title+'_'+(new Date()).getTime());

    if (req.method === 'POST') {
        const urls = []
        const file = req.file.path;
          const newPath = await uploader(file)
          urls.push(newPath.url)
    
    const createUser = `INSERT INTO
      bauincidents(title, comments, fileurl, time) VALUES ($1, $2, $3, $4) RETURNING *`;
    console.log(req.body)
    const values = [
    req.body.title,
    req.body.comment,
    urls[0],
    moment(new Date())
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
    const getAllQ = `SELECT * FROM dailyvideo order by id desc`;
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
