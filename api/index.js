const formidable = require('formidable');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
var Jimp = require('jimp');
const uuidv4 = require('uuid/v4');

const User = require('../models/user');
const Task = require('../models/task');
const Note = require('../models/note');
const Position = require('../models/position');

// User
module.exports.saveNewUser = function(req, res) {
  const { 
    email, 
    firstName, 
    lastName, 
    middleName, 
    birthDate, 
    position, 
    phone, 
    messengers 
  } = req.body;
  const password = '123';

  const newUser = new User({ 
    id:'',
    email,
    password,
    firstName, 
    lastName, 
    middleName, 
    image: '',
    birthDate,
    position,
    phone,
    messengers,
    access_token: 'token' 
  });
  
  newUser.setPassword(password); 

  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('Пользователь с таким логином уже существует');
        return res.json(null);
      } else {
        newUser.save()
          .then(user => {
            const userId = user.get('_id');
            
            User.findByIdAndUpdate(userId, { $set: { id: userId } }, { new: true }, (err, user) => {
              if (err) {
                console.log(err);
                next(err);
              }

              console.log("Был сохранен новый пользователь", user);
              res.json(user);
            });
            
            Position.findById(req.user.position.id, (err, position) => {
                if (err) {
                  console.log(err);
                  next(err);
                }

                position.staff = [...position.staff, userId];

                position.save().then(position => 
                  console.log(`Были обновлены сотрудники под руководством должности ${position.name}`, position)
                )
                .catch(err => {
                  console.log(err);
                  next(err);
                });
              })
          })
        }
      })
    .catch(err => {
      console.log(err);
      res.json(err);
    });
};

module.exports.logIn = (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
     return next(err);
    }
    if (!user) {
      console.log("Пользователь не зарегистрирован");
      return res.json(null);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      req.session.isAuthorized = true;
      
      if (req.body.remembered) {
        const token = uuidv4();

        user.setProperty('access_token', token);
        user.save().then(user => {
          res.cookie('access_token', token, {
            maxAge: 7 * 60 * 60 * 1000,
            path: '/',
            httpOnly: false
          });

          console.log("Был авторизован пользователь, установлен токен", user);
          return res.json(user);
        });
      } else {
        console.log("Был авторизован пользователь", user);
        res.json(user);
      }
    });
  })(req, res, next);
};

module.exports.authFromToken = function(req, res, next) {
  const token = req.cookies.access_token;

  if (!!token) {
    User.findOne({ access_token: token }).then(user => {
      if (user) {
        req.logIn(user, err => {
          if (err) next(err);
          res.json(user);
        });
      } else {
        res.json(null);
      }
    });
  } else {
    res.json(null);
  }
};

module.exports.saveUserImage = function(req, res, next) {
  const { id } = req.params; 
  const form = new formidable.IncomingForm();
  const upload = path.join('./build', 'upload');

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function (err, fields, files) {
    const { file } = files;

    if (err) {
      console.log(err);

      fs.unlinkSync(file.path);
      return next(err);
    }

    const fileName = path.join(upload, file.name);

    fs.rename(file.path, fileName, function (err) {
      if (err) {
        console.log(err.message);
      }

      const dir = fileName.substr(fileName.indexOf(`${path.sep}`));

      Jimp.read(fileName, (err, img) => {
        if (err) {
          console.log(err);
        }

        img
          .cover(256, 256) 
          .quality(60) 
          .write(fileName); 

        User.findByIdAndUpdate(id, {$set: { image: dir }}, { new: true })
          .then(user => {
            console.log(`Было обновлено изображение ${dir} пользователя ${user}`);
            res.json(user);
          })
          .catch(err => {
            console.log(err);
          });
        });
      });
  });
};

module.exports.updateUser = async function(req, res) {
  const { id } = req.params;
  const { oldPassword, password, ...rest } = req.body;
  const user = await User.findById(id);

  if (oldPassword && !user.validPassword(oldPassword)) {
    console.log('Неверно указан предыдущий пароль');
    return res.json(null);
  }

  if (password) {
    user.setPassword(password);
  }

  Object.keys(rest).forEach(prop => user.setProperty(prop, rest[prop]));
  
  user.save()
    .then(user => {
      console.log("Были обновлены данные пользователя", user);
      res.json(user);
    })
    .catch(err => {
      console.log(err);
  });
}

