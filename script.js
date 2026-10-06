const habitForm = document.querySelector('#habit-form');
const habitInput = document.querySelector('#habit-input');
const habitList = document.querySelector('#habit-list');
const habitProgress = document.querySelector('#habit-progress');
const storageKey = 'habits';

function updateProgress() {
  const totalHabits = habitList.querySelectorAll('li').length;
  const completedHabits = habitList.querySelectorAll(
    'input[type="checkbox"]:checked'
  ).length;

  habitProgress.textContent = `Выполнено: ${completedHabits} из ${totalHabits}`;
}

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
    updateProgress();
  });

  deleteButton.addEventListener('click', function () {
    habitItem.remove();
    saveHabits();
    updateProgress();
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

  updateProgress();
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
  updateProgress();

  habitInput.value = '';
});

loadHabits();
