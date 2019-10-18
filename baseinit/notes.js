const Note = require('../models/note');
const User = require('../models/user');

module.exports.addNoteToBD = async note => {
  const { text, date } = note;
  const user = await User.findOne();

  const noteItem = new Note({ 
    id: '',
    userId: user.id,
    text,
    date
  });

  return noteItem.save()
    .then(note => {
      const noteId = note.get('_id');
      
      Note.findByIdAndUpdate(noteId, {$set: { id: noteId }}, { new: true }, (err, note) => {
        if (err) {
          console.log(err);
          next(err);
        }

        console.log("Была добавлена заметка", note);
      });
    })
    .catch(err => {
      console.log(err);
      res.json({ msg: err })
    });
}

module.exports.noteList = [
  {
    date: '25.09.2019',
    text: 'ООО "Мяско" тел. 2-83-45'
  },
  {
    date: '19.10.2019',
    text: 'Распределение сырья по филиалам. Отв. Иванов А.А.'
  }
];