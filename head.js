const User = require('./models/user');
const Position = require('./models/position');

module.exports.addHeadToBD = async user => {
  const userList = await User.find();
  
  if (userList.length) {
    return;
  }

  const { email, firstName, lastName, middleName, birthDate, position: posName, phone, messengers } = user;
  const pos = await Position.findOne({ name: posName})
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

  newUser.save()
    .then(user => {
      const userId = user.get('_id');
      
      User.findByIdAndUpdate(userId, {$set: { id: userId }}, { new: true }, (err, user) => {
        if (err) {
          console.log(err);
        }

        console.log("Был сохранен новый пользователь", user);
      });
          
    })
    .catch(err => {
      console.log(err);
    });
};


module.exports.user = {
  email: 'test@mail.ru', 
  firstName: 'Анна', 
  lastName: 'Белова', 
  middleName: 'Сергеевна', 
  birthDate: '12.04.1959', 
  position: 'директор магазина', 
  phone: '9834567779', 
  messengers: 'whatsApp - dev@art'
}