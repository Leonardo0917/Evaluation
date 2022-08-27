import { Api } from './api.js'

// ------View------
const View = (() => {
    const domstr = {
        courses: ".courses",
        available: "#available",
        selected: "#selected",
        credits: ".credits",
        sumbit: "#submit"
    }

    const render = (ele, content) => {
        ele.innerHTML = content;
    };

    const createLists = (arr) => {
        let tmp = "";
        arr.forEach(element => {
            let type = element.required ? "Compulsory" : "Elective"; 
            tmp +=`
                <li class="course">
                    <span class="cn">${element.courseName}</span>
                    <span>Course Type: ${type}</span>
                    <span>Course Credit: <span class="cc">${element.credit}</span><span>
                </li>
            `;
        });
        return tmp;
    };

    return {
        domstr,
        render,
        createLists,
    }
})();
// -----Model------
const Model = ((api, view) => {
    class SelectedCourse {
        constructor(name) {
            this.name = name;
        }
    }

    class State {
        #coursesList = [];
        #selectingList = [];
        #selectedList = [];
        #totalCredits = 0;

        get coursesList() {
            return this.#coursesList;
        }

        set coursesList(newCoursesList) {
            this.#coursesList = [...newCoursesList];

            const courseContainer = document.querySelector(view.domstr.courses);
            const tagContent = view.createLists(this.#coursesList);
            view.render(courseContainer, tagContent);
        }

        get selectingList() {
            return this.#selectingList;
        }

        set selectingList(newselectingList) {
            this.#selectingList = [...newselectingList];
        }

        get selectedList() {
            return this.#selectedList;
        }

        set selectedList(newSelectedList) {
            let new_CourseList = [];
            let new_SelectedList = [];
            this.#coursesList.map(e => {
                let found = false;
                for (let i = 0; i < this.selectingList.length; i++) {
                    if (e.courseName === this.selectingList[i].name) {
                        new_SelectedList.push(e);
                        found = true;
                        break;
                    }
                }
                if (!found) new_CourseList.push(e);
            });
            console.log(new_CourseList)
            this.#coursesList = new_CourseList;
            this.#selectingList = [];
            this.#selectedList = new_SelectedList;
            // render selected course
            const selectedContainer = document.querySelector(view.domstr.selected);
            const selectedTagContent = view.createLists(this.#selectedList);
            view.render(selectedContainer, selectedTagContent);
            // render available course
            const courseContainer = document.querySelector(view.domstr.courses);
            const tagContent = view.createLists(this.#coursesList);
            view.render(courseContainer, tagContent);
        }

        get totalCredits () {
            return this.#totalCredits;
        }

        set totalCredits(num) {
            this.#totalCredits = num;

            const courseContainer = document.querySelector(view.domstr.credits);
            let str = this.#totalCredits + " ";
            view.render(courseContainer, str);
        }
    }

    const {getCourses} = api;

    return {
        getCourses,
        SelectedCourse,
        State,
    };
})(Api, View);

// ---Controller---
const Controller = ((model, view) => {
    const state = new model.State();
    const maxCredits = 18;
    const selectedColor = "rgb(66, 171, 246)";

    const init = () => {
        model.getCourses().then((lists) => {
            state.coursesList = [...lists];
        });
    }

    const selectCourse = () => {
        const courses = document.querySelector(view.domstr.available);
        courses.addEventListener("mouseup", (event) => {
            let target;
            event.stopPropagation();
            // handle different layer, make <li> as target
            if (event.target.className === "course") {
                target = event.target;
            } else if (event.target.className === "cc") {
                target = event.target.parentElement.parentElement;
            } else {
                target = event.target.parentElement;
            }

            let cc = parseInt(target.querySelector(".cc").innerHTML);
            let cn = target.querySelector(".cn").innerHTML;
            
            // unmark <li>
            if (state.selectingList.some(e => e.name === cn)) {
                state.selectingList = state.selectingList.filter(e => e.name !== cn);
                state.totalCredits = state.totalCredits - cc;
            } 
            // mark <li>
            else {
                // check if valid
                if (state.totalCredits + cc > maxCredits) {
                    alert("You can only choose up to 18 credits in one semester");
                } else {
                    const selected_course = new model.SelectedCourse(cn);
                    state.selectingList = [selected_course, ...state.selectingList];
                    state.totalCredits = state.totalCredits + cc;
                }
            }
            // refresh
            const courseContainer = document.querySelector(view.domstr.courses);
            const tagContent = view.createLists(state.coursesList);
            view.render(courseContainer, tagContent);
            // render bgcolor
            const _course = document.querySelectorAll(".cn");
            _course.forEach(e => {
                for (let i = 0; i < state.selectingList.length; i++) {
                    if (e.innerHTML === state.selectingList[i].name) {
                        e.parentElement.style.backgroundColor = selectedColor;
                        break;
                    }
                }
            })
        }, true);
    }

    const sumbit = () => {
        const sumbitBtn = document.querySelector(view.domstr.sumbit);
        sumbitBtn.addEventListener("click", (event) => {
            let msg = "You have chosen " + state.totalCredits + " credits for this semester. You cannot change once you submit. Do you want to confirm?"
            if(confirm(msg)) {
                sumbitBtn.disabled = true;
                state.selectedList = state.selectingList;
            }
        });
    }

    const bootstramp = () => {
        init();
        selectCourse();
        sumbit();
    };

    return {
        bootstramp,
    };
})(Model, View);

Controller.bootstramp();