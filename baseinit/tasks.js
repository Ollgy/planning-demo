const Task = require('../models/task');
const User = require('../models/user');

module.exports.addTaskToBD = async taskData => {
  const { task, comment, status, executorName, date } = taskData;
  const author = await User.findOne();
  const executor = await User.findOne({ 
    firstName: executorName.split(' ')[0], 
    lastName: executorName.split(' ')[1]
  });

  const taskItem = new Task({ 
    id: '',
    task,
    comment,
    executorId: executor.id,
    executorName,
    status,
    authorId: author.id,
    authorName: `${author.firstName} ${author.lastName}`,
    date
  });

  return taskItem.save()
    .then(task => {
      const taskId = task.get('_id');
      
      Task.findByIdAndUpdate(taskId, {$set: { id: taskId }}, { new: true }, (err, task) => {
        if (err) {
          console.log(err);
        }

        console.log("Была добавлена задача", task);
      });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports.taskList = [
  { 
    task: 'Дезинфекция столовых приборов', 
    comment: 'Материалы для хоз.нужд взять на складе', 
    status: 'active', 
    executorName: 'Петр Иванов', 
    date: {
      create: '17.10.2019 08:35',
      begin: '17.10.2019 09:15'
    } 
  },
  { 
    task: 'Сортировка мусора', 
    comment: '', 
    status: 'wait', 
    executorName: 'Петр Иванов', 
    date: {
      create: '17.10.2019 08:37',
    } 
  },
  { 
    task: 'Дезинфекция столовых приборов', 
    comment: 'Материалы для хоз.нужд взять на складе', 
    status: 'active', 
    executorName: 'Анна Мальцева', 
    date: {
      create: '17.10.2019 08:35',
      begin: '17.10.2019 09:15'
    } 
  },
  { 
    task: 'Сортировка мусора', 
    comment: '', 
    status: 'wait', 
    executorName: 'Анна Мальцева', 
    date: {
      create: '17.10.2019 08:37',
    } 
  },
  { 
    task: 'Дезинфекция столовых приборов', 
    comment: 'Материалы для хоз.нужд взять на складе', 
    status: 'active', 
    executorName: 'Алиса Певцова', 
    date: {
      create: '17.10.2019 08:35',
      begin: '17.10.2019 09:15'
    } 
  },
  { 
    task: 'Сортировка мусора', 
    comment: '', 
    status: 'wait', 
    executorName: 'Алиса Певцова', 
    date: {
      create: '17.10.2019 08:37',
    } 
  },
  { 
    task: 'Шашалык. Заготовка сырья', 
    comment: 'Свинина - 15кг, курица - 10кг, крылья - 5кг', 
    status: 'active', 
    executorName: 'Алена Семенюк', 
    date: {
      create: '17.10.2019 08:22',
      begin: '17.10.2019 09:15',
    } 
  },
  { 
    task: 'Шашалык. Приготовление', 
    comment: 'Посмотри степень прожарки. Вчера были жалобы', 
    status: 'wait', 
    executorName: 'Алена Семенюк', 
    date: {
      create: '17.10.2019 08:22',
    } 
  },
  { 
    task: 'Шашалык. Заготовка сырья', 
    comment: 'Свинина - 15кг, курица - 10кг, крылья - 5кг', 
    status: 'active', 
    executorName: 'Петр Ефимов', 
    date: {
      create: '17.10.2019 08:22',
      begin: '17.10.2019 09:15',
    } 
  },
  { 
    task: 'Шашалык. Приготовление', 
    comment: 'Посмотри степень прожарки. Вчера были жалобы', 
    status: 'wait', 
    executorName: 'Петр Ефимов', 
    date: {
      create: '17.10.2019 08:22',
    } 
  },
  { 
    task: 'Шашалык. Заготовка сырья', 
    comment: 'Свинина - 15кг, курица - 10кг, крылья - 5кг', 
    status: 'active', 
    executorName: 'Евгений Веселов', 
    date: {
      create: '17.10.2019 08:22',
      begin: '17.10.2019 09:15',
    } 
  },
  { 
    task: 'Шашалык. Приготовление', 
    comment: 'Посмотри степень прожарки. Вчера были жалобы', 
    status: 'wait', 
    executorName: 'Евгений Веселов', 
    date: {
      create: '17.10.2019 08:22',
    } 
  },
  { 
    task: 'Шашалык. Заготовка сырья', 
    comment: 'Свинина - 15кг, курица - 10кг, крылья - 5кг', 
    status: 'active', 
    executorName: 'Елена Лазарева', 
    date: {
      create: '17.10.2019 08:22',
      begin: '17.10.2019 09:15',
    } 
  },
  { 
    task: 'Шашалык. Приготовление', 
    comment: 'Посмотри степень прожарки. Вчера были жалобы', 
    status: 'wait', 
    executorName: 'Елена Лазарева', 
    date: {
      create: '17.10.2019 08:22',
    } 
  },
  { 
    task: 'Корректировка меню', 
    comment: 'Пересмотреть меню в соответсвии со сменой сезона + открытая терраса', 
    status: 'active', 
    executorName: 'Анатолий Гусаров', 
    date: {
      create: '17.10.2019 08:40',
      begin: '17.10.2019 09:00',
    } 
  },
  { 
    task: 'Приемка продукции от поставщиков', 
    comment: 'Сегодня овощи, хлеб, молочка', 
    status: 'wait', 
    executorName: 'Анатолий Гусаров', 
    date: {
      create: '17.10.2019 08:42',
    } 
  },
  { 
    task: 'Плановая работа', 
    comment: 'Выполнять в соответствии с корректировками', 
    status: 'wait', 
    executorName: 'Анатолий Гусаров', 
    date: {
      create: '17.10.2019 08:43',
    } 
  },
  { 
    task: 'Корректировка меню', 
    comment: 'Пересмотреть меню в соответсвии со сменой сезона + открытая терраса', 
    status: 'active', 
    executorName: 'Ирина Краус', 
    date: {
      create: '17.10.2019 08:40',
      begin: '17.10.2019 09:00',
    } 
  },
  { 
    task: 'Приемка продукции от поставщиков', 
    comment: 'Сегодня овощи, хлеб, молочка', 
    status: 'wait', 
    executorName: 'Ирина Краус', 
    date: {
      create: '17.10.2019 08:42',
    } 
  },
  { 
    task: 'Плановая работа', 
    comment: 'Выполнять в соответствии с корректировками', 
    status: 'wait', 
    executorName: 'Ирина Краус', 
    date: {
      create: '17.10.2019 08:43',
    } 
  }
];