module.exports.deleteUser = function(req, res) {
  const { id } = req.params;

  User.findByIdAndRemove(id)
    .then(async user => {
      try {
        await Task.deleteMany({ executorId: id });
        await Note.deleteMany({ userId: id });
      } catch(err) {
        console.log(err);
      }

      Position.findById(req.user.position.id)
        .then(position => {
          position.staff = position.staff.filter(userId => userId.toString() !== id );

          position.save()
            .then(position => 
              console.log(`Были обновлены сотрудники под руководством должности ${position.name}`, position)
            ).catch(err => {
              console.log(err);
            });

          User.find({ id: { $in: position.staff} })
            .then(user => res.json(user))
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports.getUsers = function(req, res) {
  Position.findById(req.user.position.id)
    .then(position => {
      User
        .find({ id: { $in: position.staff} })
        .then(users => res.json(users.sort((a, b) => a.lastName > b.lastName)))
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports.getFilterUsers = function(req, res) {
  const str = req.params.str.toLowerCase();

  Position.findById(req.user.position.id)
    .then(position => {
    
      User.find({ id: { $in: position.staff} })
        .then(users => res.json(
          users
            .filter(user => 
              user.firstName.toLowerCase().includes(str) || 
              user.lastName.toLowerCase().includes(str) || 
              user.middleName.toLowerCase().includes(str))
            )
            .sort(users.sort((a, b) => a.lastName > b.lastName))
        )
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports.getUser = function(req, res) {
  const { id } = req.params;
  
  User.findById(id)
    .then(user => res.json(user))
    .catch(err => {
      console.log(err);
    });
}

// Tasks
module.exports.saveNewTask = function(req, res) {
  const { task, comment, executorId, executorName, date } = req.body;
  const { user } = req;

  const taskItem = new Task({ 
    id: '',
    task,
    comment,
    executorId,
    executorName,
    status: 'wait',
    authorId: user.id,
    authorName: `${user.firstName} ${user.lastName}`,
    date
  });

  taskItem.save()
    .then(task => {
      const taskId = task.get('_id');
      
      Task.findByIdAndUpdate(taskId, {$set: { id: taskId }}, { new: true }, (err, task) => {
        if (err) {
          console.log(err);
          next(err);
        }

        console.log("Была добавлена задача", task);
        Task.find({ executorId: task.executorId }, (err, tasks) => res.json({ msg: 'Задача добавлена', tasks }));
      });
    })
    .catch(err => {
      console.log(err);
      res.json({ msg: err })
    });
};

module.exports.getTasks = function(req, res) {
  const { userId } = req.params;

  Task.find({ executorId: userId })
    .then(tasks => res.json(tasks))
    .catch(err => {
      console.log(err);
    });
}

module.exports.updateTask = function(req, res) {
  const { id } = req.params;

  Task.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(task => {
      console.log("Была обновлена задача", task);

      Task.find({ executorId: task.executorId }, (err, tasks) => 
        res.json(tasks));
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports.deleteTask = function(req, res) {
  const { id } = req.params;

  Task.findByIdAndRemove(id)
    .then(task => {
      Task.find({ executorId: task.executorId }, (err, tasks) => res.json(tasks));
    })
    .catch(err => {
      console.log(err);
    });
}

//Notes
module.exports.saveNewNote = function(req, res) {
  const { text, date } = req.body;
  const { user } = req;

  const noteItem = new Note({ 
    id: '',
    userId: user.id,
    text,
    date
  });

  noteItem.save()
    .then(note => {
      const noteId = note.get('_id');
      
      Note.findByIdAndUpdate(noteId, {$set: { id: noteId }}, { new: true }, (err, note) => {
        if (err) {
          console.log(err);
          next(err);
        }

        console.log("Была добавлена заметка", note);
        Note.find({ userId: note.userId }, (err, notes) => res.json(notes));
      });
    })
    .catch(err => {
      console.log(err);
      res.json({ msg: err })
    });
};


module.exports.getNotes = function(req, res) {
  const { userId } = req.params;

  Note.find({ userId })
    .then(notes => res.json(notes))
    .catch(err => {
      console.log(err);
    });
}

module.exports.deleteNote = function(req, res) {
  const { id } = req.params;

  Note.findByIdAndRemove(id)
    .then(note => Note.find({ userId: note.userId }, (err, notes) => res.json(notes)))
    .catch(err => {
      console.log(err);
    });
}

// Positions
module.exports.getPositions = function(req, res) {
  Position.find()
    .then(posList => res.json(posList))
    .catch(err => {
      console.log(err);
    });
}

// CleanBase
const ipos = require('../baseinit/positions');
const istaff = require('../baseinit/staff');
const inote = require('../baseinit/notes');
const itask = require('../baseinit/tasks');
const fsex = require('fs-extra');

module.exports.cleanBase = async function(req, res) {
  try {
    await User.collection.remove();
    await Position.collection.remove();
    await Note.collection.remove();
    await Task.collection.remove();
  
    const uploadDist = path.join('./build', 'upload');
    const uploadSrc = path.join('./baseinit', 'upload');
    
    if (!fs.existsSync(uploadDist)) {
      fs.mkdirSync(uploadDist);
    }
    
    await copy(
      path.join(process.cwd(), uploadSrc),
      path.join(process.cwd(), uploadDist)
    );
  
    await generate(ipos.posList, ipos.addPosToBD);
    await generate(istaff.heads, istaff.addUserToBD);
    await generate(istaff.users, istaff.addUserToBD);
    await generate(inote.noteList, inote.addNoteToBD);
    await generate(itask.taskList, itask.addTaskToBD);
  
    res.json({ msg: 'Base is updated' });
  } catch(err) {
    console.log(err);
  }
}

async function* generateSequence(arr, asyncFunc) {
    for (let elem of arr) {
      await asyncFunc(elem);
  
      yield;
    }
  }

async function generate() {
  let generator = generateSequence(...arguments);
  for await (let value of generator) {
    console.log('iteration'); 
  }
}

async function copy(pathToSource, pathToDist) {
  return new Promise((resolve, reject) => {
    fsex.remove(pathToDist, err => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      fsex.copy(pathToSource, pathToDist, err => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log('Files was copied');
        return resolve();
      });
    });
  });
}