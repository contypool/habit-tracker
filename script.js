const habitForm = document.querySelector('#habit-form');
const habitInput = document.querySelector('#habit-input');
const habitList = document.querySelector('#habit-list');
const storageKey = 'habits';

function saveHabits() {
  const habits = [];
  const habitItems = habitList.querySelectorAll('li');

  habitItems.forEach(function (habitItem) {
    const habitCheckbox = habitItem.querySelector('input[type="checkbox"]');
    const habitText = habitItem.querySelector('span');

    habits.push({
      name: habitText.textContent,
      completed: habitCheckbox.checked
    });
  });

  localStorage.setItem(storageKey, JSON.stringify(habits));
}

function createHabitElement(habitName, isCompleted = false) {
  const habitItem = document.createElement('li');
  const habitLabel = document.createElement('label');
  const habitCheckbox = document.createElement('input');
  const habitText = document.createElement('span');
  const deleteButton = document.createElement('button');

  habitCheckbox.type = 'checkbox';
  habitCheckbox.checked = isCompleted;
  habitText.textContent = habitName;
  deleteButton.type = 'button';
  deleteButton.textContent = 'Удалить';

  function updateHabitText() {
    if (habitCheckbox.checked) {
      habitText.style.textDecoration = 'line-through';
    } else {
      habitText.style.textDecoration = 'none';
    }
  }

  updateHabitText();

  habitCheckbox.addEventListener('change', function () {
    updateHabitText();
    saveHabits();
  });

  deleteButton.addEventListener('click', function () {
    habitItem.remove();
    saveHabits();
  });

  habitLabel.append(habitCheckbox, habitText);
  habitItem.append(habitLabel, deleteButton);

  return habitItem;
}

function loadHabits() {
  const savedHabits = JSON.parse(localStorage.getItem(storageKey) || '[]');

  savedHabits.forEach(function (habit) {
    const habitItem = createHabitElement(habit.name, habit.completed);
    habitList.append(habitItem);
  });
}

habitForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const habitName = habitInput.value.trim();

  if (habitName === '') {
    return;
  }

  const habitItem = createHabitElement(habitName);
  habitList.append(habitItem);
  saveHabits();

  habitInput.value = '';
});

loadHabits();
