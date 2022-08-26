export const Api = (() => {
    const baseUrl = "http://localhost:4232/courseList";

    const getCourses = () => 
        fetch(baseUrl).then(response => response.json());

    return {
        getCourses,
    };
})();