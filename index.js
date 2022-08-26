import { Api } from './api.js'

// ------View------
const View = (() => {
    const domstr = {
        courses: ".courses",
    }

    const render = (ele, content) => {
        ele.innerHTML = content;
    };

    const createLists = (arr) => {
        let tmp = "";
        arr.forEach(element => {
            let type = element.required ? "Compulsory" : "Elective"; 
            tmp +=`
                <li>
                    <span>${element.courseName}</span>
                    <span>Course Type: ${type}</span>
                    <span>Course Credit: ${element.credit}</span>
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
    class course {
        
    }

    class State {
        #coursesList = [];

        get coursesList() {
            return this.#coursesList;
        }

        set coursesList(newCoursesList) {
            this.#coursesList = [...newCoursesList];

            const courseContainer = document.querySelector(view.domstr.courses);
            const tagContent = view.createLists(this.#coursesList);
            view.render(courseContainer, tagContent);
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

    const init = () => {
        model.getCourses().then((lists) => {
            state.coursesList = [...lists];
        });
    }

    const bootstramp = () => {
        init();
    };

    return {
        bootstramp,
    };
})(Model, View);

Controller.bootstramp();