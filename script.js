const habitForm = document.querySelector('#habit-form');
const habitInput = document.querySelector('#habit-input');
const habitList = document.querySelector('#habit-list');
const progressSummary = document.querySelector('#progress-summary');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('#progress-fill');
const storageKey = 'habits';

function updateProgress() {
  const habitCheckboxes = habitList.querySelectorAll('input[type="checkbox"]');
  const totalHabits = habitCheckboxes.length;
  const completedHabits = habitList.querySelectorAll('input[type="checkbox"]:checked').length;
  const percentage = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);
  const summary = `Выполнено: ${completedHabits} из ${totalHabits}`;

  progressSummary.textContent = summary;
  progressFill.style.width = `${percentage}%`;
  progressBar.setAttribute('aria-valuenow', String(percentage));
  progressBar.setAttribute('aria-valuetext', summary);
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
  updateProgress();
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
updateProgress();
