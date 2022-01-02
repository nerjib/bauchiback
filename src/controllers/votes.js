const express = require('express');
const moment = require ('moment')
const router = express.Router();
const db = require('../db/index');
const dotenv = require('dotenv');
const upload = require('./multer')
const cloudinary = require('./cloudinary')



const updateResult = async(apc,pdp,ypp,prp,invalid,others, ward, puid, accredited,resulturl,lga,type)=>{
  //console.log(puid+' yyyyy '+ ward +' gggg '+ cr)
  const getAllQ = `update baupunits set apc=$1, pdp=$2,ypp=$10, prp=$11, invalid=$12, others=$3, updatedat=$4, accredited=$5, status=$8, resulturl=$9 where ward=$6 and puid=$7 and lga=$13 and type=$14`
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[apc,pdp,others,moment(new Date()),accredited,ward,puid,'completed',resulturl,ypp,prp,invalid,lga, type]);
   
    return rows;
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return ({ message: 'User with that EMAIL already exist' });
    }
    return (`${error} jsh`);

  }

}

const updateCollationResult = async(apc,pdp,others,ypp,prp,invalid, ward, puid, accredited,resulturl,lga, type)=>{
  //console.log(puid+' yyyyy '+ ward +' gggg '+ cr)
  const getAllQ = `update baucunits set apc=$1, pdp=$2, others=$3,ypp=$10, prp=$11, invalid=$12, updatedat=$4, accredited=$5, status=$8, resulturl=$9 where ward=$6 and puid=$7 and lga=$13 and type=$14`
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[apc,pdp,others,moment(new Date()),accredited,ward,puid,'completed',resulturl,ypp,prp,invalid,lga, type]);
   
    return rows;
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return ({ message: 'User with that EMAIL already exist' });
    }
    return (`${error} jsh`);

  }

}


router.post('/', upload.single('file'),  async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path,'resultsheets', req.body.lga+'_'+req.body.ward+req.body.puid+'_'+(new Date()).getTime());

/*
    cloudinary.uploader.upload(req.file.path,  function (result) {
          console.log(result.secure_url)
          res.send({imgurl:result.secure_url})
         Activity.UpdateBeneficiary(req, res, result.secure_url);
        });

*/

    if (req.method === 'POST') {
        const urls = []
        const file = req.file.path;
    //    for (const file of files) {
       //   const { path } = file;
          const newPath = await uploader(file)
          urls.push(newPath.url)
         // fs.unlinkSync(path)
      //  }
    
   // cloudinary.uploader.upload(req.file.path, async (result)=> {
    
    const createUser = `INSERT INTO
      bauresults(puid, puname, ward,remark, apc, pdp, time, imgurl, sender, accredited, prp, ypp, invalid,lga,type,year)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11, $12, $13, $14, $15, $16) RETURNING *`;
    console.log(req.body)
    const values = [
    req.body.puid,
    req.body.puname,
    req.body.ward,
    req.body.remark,
    req.body.apc,
    req.body.pdp,
    moment(new Date()),
    urls[0],
    req.body.sender,
    req.body.accredited,
    req.body.prp,
    req.body.ypp,
    req.body.invalid,
    req.body.lga,
    req.body.type,
    req.body.year
      ];
    try {
    const { rows } = await db.query(createUser, values);
    // console.log(rows);
    let other = parseInt(req.body.prp)+parseInt(req.body.ypp)+parseInt(req.body.invalid)
     await updateResult( req.body.apc,  req.body.pdp,req.body.ypp,req.body.prp,req.body.invalid, other,req.body.ward,req.body.puid,req.body.accredited,urls[0],req.body.lga,req.body.type)
    return res.status(201).send(rows);
    } catch (error) {
    return res.status(400).send(error);
    }
  
  //  },{ resource_type: "auto", public_id: `ridafycovers/${req.body.title}` })

} else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }

  });



  router.post('/collation', upload.single('file'),  async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path,'collation', req.body.ward+req.body.puid+'_'+(new Date()).getTime());

