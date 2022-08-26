import { Api } from './api.js'

// ------View------
const View = (() => {
    const domstr = {
        courses: ".courses",
        available: "#available",
        credits: ".credits",
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
                    <span>${element.courseName}</span>
                    <span>Course Type: ${type}</span>
                    <span>Course Credit: <span class="cc">${element.credit}</span></span>
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
    class State {
        #coursesList = [];
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

        get selectedList() {
            return this.#selectedList;
        }

        set selectedList(newselectedList) {
            this.#selectedList = [...newselectedList];
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
        State,
    };
})(Api, View);

// ---Controller---
const Controller = ((model, view) => {
    const state = new model.State();

    const selectCourse = () => {
        const courses = document.querySelector(view.domstr.available);
        courses.addEventListener('click', (event)=> {
            console.log(event.target);
            if (event.currentTarget.className === "course") {
                let c = parseInt(event.target.querySelector(".cc").innerHTML);
                console.log(c);
                if (state.totalCredits + c > 18) {
                    alert("You can only choose up to 18 credits in one semester");
                } else {
                    state.totalCredits = state.totalCredits + c;
                }
            }
        })
    }

    const init = () => {
        model.getCourses().then((lists) => {
            state.coursesList = [...lists];
        });
    }

    const bootstramp = () => {
        init();
        selectCourse();
    };

    return {
        bootstramp,
    };
})(Model, View);

Controller.bootstramp();