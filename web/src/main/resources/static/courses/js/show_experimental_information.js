/**
 * Created by 郭欣光 on 2018/2/25.
 */

function getCourseInfo() {
    if(window.location.href.indexOf("?") != -1) {
        if(window.location.href.split("?")[1].indexOf("&") != -1) {
            if(window.location.href.split("?")[1].split("&")[0].indexOf("=") != -1) {
                var courseID = window.location.href.split("?")[1].split("&")[0].split("=")[1];
                var obj = new Object();
                obj.courseId = courseID;
                $.ajax({
                    url: "/get_course_info",
                    type: "POST",
                    cache: false,//设置不缓存
                    data: obj,
                    success: getCourseInfoSuccess,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest.status);
                        alert(XMLHttpRequest.readyState);
                        alert(textStatus);
                    }
                });
            } else {
                alert("无法获得课程信息！");
                window.location.href = "/courses/index.html";
            }
        } else {
            alert("无法获得课程信息！");
            window.location.href = "/courses/index.html";
        }
    } else {
        alert("无法获得课程信息！");
        window.location.href = "/index.html";
    }
}

function getCourseInfoSuccess(data) {
    if(data.indexOf("没有该课程！") == 0) {
        alert(data);
        window.location.href = "/courses/index.html";
    } else {
        var course = JSON.parse(data);
        document.getElementById("courseTab").innerHTML = "<a href=\"/courses/index.html?tag=" + course['tab'] + "&page=1\">" + course['tab'] + "</a>";
        document.getElementById("courseURL").innerHTML = "<a href=\"/courses/show.html?courseId=" + course['id'] + "\">" + course['name'] + "</a>";
        // document.getElementById("courseURL").href = "/courses/show.html?courseId=" + course['id'];
        // document.getElementById("courseURL").innerHTML = course['name'];
        document.getElementById("courseName").innerHTML = course['name'];
        document.getElementById("courseDescription").innerHTML = course['description'];
        var createTime = course['createTime'];
        var modificationTime = course['modificationTime'];
        createTime = createTime.split(".")[0];
        modificationTime = modificationTime.split(".")[0];
        document.getElementById("courseCreateTime").innerHTML = createTime;
        document.getElementById("courseModificationTime").innerHTML = modificationTime;
        document.getElementById("courseImg").src = "/user/course/img/" + course['img'];
        document.getElementById("courseImgMobile").src = "/user/course/img/" + course['img'];
        getCourseTeacherInfo(course['teacher']);
        getCoursesCount(course['teacher']);
    }
}

function getCourseTeacherInfo(teacherId) {
    var obj = new Object();
    obj.teacherId = teacherId;
    $.ajax({
        url: "/get_teacher_info",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: getTeacherInfoSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function getTeacherInfoSuccess(data) {
    var teacher = JSON.parse(data);
    document.getElementById("courseTeacher").innerHTML = teacher['name'];
}

function getCoursesCount(teacherId) {
    var obj = new Object();
    obj.teacherId = teacherId;
    $.ajax({
        url: "/get_teacher_courses_count",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: getCoursesCountSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function getCoursesCountSuccess(data) {
    document.getElementById("coursesCount").innerHTML = data;
}

function getCourseExperimentalTop5() {
    var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    var obj = new Object();
    obj.courseId = courseId;
    $.ajax({
        url: "/get_course_experimental_top5",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: getCourseExperimentalTop5Success,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function getCourseExperimentalTop5Success(data) {
    if(data.indexOf("该课程暂时没有实验内容！") == 0) {
        document.getElementById("experimentalDocuments").innerHTML = data;
    } else {
        var str = "";
        var obj = JSON.parse(data);
        var experimentalDocumentList = obj.experimentalDocument;
        var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
        for(var i = 0; i < experimentalDocumentList.length; i++) {
            str += "<a href=\"/courses/show_experimental_information.html?courseId=" + experimentalDocumentList[i].courseId + "&experimentalId=" + experimentalDocumentList[i].id + "\">" + experimentalDocumentList[i].title + "</a>";
        }
        if(experimentalDocumentList.length >= 5) {
            str += "<a href=\"/courses/show.html?courseId=" + experimentalDocumentList[0].courseId + "\">查看更多</a>";
        }
        document.getElementById("experimentalDocuments").innerHTML = str;
    }
}

function getExperimentalInformation() {
    if(window.location.href.indexOf("?") != -1) {
        if(window.location.href.split("?")[1].indexOf("&") != -1) {
            if(window.location.href.split("?")[1].split("&")[1].indexOf("=") != -1) {
                var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
                var obj = new Object();
                obj.experimentalId = experimentalId;
                $.ajax({
                    url: "/get_experimental_information",
                    type: "POST",
                    cache: false,//设置不缓存
                    data: obj,
                    success: getExperimentalInformationSuccess,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest.status);
                        alert(XMLHttpRequest.readyState);
                        alert(textStatus);
                    }
                });
            } else {
                alert("无法获得实验内容！");
                window.location.href = "/courses/index.html";
            }
        } else {
            alert("无法获得实验内容！");
            window.location.href = "/courses/index.html";
        }
    } else {
        alert("无法获得实验内容！");
        window.location.href = "/courses/index.html";
    }
}

function getExperimentalInformationSuccess(data) {
    if(data.indexOf("error:") == 0) {
        alert(data.split("error:")[1]);
        window.location.href = "/courses/index.html";
    } else {
        var experimentalInformation = JSON.parse(data);
        document.title = experimentalInformation['title'] + " - 实验楼";
        document.getElementById("experimentalDocumentTitle").innerHTML = experimentalInformation['title'];
        if(experimentalInformation['content'].indexOf("pdf") == 0) {
            var windowHeight = window.screen.availHeight;
            var str = "<iframe id = \"experimentalDoc\" name=\"experimentalDoc\" frameborder=\"0\" src=\"" + experimentalInformation['experimentalUrl'] + "?experimentalNoCache=" + Math.random() + "\" height=\"" + (0.55 * windowHeight) + "px\" width=\"100%\" ></iframe>";
            document.getElementById("labs").innerHTML = str;
        } else {
            document.getElementById("labs").innerHTML = experimentalInformation['content'];
        }
    }
}

$(document).ready(function () {
    getCourseInfo();
    getCourseExperimentalTop5();
    getExperimentalInformation();
});
