module.exports = function(app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('users').find().toArray((err, result) => {
      if (err) return console.log(err)
      console.log(req.user.local.myconnections, "userrr");
      res.render('profile.ejs', {
        user: req.user,
        allusers: result
      })
    })
  });

  app.put('/addparent', (req, res) => {
    let teacher = req.body.teacher
    let parentId = req.body.parentId
    let parent = req.body.parent
    db.collection('users')
      .findOneAndUpdate({
        "local.email": teacher
      }, {
        $addToSet: {
          "local.myconnections": {
            id: parentId,
            email: parent
          },

        }
      }, {
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/addteacher', (req, res) => {
    let teacher = req.body.teacher
    let teacherId = ObjectId(req.session.passport.user)
    let parentId = req.body.parentId
    let parent = req.body.parent
    db.collection('users')
      .findOneAndUpdate({
        "local.email": parent
      }, {
        $addToSet: {
          "local.myconnections": {
            id: teacherId,
            email: teacher
          }
        }
      }, {
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })



  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  // HOMEWORK ==============================
  app.get('/homework', isLoggedIn, function(req, res) {
    var uId = ObjectId(req.session.passport.user)
    console.log(req.session.passport);
    db.collection('users').find({_id:uId}).toArray((err, user) => {
    console.log(user);
    let usertype = user[0].local.usertype
    db.collection('messages').find().toArray((err, result) => {
        db.collection('messages').find({'studentId': uId}).toArray((err, task) => {
          if (err) return console.log(err)
          res.render('homework.ejs', {
            user: req.user,
            messages: result
          })
        })
      })
    })
  })

  app.post('/homework', (req, res) => {
    //var uId = ObjectId(req.session.passport.user)
    db.collection('users').find({_id: ObjectId(req.body.userId)}).toArray((err, result) => {
      db.collection('messages').save({
        user: req.body.userId,
        name: result[0].local.firstName + " " + result[0].local.lastName,
        day: req.body.day,
        homeworkType: req.body.homeworkType,
        message: req.body.message,
        completed: false,
        studentListHw: []
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/homework')
      })
    })
  })

  app.put('/completedStatus', (req, res) => {
    var uId = ObjectId(req.session.passport.user)
    console.log(req.body.completed, 'completed')
    console.log(req.body.message, 'messages');
    console.log(req.body.studentId, "studentID");
    db.collection('messages').find({message: req.body.message}).toArray((err, result) => {
      console.log(result, 'resultttt');
      let studentCompleted
      if (req.body.completed === false) {
          let homeworkCheck = result[0].studentListHw
          console.log(homeworkCheck, "expect []");
          studentCompleted = result[0].studentListHw.filter(student => student.student !== req.body.studentId)
      } else {
        console.log("true");
        studentCompleted = result[0].studentListHw
        studentCompleted.push({ student: req.body.studentId })
        console.log(studentCompleted, 'newadded');
      }
    db.collection('messages')
      .findOneAndUpdate({
        message: req.body.message
      },
      {
        $set: {
          user: req.body.studentId,
          completed: req.body.completed,
          studentListHw: studentCompleted
        }
      },
      {
        upsert: false,
        new: true
      },
      (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })
  })

  app.delete('/homework', (req, res) => {
    db.collection('messages').findOneAndDelete({
      message: req.body.message
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })


// New Attendace ==============================

app.get('/newatt', isLoggedIn, function(req, res) {
  db.collection('present').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('newatt.ejs', {
      user: req.user,
      present: result
    })
  })
});

app.post('/newatt', (req, res) => {
  db.collection('present').save({
    name: req.body.name,
    week: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: ''
    }
  },(err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/newatt')
  })
})

app.delete('/clearatt', (req, res) => {
  console.log('delete');
  db.collection('present').remove({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

app.put('/newatt', (req, res) => {
  console.log(req.body);
  let dayId = `week.${req.body.dayId}`
  db.collection('present')
    .bulkWrite([
     {
       updateOne: {
         'filter': { _id: ObjectId(req.body.userIdOne)},
         'update': { $set: { [dayId]: req.body.attendanceOne}}
       }
     },
     {
       updateOne: {
         'filter': { _id: ObjectId(req.body.userIdTwo)},
         'update': { $set: { [dayId]: req.body.attendanceTwo}}
       }
     },
     {
       updateOne: {
         'filter': { _id: ObjectId(req.body.userIdThree)},
         'update': { $set: { [dayId]: req.body.attendanceThree}}
       }
     },
     {
       updateOne: {
         'filter': { _id: ObjectId(req.body.userIdFour)},
         'update': { $set: { [dayId]: req.body.attendanceFour}}
       }
     },
     {
       updateOne: {
         'filter': { _id: ObjectId(req.body.userIdFive)},
         'update': { $set: { [dayId]: req.body.attendanceFive}}
       }
     },
     {
       updateOne: {
         'filter': { _id: ObjectId(req.body.userIdSix)},
         'update': { $set: { [dayId]: req.body.attendanceSix}}
       }
     },
     {
       updateOne: {
         'filter': { _id: ObjectId(req.body.userIdSeven)},
         'update': { $set: { [dayId]: req.body.attendanceSeven}}
       }
     },
     {
       updateOne: {
         'filter': { _id: ObjectId(req.body.userIdEight)},
         'update': { $set: { [dayId]: req.body.attendanceEight}}
       }
     }
   ])
   if (err) return console.log(err)
   res.send('success')
  })


  // Progress ==============================
  app.get('/progress', isLoggedIn, function(req, res) {
    db.collection('chart').find().toArray((err, result) => {
      console.log(result)
      if (err) return console.log(err)
      res.render('progress.ejs', {
        user: req.user,
        chart: result
      })
    })
  });

  app.get('/progressChart', isLoggedIn, function(req, res) {
    db.collection('chart').find().toArray((err, result) => {
      console.log(result)
      if (err) return console.log(err)
      res.json(result)
    })
  });


  app.post('/gradeChart', (req, res) => {
    console.log(req.body)
    db.collection('chart').save({
      student: req.body.student,
      grade: req.body.grade
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/progress')
    })
  })


  // Events ==============================
  app.get('/events', isLoggedIn, function(req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('events.ejs', {
        user: req.user,
        messages: result
      })
    })
  });


  // chat ==============================
  app.get('/messages/:parentId', isLoggedIn, function(req, res) {
    let userId = ObjectId(req.session.passport.user)
    let teacherId = ObjectId(req.params.parentId)
    console.log(req.session.passport, 'email');
    console.log(req.params.parentId, "bla bla");
    db.collection('users').find({'_id':userId}).toArray((err, userId) => {
      console.log(userId, 'userIIID');
      let parentEmail = userId[0].local.email
      console.log(typeof parentEmail, parentEmail, "eeeemaaail")
    db.collection('users').find({
      '_id': teacherId
    }).toArray((err, teacher) => {
      let teacherEmail = teacher[0].local.email
        console.log(teacherEmail, "resuuult");
      db.collection('chatroom').find().toArray((err, messages) => {
        console.log(messages, "msm");
        if (req.session.passport !== teacherId) {
          console.log('hereeee');
          console.log(parentEmail);
          console.log(teacherEmail);
          let parentM = messages.filter(pm =>
          pm.from ===  teacherEmail || pm.to === teacherEmail)
          console.log(parentM, "parentyy");
          messages = parentM
        }else {
          let teacherM = messages.filter(
          pm.from ===  parentEmail || pm.to === parentEmail)
          messages = teacherM
        }
          res.render('messages.ejs', {
            user: req.user,
            parentInfo: userId[0],
            chatroom: messages
          })
        })
      })
  })
})
//
// app.get('/teachermessages/:teacherId', isLoggedIn, function(req, res) {
//   let userId = ObjectId(req.session.passport.user)
//   let teacherId = ObjectId(req.params.parentId)
//   console.log(req.session.passport, 'email');
//   console.log(req.params.parentId, "bla bla");
//   db.collection('users').find({'_id':userId}).toArray((err, userId) => {
//     console.log(userId, 'userIIID');
//     let parentEmail = userId[0].local.email
//     console.log(typeof parentEmail, parentEmail, "eeeemaaail")
//   db.collection('users').find({
//     '_id': teacherId
//   }).toArray((err, teacher) => {
//     let teacherEmail = teacher[0].local.email
//       console.log(teacherEmail, "resuuult");
//     db.collection('chatroom').find().toArray((err, messages) => {
//       console.log(messages, "msm");
//       let parentM = messages.filter(pm => pm.from ===  parentEmail || pm.from === teacherEmail)
//       console.log(parentM, "parentssss");
//         res.render('messages.ejs', {
//           user: req.user,
//           parentInfo: userId[0],
//           chatroom: messages
//         })
//       })
//     })
// })
// })

  app.post('/chat', (req, res) => {
    console.log(req.body)
    let param = req.body.id
        db.collection('chatroom').save({
          from: req.body.from,
          to: req.body.to,
          msg: req.body.msg
        }, (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect(`/messages/${param}`)
        })
      })


      app.delete('/chat', (req, res) => {
        db.collection('chatroom').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
          if (err) return res.send(500, err)
          res.send('Message deleted!')
        })
      })


  // PARENT INFO ==============================
  app.get('/myinfo', isLoggedIn, function(req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('myinfo.ejs', {
        user: req.user,
        messages: result
      })
    })
  });




  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
