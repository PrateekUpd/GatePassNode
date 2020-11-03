const express = require('express')
const router = express.Router()
const GatePass = require('../models/gatePass')
const GpArray = require('../models/gpArray')
const CreateForm = require('../models/createForm')
const department = require('../models/department')
const User = require('../models/user');



// router.post('/add', async (req, res) => {
//     // const gatePasses = new GatePass(req.body) 
//     const gatePasses = req.body.map(element => new GatePass(element));
//     console.log(gatePasses)
//     for(i=0; i<gatePasses.length; i++) {
//     try {
//         await gatePasses[i].save()
//             .then(item => {
//                 // res.json(item)
//                 console.log('New GatePass added w/ id: ',item.id)
//             })
//     } catch (err) {
//         console.log(err)
//         res.status(400).send("unable to save to database")
//     }
//     // console.log(req.body)
// }
// })

// router.post('/add', async (req, res) => {
//     // const gatePasses = new GatePass(req.body) 
//     // sentResp = false;
//     const gatePasses = req.body.map(element => new GatePass(gpList, element));
//     console.log(gatePasses)
//         try {
//             await gatePasses.save()
//                 .then(item => {
//                     res.json(gatePasses)
//                     // res.status(200).send("Successfully created")
//                     console.log('New GatePass added w/ id: ', item.id)
//                 })
//         } catch (err) {
//             console.log(err)
//             res.status(400).send("unable to save to database")
//         }
//         // console.log(req.body)
// })


// router.post('/add', async (req, res) => {
//     // const gatePasses = new GatePass(req.body) 
//     sentResp = false;
//     const gatePasses = req.body.map(element => new GatePass(element));
//     console.log(gatePasses)
//     const gatePassArray = new GpArray
//     for(const gatePass of gatePasses) {
//         // gatePassArray.gpArray.item(gatePass.id) 
//        gatePassArray.gpArrayElement.push(gatePass.id)
//         console.log(gatePass.id)
//     }
//     // console.log(gatePassArray)
//     try {
//         await gatePassArray.save().then(item => console.log('New gpArray added ', item.gpArrayElement))
//     } catch(err) {
//         console.log(err)
//         res.status(400).send("unable to save to database")
//     }

//     for (const gatePass of gatePasses) {
//         try {
//             await gatePass.save()
//                 .then(item => {
//                     if(sentResp == false) {
//                     res.json(gatePasses)
//                     sentResp = true
//                     }
//                     // res.status(200).send("Successfully created")
//                     console.log('New GatePass added w/ id: ', item.id)
//                 })
//         } catch (err) {
//             console.log(err)
//             res.status(400).send("unable to save to database")
//         }
//         // console.log(req.body)
//     }
// })



router.get('/search/:no/:print/:project', async (req, res) => {
  console.log(req.params)
  let query = GpArray.find()
  if (req.params.print === '1') {
    query = query.where('status', 'Authorized')
  }
  query = query.where('createForm.selectedProject', req.params.project)
  // searchOptions.status = req.params.status,
  // searchOptions.selectedType = req.params.type
  query = query.where('gatePassNo', parseInt(req.params.no))
  try {
    const gpArrays = await query
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Project.selectedProject',
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Project.selectedProject',
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate('gatePass.unit')
      .populate('createForm.selectedDepartment')
      .populate('createForm.selectedProject')
      .exec()
    res.json(gpArrays)
    console.log(gpArrays)
  } catch (err) {
    console.log(err)
    res.json('Not able to find user')
  }
})

router.post('/GpArray/add', async (req, res) => {
  let searchOptions = {}
  let mySort = { gatePassNo: -1 }
  let lgpArray
  let gatePassNoAssign
  try {
    lgpArray = await GpArray.find(searchOptions).sort(mySort).limit(1)
  } catch (err) {
    console.log(err)
  }
  console.log('lgpArray[0] ', lgpArray[0])
  if (lgpArray[0] === undefined) {
    gatePassNoAssign = 1
  }
  else {
    gatePassNoAssign = lgpArray[0].gatePassNo + 1
    console.log(gatePassNoAssign, 'GatePassNoAssign')
  }
  const gpArray = new GpArray(req.body);
  gpArray.gatePassNo = gatePassNoAssign
  try {
    await gpArray.save()
    gpArray2 = await GpArray.findById(gpArray._id).populate({
      path: 'createdBy',
      populate: {
        path: 'Project.selectedProject',
      }
    })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate('gatePass.unit')
      .populate('createForm.selectedDepartment')
      .populate('createForm.selectedProject')
      .exec()
    // console.log('New GpArray added w/ id ',gpArray.id)
    console.log(gpArray2)
    res.json(gpArray2)
  } catch (err) {
    console.log(err)
    res.status(400).send("unable to save to database")
  }
  // console.log(gpArray)
})