/*
    cloudinary.uploader.upload(req.file.path,  function (result) {
          console.log(result.secure_url)
          res.send({imgurl:result.secure_url})
         Activity.UpdateBeneficiary(req, res, result.secure_url);
        });

*/

    if (req.method === 'POST') {
        const urls = []
        const file = req.file.path;
    //    for (const file of files) {
       //   const { path } = file;
          const newPath = await uploader(file)
          urls.push(newPath.url)
         // fs.unlinkSync(path)
      //  }
    
   // cloudinary.uploader.upload(req.file.path, async (result)=> {
    
    const createUser = `INSERT INTO
      baucollationresults(puid, puname, ward,remark, apc, pdp,  time, imgurl, sender, accredited,prp,ypp,invalid,lga,type,year)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12,$13,$14,$15,$16) RETURNING *`;
    console.log(req.body)
    const values = [
    req.body.puid,
    req.body.puname,
    req.body.ward,
    req.body.remark,
    req.body.apc,
    req.body.pdp,
    moment(new Date()),
    urls[0],
    req.body.sender,
    req.body.accredited,
    req.body.prp,
    req.body.ypp,
    req.body.invalid,
    req.body.lga,
    req.body.type,
    req.body.year
      ];
    try {
    const { rows } = await db.query(createUser, values);
    // console.log(rows);
    let other = parseInt(req.body.prp)+parseInt(req.body.ypp)+parseInt(req.body.invalid)

     await updateCollationResult( req.body.apc, req.body.pdp,other,req.body.ypp,req.body.prp,req.body.invalid,req.body.ward,req.body.puid,req.body.accredited,urls[0],req.body.lga,req.body.type)
    return res.status(201).send(rows);
    } catch (error) {
    return res.status(400).send(error);
    }
  
  //  },{ resource_type: "auto", public_id: `ridafycovers/${req.body.title}` })

} else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }

  });
 
 

/*
    router.post('/', async (req, res) => {
      const createUser = `INSERT INTO
      results(puid, puname, ward,remark, apc, pdp, others, time, imgurl)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    console.log(req.body)
    const values = [
    req.body.puid,
    req.body.puname,
    req.body.ward,
    req.body.remark,
    req.body.apc,
    req.body.pdp,
    req.body.others,
    moment(new Date()),
    req.body.imgurl
      ];
    try {
    const { rows } = await db.query(createUser, values);
    // console.log(rows);
    
    return res.status(201).send(rows);
    } catch (error) {
    return res.status(400).send(error);
    }
    
    });
  */
  
  
  router.get('/', async (req, res) => {
    const getAllQ = `SELECT * FROM bauresults order by id desc`;
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

  router.get('/cunits', async (req, res) => {
    const getAllQ = `SELECT * FROM baucunits order by ward`;
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
  router.get('/aggcunits', async (req, res) => {
    const getAllQ = `SELECT sum(apc) as apc, sum(pdp) as pdp, sum(others) as others, sum(accredited) as accredited FROM baucunits`;
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

  
  router.get('/cresults', async (req, res) => {
    const getAllQ = `SELECT * FROM baucollationresults order by id desc`;
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


  router.get('/byward/:ward', async (req, res) => {
    const getAllQ = `SELECT * FROM bauresults where ward= $1`;
    try {
    //  let ward = req.params.ward='GURE'?'GURE/KAHUGU':req.params.ward
      // const { rows } = qr.query(getAllQ);
      if(req.params.ward='GURE'){
      const { rows } = await db.query(getAllQ,['GURE/KAHUGU']);
      return res.status(201).send(rows);}
      else{
        const { rows } = await db.query(getAllQ, [req.params.ward]);
        return res.status(201).send(rows);
      }
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  


  

  router.get('/pu/:ward/:puid', async (req, res) => {
    const getAllQ = `SELECT * FROM bauresults where ward=$1 and puid=$2`;
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ, [req.params.ward, req.params.puid]);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });

  module.exports = router;
