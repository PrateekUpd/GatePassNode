const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Project = require('../models/project')
const Grade = require('../models/grade')
const Department = require('../models/department')
const mongoose = require('mongoose')
const user = require('../models/user')
const Unit = require('../models/unit')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passportOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
};
const SECRET = 'SECRET_KEY'
const refreshTokens = {}

passport.use(new JwtStrategy(passportOpts, function (jwtPayload, done) {
    const expirationDate = new Date(jwtPayload.exp * 1000)
    if(expirationDate < new Date()) {
        return done(null, false)
    }
    done(null, jwtPayload);
}))

passport.serializeUser(function (user, done) {
    done(null, user.username)
  });

router.get('/users', async (req, res) => {
    let searchOptions = {}
    if (req.query.empId != null && req.query.empId != '') {
        searchOptions.empId = new RegExp(req.query.empId, 'i')
    }
    try {
        const users = await User.find(searchOptions).populate('selectedGrade')
            .populate('selectedDepartment')
            .populate('Project.selectedProject')
            .exec()
        for (const user of users) {
            for (const Pro of user.Project) {
                if (Pro.to === null) {
                    user.selectedProject = Pro.selectedProject
                }
            }
        }
        res.json(users)
        console.log(users)
    } catch (err) {
        console.log(err)
        res.json('Not able to find users')
    }
})

router.get('/authUsers/:selectedAuthorization', async (req, res) => {
    let searchOptions = {}
    searchOptions.selectedAuthorization = req.params.selectedAuthorization
    try {
        const authUsers = await User.find(searchOptions)
            .populate('selectedProject')
            .populate('selectedGrade')
            .populate('selectedDepartment')
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedGrade',
                },
            })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedProject',
                },
            })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedDepartment',
                },
            })
            .exec()
        res.json(authUsers)
        console.log(authUsers)
    } catch (err) {
        res.json([])
        console.log(err)
    }
})

router.post('/addAuthorization/:authId', async (req, res) => {
    try {
        const authUser = await User.findById(req.params.authId)
        authUser.authorizedTo.push(req.body)
        await authUser.save()
        const authUserPop = await User.findById(req.params.authId).populate({
            path: 'authorizedTo',
            populate: {
                path: 'selectedGrade',
            },
        })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedProject',
                },
            })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedDepartment',
                },
            })
            .populate('selectedProject')
            .populate('selectedGrade')
            .populate('selectedDepartment')
            .exec()
        res.json(authUserPop)
    } catch (err) {
        console.error(err)
    }
})

router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('selectedProject')
            .populate('selectedGrade')
            .populate('selectedDepartment')
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedGrade',
                },
            })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedProject',
                },
            })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedDepartment',
                },
            })
            .exec()
        res.json(user)
        console.log(user)
    } catch (err) {
        console.log(err)
        res.json('Not able to find user')
    }
})

router.get('/user/search/:name/:selectedAuthorization/:selectedProject', async (req, res) => {
    console.log(req.params)
    let query = User.find()
    query = query.where('selectedProject', req.params.selectedProject)
    if (req.params.selectedAuthorization == 'true') {
        query = query.where('selectedAuthorization', true)
    }
    else {
        query = query.where('selectedCreation', true)
    }

    if (req.params.name != null && req.params.name != '') {
        query = query.regex('name', new RegExp(req.params.name, 'i'))
    }
    try {
        const users = await query
                        .populate('selectedProject')
                        .populate('selectedGrade')
                        .populate('selectedDepartment')
                        .populate('authorizedTo')
        res.json(users)
        console.log(users)
    } catch (err) {
        console.log(err)
        res.json('Not able to find user')
    }
})

