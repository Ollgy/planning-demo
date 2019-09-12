const User = require('./models/user');

module.exports.addHeadToBD = user => {
  const { email, firstName, lastName, middleName, birthDate, position, phone, messengers } = user;
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

  User.save()
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