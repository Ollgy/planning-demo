const User = require('../models/user');
const Position = require('../models/position');

module.exports.addUserToBD = async user => {

  const { 
    email, 
    firstName, 
    lastName, 
    middleName, 
    birthDate, 
    position: posName, 
    phone, 
    image,
    messengers } = user;
  const pos = await Position.findOne({ name: posName });
  const posHead = await Position.findOne({ name: 'директор магазина' });
  const password = '123';

  const newUser = new User({ 
    id:'',
    email,
    password,
    firstName, 
    lastName, 
    middleName, 
    image: image || '',
    birthDate,
    position: {
      id: pos._id,
      name: pos.name,
      permission: pos.permission
    },
    phone,
    messengers,
    access_token: 'token' 
  });
  
  newUser.setPassword(password); 

  return newUser.save()
    .then(user => {
      const userId = user.get('_id');
      
      User.findByIdAndUpdate(userId, {$set: { id: userId }}, { new: true }, (err, user) => {
        if (err) {
          console.log(err);
        }

        console.log("Был сохранен новый пользователь", user);
      });

      if (pos.id !== posHead.id) {
        Position.findById(posHead.id, (err, position) => {
          if (err) {
            console.log(err);
            next(err);
          }
  
          position.staff = [...position.staff, userId];
  
          position.save()
            .then(position => 
              console.log(`Были обновлены сотрудники под руководством должности ${position.name}`, position)
            )
            .catch(err => {
              console.log(err);
              next(err);
            });
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.heads = [
  {
    email: 'test@mail.ru', 
    firstName: 'Анна', 
    lastName: 'Белова', 
    middleName: 'Сергеевна', 
    birthDate: '12.04.1959', 
    position: 'директор магазина', 
    phone: '9834567779', 
    messengers: 'whatsApp - dev@art'
  }
];

module.exports.users = [
  {
    email: 'test1@mail.ru', 
    firstName: 'Петр', 
    lastName: 'Иванов', 
    middleName: 'Сергеевич', 
    birthDate: '19.12.1976', 
    position: 'уборщик', 
    phone: '9134089766', 
    messengers: 'viber - @iv_76'
  },
  {
    email: 'test2@mail.ru', 
    firstName: 'Елена', 
    lastName: 'Лазарева', 
    middleName: 'Леонидовна', 
    birthDate: '05.02.1955', 
    position: 'шашлычник', 
    phone: '9060886767', 
    image: '\\upload\\И. Мусин..jpg',
    messengers: 'telegram - @len_leon'
  },
  {
    email: 'test3@mail.ru', 
    firstName: 'Петр', 
    lastName: 'Ефимов', 
    middleName: 'Денисович', 
    birthDate: '15.09.1963', 
    position: 'шашлычник', 
    phone: '9831506978', 
    messengers: 'telegram - @fima_pd'
  },
  {
    email: 'test4@mail.ru', 
    firstName: 'Анатолий', 
    lastName: 'Гусаров', 
    middleName: 'Евгеньевич', 
    birthDate: '19.01.1950', 
    position: 'повар', 
    phone: '9134567900', 
    messengers: ' - '
  },
  {
    email: 'test5@mail.ru', 
    firstName: 'Анна', 
    lastName: 'Мальцева', 
    middleName: 'Анатольевна', 
    birthDate: '08.12.1975', 
    position: 'уборщик', 
    phone: '9064910605', 
    image: '\\upload\\Ч.К.Каран. Западный ветер.jpg',
    messengers: 'whatsApp - @Ann'
  },
  {
    email: 'test6@mail.ru', 
    firstName: 'Ирина', 
    lastName: 'Краус', 
    middleName: 'Петровна', 
    birthDate: '14.09.1965', 
    position: 'повар', 
    phone: '9076788980', 
    messengers: 'telegram - @santa_craus'
  },
  {
    email: 'test7@mail.ru', 
    firstName: 'Евгений', 
    lastName: 'Веселов', 
    middleName: 'Игоревич', 
    birthDate: '07.07.1977', 
    position: 'шашлычник', 
    image: '\\upload\\И. Мусин. Свобода. 2008.jpg',
    phone: '9831256984', 
    messengers: 'whatsApp - @agent777'
  },
  {
    email: 'test8@mail.ru', 
    firstName: 'Алиса', 
    lastName: 'Певцова', 
    middleName: 'Алексеевна', 
    birthDate: '03.08.1956', 
    position: 'уборщик', 
    phone: '9056789435', 
    messengers: ' - '
  },
  {
    email: 'test9@mail.ru', 
    firstName: 'Алена', 
    lastName: 'Семенюк', 
    middleName: 'Сергеевна', 
    birthDate: '13.06.1982', 
    position: 'уборщик', 
    phone: '9076788980', 
    messengers: 'viber - @svetik_semicvetik'
  }
]