router.get('/projects', async (req, res) => {
    let searchOptions = {}
    // if (req.query.empId != null && req.query.empId != '') {
    //     searchOptions.empId = new RegExp(req.query.empId, 'i')
    // }
    try {
        const projects = await Project.find(searchOptions)
        console.log(projects)
        res.json(projects)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.get('/units', async (req, res) => {
    let searchOptions = {}
    // if (req.query.empId != null && req.query.empId != '') {
    //     searchOptions.empId = new RegExp(req.query.empId, 'i')
    // }
    try {
        const units = await Unit.find(searchOptions)
        console.log(units)
        res.json(units)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.get('/grades', async (req, res) => {
    let searchOptions = {}
    // if (req.query.empId != null && req.query.empId != '') {
    //     searchOptions.empId = new RegExp(req.query.empId, 'i')
    // }
    try {
        const grades = await Grade.find(searchOptions)
        console.log(grades)
        res.json(grades)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.get('/departments', async (req, res) => {
    let searchOptions = {}
    // if (req.query.empId != null && req.query.empId != '') {
    //     searchOptions.empId = new RegExp(req.query.empId, 'i')
    // }
    try {
        const departments = await Department.find(searchOptions)
        console.log(departments)
        res.json(departments)

    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})


router.post('/register', async (req, res) => {
    let user
    if (req.body.selectedUserType === 'Security') {
        user = new User({
            name: req.body.name,
            empId: req.body.empId,
            password: req.body.password,
            // selectedGrade: req.body.selectedGrade,
            // selectedDepartment: req.body.selectedDepartment,
            selectedUserType: req.body.selectedUserType,
            selectedProject: req.body.selectedProject,
            Project: [{
                selectedProject: req.body.selectedProject
            }],
        })
    }
    else {
        user = new User({
            name: req.body.name,
            empId: req.body.empId,
            password: req.body.password,
            // selectedGrade: req.body.selectedGrade,
            // selectedDepartment: req.body.selectedDepartment,
            selectedAuthorization: req.body.selectedAuthorization,
            selectedCreation: req.body.selectedCreation,
            selectedUserType: req.body.selectedUserType,
            authorizedTo: req.body.authorizedTo,
            selectedProject: req.body.selectedProject,
            selectedDepartment: req.body.selectedDepartment,
            selectedGrade: req.body.selectedGrade,
            Project: [{
                selectedProject: req.body.selectedProject
            }],
            Grade: [{
                selectedGrade: req.body.selectedGrade
            }],
            Department: [{
                selectedDepartment: req.body.selectedDepartment
            }]
        })
    }
    try {
        await user.save()
            .then(item => {
                res.json(item)
                console.log('New User added w/ id ', item.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to save to database")
    }
    console.log(req.body)
})

router.put('/user/update', async (req, res) => {
    let user
    try {
        user = await User.findById(req.body._id)
        for (const Pro of user.Project) {
            if (Pro.to === null && Pro.selectedProject._id != req.body.selectedProject._id) {
                Pro.to = Date.now();
                user.Project.push({
                    selectedProject: req.body.selectedProject
                })
                user.selectedProject = req.body.selectedProject
                break;
            }
        }
        if (user.selectedUserType != 'Security') {
            for (const Gra of user.Grade) {
                if (Gra.to === null && Gra.selectedGrade._id != req.body.selectedGrade._id) {
                    Gra.to = Date.now();
                    user.Grade.push({
                        selectedGrade: req.body.selectedGrade
                    })
                    user.selectedGrade = req.body.selectedGrade
                    break;
                }
            }
            for (const Dep of user.Department) {
                if (Dep.to === null && Dep.selectedDepartment._id != req.body.selectedDepartment._id) {
                    Dep.to = Date.now();
                    user.Department.push({
                        selectedDepartment: req.body.selectedDepartment
                    })
                    user.selectedDepartment = req.body.selectedDepartment
                    break;
                }
            }

            user.selectedAuthorization = req.body.selectedAuthorization
            user.selectedCreation = req.body.selectedCreation
            user.authorizedTo = req.body.authorizedTo
        }
        await user.save()
        // .then(item => {
        //     res.json(item)
        //     console.log('User updated ', item.id)
        // })
        let user2
        user2 = await User.findById(req.body._id)
            .populate('Project.selectedProject')
            .populate('Grade.selectedGrade')
            .populate('Department.selectedDepartment')
            .populate('selectedProject')
            .populate('selectedGrade')
            .populate('selectedDepartment')
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedGrade',
                },
            })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedProject',
                },
            })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedDepartment',
                },
            })
        res.json(user2)
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to update")
    }
    console.log(req.body)
})


// router.post('/login', async (req, res) => {
//     console.log(req.body)
//     try {
//         const user = await User.findOne({ empId: req.body.empId })
//             .populate('Project.selectedProject')
//             .populate('Grade.selectedGrade')
//             .populate('Department.selectedDepartment')
//             .populate('selectedProject')
//             .populate('selectedGrade')
//             .populate('selectedDepartment')
//             .populate({
//                 path: 'authorizedTo',
//                 populate: {
//                     path: 'selectedGrade',
//                 },
//             })
//             .populate({
//                 path: 'authorizedTo',
//                 populate: {
//                     path: 'selectedProject',
//                 },
//             })
//             .populate({
//                 path: 'authorizedTo',
//                 populate: {
//                     path: 'selectedDepartment',
//                 },
//             })
//         // const user1 = user.toJSON()
//         const userq = { 
//             'username': 'Prateek', 
//             'role': 'admin'
//         };
//         const token = jwt.sign(userq, process.env.SECRET, { expiresIn: 20 })
//         console.log("TOKEN: ")
//         console.log(token)
//         const refreshToken = randtoken.uid(256)
//         refreshTokens[refreshToken] = user
//         if (user.password === req.body.password) {
//             res.json({jwt: token, refreshToken: refreshToken})
//             console.log('Successfully logged in')
//         }
//     } catch {
//         res.send('User not found')
//     }
// })

router.post('/login', async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.findOne({ empId: req.body.empId })
            .populate('Project.selectedProject')
            .populate('Grade.selectedGrade')
            .populate('Department.selectedDepartment')
            .populate('selectedProject')
            .populate('selectedGrade')
            .populate('selectedDepartment')
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedGrade',
                },
            })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedProject',
                },
            })
            .populate({
                path: 'authorizedTo',
                populate: {
                    path: 'selectedDepartment',
                },
            })
            // var myJSON = user.toJSON()
        const userJwt = {
            'empId': user.empId,
            'name': user.name
        }
        if (user.password === req.body.password) {
            const token = jwt.sign(userJwt, process.env.SECRET, { expiresIn: 6000 })
            const refreshToken = randtoken.uid(256)
            refreshTokens[refreshToken] = userJwt
            res.json({user: user, jwt: token, refreshToken: refreshToken})
            console.log('Successfully logged in')
        }
        else {
            throw(401)
            // res.sendStatus(401)
        }

    }
    catch {
        res.sendStatus(404)
    }
})

