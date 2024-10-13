<template>
	<div class="page">
		<div class="container">
			<h1>Tasks app</h1>

			<!-- Adding a task -->
			<Vueform size="lg" @submit="createTask">

				<!-- Task input -->
				<TextElement
          v-model="taskName"
					name="task"
					placeholder="Add a task"
					floating="Task name"
					rules="required"
				/>

				<!-- Task type -->
				<RadiogroupElement
					name="type"
					:items="['Movie/Series', 'Book']"
					view="tabs"
					default="Personal"
				/>

				<!-- Submit -->
				<ButtonElement
					name="button"
					align="right"
					submits
				>
					Create
				</ButtonElement>
			</Vueform>

			<hr class="divider" />

			<!-- Task list -->
			<Vueform v-model="tasksModel" sync> <!-- `sync` to update the list when `tasksModel` changes -->

				<!-- List of tasks -->
				<ListElement
					name="tasks"
					:controls="{
						add: false, // to disable adding new elements to the list
					}"
					:add-class="{
						handle: 'task-sort-handle' // for fixing top position of the handle
					}"
					sort
					@sort="syncToStorage"
					@remove="syncToStorage"
				>
					<template #default="{ index }">

						<!-- Task wrapper -->
						<ObjectElement
							:name="index"
							:add-class="[
								'task-container',
								tasksModel.tasks[index] && tasksModel.tasks[index].type === 'Movie/Series' ? 'is-movie/series' : 'is-book'
							]">

						<!-- Edit button, using the task name with index as label - only visible when not editing -->
						<ButtonElement
							:label="tasksModel.tasks[index] ? tasksModel.tasks[index].task : 'Unnamed task'"
							name="edit"
							align="right"
							:conditions="[
								['editing', '!=', index]
							]"
							:columns="{
								label: 8,
							}"
							@click="edit(index)"
						>
							Edit
						</ButtonElement>

						<!-- Task input when editing -->
						<TextElement 
							name="task"
							:conditions="[
								['editing', index]
							]"
							:columns="6"
						/>

						<!-- Task type when editing -->
						<RadiogroupElement 
							name="type"
							view="tabs"
							:conditions="[
								['editing', index]
							]"
							:columns="2"
							:items="{
								'Movie/Series': 'M',
								'Book': 'B',
							}"
						/>

						<!-- Cancel task editing -->
						<ButtonElement
							name="cancel"
							:conditions="[
								['editing', index]
							]"
							:columns="2"
							danger
							full
							@click="cancel"
						>
							Cancel
						</ButtonElement>

						<!-- Save task -->
						<ButtonElement
							name="save"
							:conditions="[
								['editing', index]
							]"
							:columns="2"
							full
							@click="save"
						>
							Save
						</ButtonElement>

						</ObjectElement>
					</template>
				</ListElement>

				<!-- Store which field we're editing so that conditions can rely on this -->
				<HiddenElement name="editing" />
			</Vueform>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// The model for the task list form
const tasksModel = ref({
	tasks: [], // list of tasks
	editing: null, // current task we're editing
})

// Creating a task and saving it to localStorage
const createTask = (data, form$) => {
  console.log(data);
  const taskData = {
    task: data.task,
    type: data.type || 'Movie/Series'
  };
	addToStorage(taskData); // first add to localStorage
	syncFromStorage(); // then sync the `tasksModel` from localStorage

	form$.data.task = ''; // then reset the form

}

// Adds a new task to the localStorage
const addToStorage = (data) => {
  console.log(data);
	let storageData = localStorage.getItem('tasks');
	storageData = storageData ? JSON.parse(storageData) : [];

	storageData.push(taskData);
	localStorage.setItem('tasks', JSON.stringify(storageData));
}

// Syncs the localStorage to `tasksModel`
const syncFromStorage = () => {
	let tasks = localStorage.getItem('tasks')

	tasksModel.value = {
		tasks: tasks ? JSON.parse(tasks) : []
	};
  console.log(tasksModel.value);
}

// Syncs the `tasksModel.tasks` to localStorage
const syncToStorage = () => {
	localStorage.setItem('tasks', JSON.stringify(tasksModel.value.tasks))
}

// Sets the tasks to edit
const edit = (index) => {
	tasksModel.value.editing = index
}

// Cancels the task to editing
const cancel = (index) => {
	tasksModel.value.editing = null
	syncFromStorage()
}

// Saves the task
const save = () => {
	syncToStorage()
	tasksModel.value.editing = null
}

// Sync the `tasksModel` from localStorage upon pageload
onMounted(() => {
	syncFromStorage();
});



</script>

<style lang="scss">
.page {
	background: #f1f5f9;
	width: 100%;
	min-height: 100vh;
	padding-top: 2rem;
}

.container {
	max-width: 600px;
	margin: 0 auto;
}

h1 {
	font-size: 48px;
	margin-bottom: 2rem;
	font-weight: 600;
}

.divider {
	margin: 2rem 0;
	border-color: #e2e8f0;
}

.task-container {
	background: #ffffff;
	padding: 1rem;

	&.is-personal {
		border-left: 3px solid green;
	}

	&.is-business {
		border-left: 3px solid purple;
	}
}

.task-wrapper {
	display: flex;
	align-items: center;
}

.vf-list-handle.task-sort-handle {
	top: 1rem;
}
</style>