router.post('/GpArray/inbox', async (req, res) => {
  let searchOptions = {}
  let mySort = { createdAt: -1 }
  let query = GpArray.find()
  console.log(req.body)
  // req.body.authToId.foreach(authTo => {
  //   query = query.where('createdBy', authTo)
  // });
  // var arrLength = req.body.length;
  // for(var i=0; i<arrLength; i++) {
  //   query = query.where('createdBy', req.body[i])
  // }
  for (const authTo of req.body) {
    query = query.where('createdBy', authTo)
  }
  query = query.where('status', 'Created')
  try {
    const gpArray = await query.sort(mySort).populate({
      path: 'createdBy',
      populate: {
        path: 'Project.selectedProject',
      }
    })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Project.selectedProject',
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate('gatePass.unit')
      .populate('createForm.selectedDepartment')
      .populate('createForm.selectedProject')
      .exec()
    res.json(gpArray)
  } catch (err) {
    res.json([])
    console.log(err)
  }
  
})

router.get('/GpArray/inbox/:authorizer', async (req, res) => {
  console.log('AUTHORIZED API HIT')
  let mySort = { createdAt: -1 }
  let query = GpArray.find()
  console.log('Authorizer',req.params.authorizer)
  // req.body.authToId.foreach(authTo => {
  //   query = query.where('createdBy', authTo)
  // });
  // var arrLength = req.body.length;
  // for(var i=0; i<arrLength; i++) {
  //   query = query.where('createdBy', req.body[i])
  // }
  query = query.where('authorized', req.params.authorizer)
  try {
    const gpArray = await query.sort(mySort).populate({
      path: 'createdBy',
      populate: {
        path: 'Project.selectedProject',
      }
    })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Project.selectedProject',
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate('gatePass.unit')
      .populate('createForm.selectedDepartment')
      .populate('createForm.selectedProject')
      .exec()
      console.log('gpArray', gpArray)
    res.json(gpArray)
  } catch (err) {
    res.json([])
    console.log(err)
  }
  
})


router.post('/GpArray/filter', async (req, res) => {
  console.log('FILTER HIT')
  let query = GpArray.find()
  if (req.body.selectedDepartment != 'All') {
    query = query.where('createForm.selectedDepartment', req.body.selectedDepartment)
  }
  if (req.body.selectedType === 'Returnable' || req.body.selectedType === 'Non-Returnable') {
    query = query.where('createForm.selectedType', req.body.selectedType)
  }
  else if (req.body.selectedType === 'Pending Returnable') {
    query = query.where('status', 'Exited') && query.where('createForm.selectedType', 'Returnable')
  }
  if (req.body.selectedOwner != 'All') {
    query = query.where('createForm.selectedOwner', req.body.selectedOwner)
  }
  if (req.body.selectedMovement != 'All') {
    query = query.where('createForm.selectedMovement', req.body.selectedMovement)
  }
  query = query.where('createForm.selectedProject', req.body.selectedProject)
  query = query.lte('createdAt', req.body.to)
  query = query.gte('createdAt', req.body.from)
  try {
    const gpArray = await query.populate({
      path: 'createdBy',
      populate: {
        path: 'Project.selectedProject',
      }
    })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Project.selectedProject',
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate('gatePass.unit')
      .populate('createForm.selectedDepartment')
      .populate('createForm.selectedProject')
      .exec()
    res.json(gpArray)
  } catch (err) {
    res.json([])
    console.log(err)
  }

})

