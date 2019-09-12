const Position = require('./models/position');

module.exports.addPosToBD = async positions => {
  const posList = await Position.find();

  if (posList.length) {
    return;
  }

  positions.forEach(position => {
    const { name, permission, staff } = position;
  
    const posItem = new Position({ 
      id: '',
      name,
      permission,
      staff
    });
  
    posItem.save()
      .then(obj => {
        const id = obj.get('_id');
        
        Position.findByIdAndUpdate(id, {$set: { id }}, { new: true }, (err, obj) => {
          if (err) {
            console.log(err);
          }
          console.log("Была добавлена должность", obj);
        });
      })
      .catch(err => {
        console.log(err);
      });
  })
};


module.exports.posList = [
  {
    name: 'менеджер по маркетингу',
    permission: 'manager',
    staff: []
  },
  {
    name: 'директор магазина',
    permission: 'manager',
    staff: []
  },
  {
    name: 'шашлычник',
    permission: 'executor',
    staff: []
  },
  {
    name: 'повар',
    permission: 'executor',
    staff: []
  },
  {
    name: 'уборщик',
    permission: 'executor',
    staff: []
  }
]