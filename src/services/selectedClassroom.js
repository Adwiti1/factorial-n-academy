const SELECTED_CLASSROOM_KEY = 'factorial-n-academy:selected-classroom'
const DEFAULT_CLASSROOM_ID = 'robotics-8a'

export function getSelectedClassroomId() {
  return window.localStorage.getItem(SELECTED_CLASSROOM_KEY) || DEFAULT_CLASSROOM_ID
}

export function setSelectedClassroomId(classroomId) {
  window.localStorage.setItem(SELECTED_CLASSROOM_KEY, classroomId)
}
