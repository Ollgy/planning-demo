const path = require('path');
const express = require('express');
const router = express.Router();

const api = require('../api/index');

const checkAccess = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Not authorized' })
    }
  } catch(err) {
    console.log(err);
  }
};

router.get('/api/getUser/:id', checkAccess, api.getUser);
router.get('/api/getUsers', checkAccess, api.getUsers);
router.get('/api/getFilterUsers/:str', checkAccess, api.getFilterUsers);

router.post('/api/saveNewUser', checkAccess, api.saveNewUser);
router.post('/api/logIn', api.logIn);
router.post('/api/authFromToken', api.authFromToken);
router.post('/api/saveUserImage/:id', checkAccess, api.saveUserImage);

router.put('/api/updateUser/:id', checkAccess, api.updateUser);

router.delete('/api/deleteUser/:id', checkAccess, api.deleteUser);

router.get('/api/getTasks/:userId', checkAccess, api.getTasks);
router.post('/api/saveNewTask', checkAccess, api.saveNewTask);
router.put('/api/updateTask/:id', checkAccess, api.updateTask);
router.delete('/api/deleteTask/:id',checkAccess, api.deleteTask);

router.get('/api/getNotes/:userId', checkAccess, api.getNotes);
router.post('/api/saveNewNote', checkAccess, api.saveNewNote);
router.delete('/api/deleteNote/:id', checkAccess, api.deleteNote);

router.get('/api/getPositions', checkAccess, api.getPositions);
  

router.get('/*', (req, res, next) => {
  res.sendFile(path.join(NODE_PATH + '/build/index.html'));
});

module.exports = router;
