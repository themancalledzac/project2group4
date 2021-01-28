const db = require("../models");
var express = require("express");
const router = express.Router();
const isAuthenticated = require("../config/middleware/isAuthenticated");

// const mapDatavalues = row => row.dataValues;

// Route for getting some data about our user to be used client side
router.get("/api/profile-student", (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  } else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      id: req.user.id
    });
  }
});


router.get("/profile", isAuthenticated, async (req, res) => {

  const teacherResults = await db.Teachers.findAll({
    include: [{
      model: db.TeacherStudents,
      where: {
        StudentId: req.user.id
      }
    }],
    raw: true
  });

  const classResults = await db.Classes.findAll({
    include: [{
      model: db.StudentClasses,
      where: {
        StudentId: req.user.id
      }
    }],
    raw: true
  });


  console.log(teacherResults);
  console.log(classResults);
  try {
    res.render("profile", {
      teachers: teacherResults,
      classes: classResults
    });

  } catch (err) {
    throw (err);
  }

});

module.exports = router;



// could we do a:
// router.get("/profile", isAuthenticated, (req, res) => {
      // await teacherFindAll(teacherData);
      // await classFindAll(classData);
      // .then(function (results) {
          //
      // })
// })