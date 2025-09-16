/* 
 RMIT University Vietnam
 Course: COSC2769 - Full Stack Development
 Semester: 2025B
 Assessment: Assignment 02
 Author: Do Van Tung, Thieu Gia Huy, Nguyen Phi Long
 ID: 4053400, 3975542, 3988413
*/


const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import("web-vitals").then(
            ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(onPerfEntry);
                getFID(onPerfEntry);
                getFCP(onPerfEntry);
                getLCP(onPerfEntry);
                getTTFB(onPerfEntry);
            }
        );
    }
};

export default reportWebVitals;