router.post('/logout', async (req, res) => {
    console.log('LOGOUT HIT')
    try {
        const refreshToken = req.body.refreshToken
        if(refreshToken in refreshTokens) {
            delete refreshTokens[refreshToken]
        }
        res.sendStatus(204)
    }
    catch {
        res.sendStatus(400)
    }
})


router.post('/refresh', async (req, res) => {
    console.log('API HIT')
    const refreshToken = req.body.refreshToken
    try {
        // console.log(refreshTokens)
        if(refreshToken in refreshTokens) {
            const userJwt = refreshTokens[refreshToken]
            console.log('USER JWT',userJwt)
            // const user = {
            //     'user': refreshTokens[refreshToken],
            // }
            const token = jwt.sign(userJwt, process.env.SECRET, { expiresIn: 6000 })
            res.json({jwt: token})
        }
        else {
            res.sendStatus(401)
        }
    } catch {
        res.sendStatus(400)
    }
})

router.get('/random', passport.authenticate('jwt'), function (req, res) {
    res.json({ value: Math.floor(Math.random()*100) })
})

router.post('/project/add', async (req, res) => {
    const project = new Project(req.body);
    try {
        await project.save()
            .then(item => {
                res.json(item)
                console.log('New Project added w/ id ', item.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to save to database")
    }
    console.log(req.body)
})

router.post('/gate/add', async (req, res) => {
    console.log(req.body)
    try {
        const project = await Project.findById(req.body.selectedItem)
        project.gates.push({
            viewValue: req.body.viewValue
        })
        await project.save()
            .then(item => {
                const len = item.gates.length
                const gate = item.gates[len - 1]
                res.json(gate)
                console.log('New gate added w/ id ', gate.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to save to database")
    }

})

router.post('/unit/add', async (req, res) => {
    const unit = new Unit(req.body);
    try {
        await unit.save()
            .then(item => {
                res.json(item)
                console.log('New Unit added w/ id ', item.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to save to database")
    }
    console.log(req.body)
})

router.post('/grade/add', async (req, res) => {
    const grade = new Grade(req.body);
    try {
        await grade.save()
            .then(item => {
                res.json(item)
                console.log('New Grade added w/ id ', item.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to save to database")
    }
    console.log(req.body)
})

router.post('/department/add', async (req, res) => {
    const department = new Department(req.body);
    try {
        await department.save()
            .then(item => {
                res.json(item)
                console.log('New Department added w/ id ', item.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to save to database")
    }
    console.log(req.body)
})

router.put('/gate/update', async (req, res) => {
    let project
    let gateVar
    try {
        project = await Project.findById(req.body.selectedItem2)
        const selectedGate = project.gates.find(gate => gate.id == req.body.selectedItem)
        selectedGate.viewValue = req.body.update
        gateVar = selectedGate

        await project.save()
            .then(item => {
                res.json(gateVar)
                console.log('New gate added w/ id ', gateVar.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to update")
    }
    console.log(req.body)
})

router.put('/unit/update', async (req, res) => {
    let unit
    try {
        unit = await Unit.findById(req.body.selectedItem)
        unit.viewValue = req.body.update
        unit.tolerance = req.body.tolerance
        await unit.save()
            .then(item => {
                res.json(item)
                console.log('Unit updated ', item.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to update")
    }
    console.log(req.body)
})

router.put('/department/update', async (req, res) => {
    let department
    try {
        department = await Department.findById(req.body.selectedItem)
        department.viewValue = req.body.update
        await department.save()
            .then(item => {
                res.json(item)
                console.log('Department updated ', item.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to update")
    }
    console.log(req.body)
})

router.delete('/department/delete/:id', async (req, res) => {
    let department
    try {
        department = await Department.findById(req.params.id)
        console.log(department)
        await department.remove()
        res.json(department)
    } catch {
        if (department == null) {
            res.json()
        } else {
            // res.redirect(`/authors/${author.id}`)
            res.status(400).send("unable to delete")
        }

    }
})

router.delete('/grade/delete/:id', async (req, res) => {
    let grade
    try {
        grade = await Grade.findById(req.params.id)
        console.log(grade)
        await grade.remove()
        res.json(grade)
    } catch {
        if (grade == null) {
            res.json()
        } else {
            // res.redirect(`/authors/${author.id}`)
            res.status(400).send("unable to delete")
        }

    }
})

router.delete('/project/delete/:id', async (req, res) => {
    let project
    try {
        project = await Project.findById(req.params.id)
        console.log(project)
        await project.remove()
        res.json(project)
    } catch {
        if (project == null) {
            res.json()
        } else {
            // res.redirect(`/authors/${author.id}`)
            res.status(400).send("unable to delete")
        }

    }
})


router.put('/grade/update', async (req, res) => {
    let grade
    try {
        grade = await Grade.findById(req.body.selectedItem)
        grade.viewValue = req.body.update
        await grade.save()
            .then(item => {
                res.json(item)
                console.log('Department updated ', item.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to update")
    }
    console.log(req.body)
})

router.put('/project/update', async (req, res) => {
    let project
    try {
        project = await Project.findById(req.body.selectedItem)
        project.viewValue = req.body.update
        await project.save()
            .then(item => {
                res.json(item)
                console.log('Department updated ', item.id)
            })
    } catch (err) {
        console.log(err)
        res.status(400).send("unable to update")
    }
    console.log(req.body)
})

// const user = new User({
//     email: req.body.email,
//     password: req.body.password
// })


module.exports = router