router.get('/GpArray/getall', async (req, res) => {
  let searchOptions = {}
  if (req.query._id != null && req.query._id != '') {
    searchOptions._id = new RegExp(req.query._id, 'i')
  }
  try {
    const gpArray = await GpArray.find(searchOptions)
      //  .populate('authorized')
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Project.selectedProject',
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Project.selectedProject',
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate('gatePass.unit')
      .populate('createForm.selectedDepartment')
      .populate('createForm.selectedProject')
      .exec()
    res.json(gpArray)
    console.log(gpArray)
  } catch (err) {
    console.log(err)
    res.json('Not able to find GpArray')
  }
})

router.put('/GpArray/update', async (req, res) => {
  let gpArray
  let gpArray2
  try {
    gpArray = await GpArray.findById(req.body._id)
    gpArray.createForm = req.body.createForm
    gpArray.gatePass = req.body.gatePass
    gpArray.authorized = req.body.authorized
    gpArray.status = req.body.status
    if (gpArray.authorized != null) {
      gpArray.authorizedDate = Date.now()
    }
    if (req.body.status === 'Exited') {
      gpArray.exitDate = Date.now()
    }
    await gpArray.save()
    gpArray2 = await GpArray.findById(req.body._id).populate({
      path: 'createdBy',
      populate: {
        path: 'Project.selectedProject',
      }
    })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'createdBy',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Project.selectedProject',
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Grade.selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'Department.selectedDepartment'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedProject'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedGrade'
        }
      })
      .populate({
        path: 'authorized',
        populate: {
          path: 'selectedDepartment'
        }
      })
      .populate('gatePass.unit')
      .populate('createForm.selectedDepartment')
      .populate('createForm.selectedProject')
      .exec()
    res.json(gpArray2)
    console.log('GpArray updated ')

  } catch (err) {
    console.log(err)
    res.status(400).send("unable to update")
  }
  console.log(gpArray2)
})

router.delete('/GpArray/delete/:id', async (req, res) => {
  let gpArray
  try {
      gpArray = await GpArray.findById(req.params.id)
      console.log(gpArray)
      await gpArray.remove()
      res.json(gpArray)
  } catch {
      if (gpArray == null) {
          res.status(404)
      } else {
          // res.redirect(`/authors/${author.id}`)
          res.status(400).send("unable to delete")
      }

  }
})


// router.post('/createForm/add', async (req, res) => {
//     const createForm = new CreateForm(req.body);
//     gatePassArray.createFormRef = createForm.id
//     await gatePassArray.save()
//     // const user = new User({  
//     //             _id: new mongoose.Types.ObjectId(),
//     //             email: req.body.email,
//     //             password: req.body.password
//     //         })
//     try{
//         await createForm.save()
//         .then(item => {
//             res.json(item)
//             console.log('New CreateForm added w/ id ',item.id)
//         })
//     } catch(err) {
//         console.log(err)
//         res.status(400).send("unable to save to database")
//     }
//     console.log(req.body)
// })

router.get('/getall', async (req, res) => {
  let searchOptions = {}
  if (req.query._id != null && req.query._id != '') {
    searchOptions._id = new RegExp(req.query._id, 'i')
  }
  try {
    const gatePasses = await GpArray.find(searchOptions)
      .populate('gpArrayElement')
      .exec()

    res.json(gatePasses[0].gpArrayElement)
    console.log(gatePasses[0].gpArrayElement)
  } catch (err) {
    console.log(err)
    res.json('Not able to find gatePasses')
  }
})



// router.post('/add', async (req, res) => {
//     // const gatePasses = new gpArray(req.body) 
//     const gatePasses = req.body.map(element => new GatePass(element));
//     console.log(gatePasses)
//         sentResp = false;
//     for (gatePass of gatePasses) {
//         try {
//             await gatePass.save()
//                 .then(item => {
//                     if(sentResp == false) {
//                     res.json(gatePasses)
//                     sentResp = true
//                     }
//                     // res.status(200).send("Successfully created")
//                     console.log('New GatePass added w/ id: ', item.id)
//                 })
//         } catch (err) {
//             console.log(err)
//             res.status(400).send("unable to save to database")
//         }
//         // console.log(req.body) 
//     }
// })


module.exports = router