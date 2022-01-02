const express = require('express');
const moment = require ('moment')
const router = express.Router();
const db = require('../db/index');
const dotenv = require('dotenv');
const upload = require('./multer')
const cloudinary = require('./cloudinary')


  
router.get('/allpu/:lga', async (req, res) => {
    const getAllQ = `SELECT count(*) FROM baupunits where lga=$1 and type=$2`;
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ,[req.params.lga, 'PRESIDENTIAL']);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  

  router.get('/votedpu/:lga/:type', async (req, res) => {
    const getAllQ = `SELECT count(*) FROM baupunits where lga=$1 and type=$2 and apc !=$3`;
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ,[req.params.lga,req.params.type,0]);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  

  
  router.get('/', async (req, res) => {
    const getAllQ = `SELECT * FROM baupunits  order by lga asc, ward asc, puid asc`;
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

  router.get('/getallpu/:type', async (req, res) => {
    const getAllQ = `SELECT * FROM baupunits where type=$1  order by lga asc, ward asc, puid asc`;
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ,[req.params.type]);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  
  router.get('/getalllgpu/:type/:lga', async (req, res) => {
    const getAllQ = `SELECT * FROM baupunits where type=$1 and lga=$2  order by lga asc, ward asc, puid asc`;
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ,[req.params.type,req.params.lga]);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  


  router.get('/getlga', async (req, res) => {
    const getAllQ = `SELECT distinct lga FROM baupunits  order by lga asc`;
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


  router.get('/getward/:lga', async (req, res) => {
    const getAllQ = `SELECT distinct ward FROM baupunits where lga=$1  order by ward asc`;
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ,[req.params.lga]);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  

  router.get('/lgabyward/:lga/:type', async (req, res) => {
    const getAllQ = `SELECT  sum (apc) as apc, sum(pdp) as pdp, sum(others) as others, ward FROM baupunits where lga=$1 and type=$2 group by ward  order by ward asc`;
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ, [req.params.lga, req.params.type]);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  



  router.get('/logdet', async (req, res) => {
    const getAllQ = `SELECT distinct pword, uname,ward,lga FROM baupunits order by lga asc, pword asc`;
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
  


  router.get('/allpuids', async (req, res) => {
    const getAllQ = `SELECT distinct pword, uname,ward,lga,puid,puname,remark FROM baupunits order by lga asc, ward asc, puid asc`;
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
  

  router.get('/apc', async (req, res) => {
    const getAllQ = `SELECT sum(apc) FROM punits`;
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
  router.get('/pdp', async (req, res) => {
    const getAllQ = `SELECT sum(pdp) FROM punits`;
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
  router.get('/others', async (req, res) => {
    const getAllQ = `SELECT sum(others) FROM punits`;
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
  router.get('/accredited', async (req, res) => {
    const getAllQ = `SELECT sum(accredited) FROM punits`;
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


  router.get('/wards/:ward', async (req, res) => {
    const getAllQ = `SELECT sum(apc) as apc, sum(pdp) as pdp, sum(others) as others, sum(accredited) as accredited FROM baupunits where ward=$1`;
    try {
      // const { rows } = qr.query(getAllQ);
      if(req.params.ward='GURE'){

      const { rows } = await db.query(getAllQ,['GURE/KAHUGU']);
      return res.status(201).send(rows);
      }
      else{
        const { rows } = await db.query(getAllQ,[req.params.ward]);
        return res.status(201).send(rows);
     
      }
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  
  

  router.get('/lga/:lga/:type', async (req, res) => {
    const getAllQ = `SELECT sum(apc) as apc, sum(pdp) as pdp, sum(others) as others, sum(accredited) as accredited FROM baupunits where lga=$1 and type=$2`;
    try {
      // const { rows } = qr.query(getAllQ);
     
        const { rows } = await db.query(getAllQ,[req.params.lga, req.params.type]);
        return res.status(201).send(rows);
     
      
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  
  

  router.post('/send', async (req, res) => {
    /*   const {
           to,
           message
       } = req.body;
   */try{
    console.log(JSON.stringify(req.body)+ 'fjjjjjjjjjj')

   return res.status(201).send(req.body.message)
   console.log(req.body.to)
   /*let to =req.body.to
   let message = req.body.message
       sms.send({ to, message, enque: true })
           .then(response => {
               console.log(response);
               res.json(response);
           })
           .catch(error => {
               console.log(error);
               res.json(error.toString());
           });*/}catch(e){
             console.log(e)
           }
   });


  module.exports = router;
