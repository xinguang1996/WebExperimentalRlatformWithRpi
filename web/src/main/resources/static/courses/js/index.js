/**
 * Created by 郭欣光 on 2018/2/9.
 */

var releaseExperimentCharacteristic = false;
var showExperimentalInformationCharacteristic = false;
var showExperimentalInformationExperimentalId;
var startExperimentalCharacteristic = false;
var gotoExperimentalReportCharacteristic = false;
var userName = "";

function getUserInfo() {
    $.ajax({
        url: "/get_user",
        type: "POST",
        cache: false,//设置不缓存
        success: getUserSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
    return false;
}

function getUserSuccess(data) {
    if(data.indexOf("error:") != -1) {
        document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
        document.getElementById("userLogin").click();
    } else {
        var user = JSON.parse(data);
        userName = user['name'];
        role = user['role'];
        if (role.indexOf("教师") == 0) {
            teacherGetCoursesTop5();
        } else {
            var str = "<ul class='nav navbar-nav'>" +
                "<li class='dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
                "我的课程" +
                "</a>" +
                "<ul class='dropdown-menu'>" +
                "<li><a class='' href='#'>Linux基础入门新版</a></li>" +
                "<li><a class=''  href='#'>高级bash编程指南</a></li>" +
                "<li><a class=''  href='#'>java实现记事本</a></li>" +
                "<li><a class='' href='#' >python实现文字聊天室</a></li>" +
                "<li><a class=''  href='#'>查看更多</a></li>" +
                "</ul>" +
                "</li>" +
                "</ul>" +
                "<ul class='nav navbar-nav'>" +
                "<li class='dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
                "欢迎您，" + userName +
                "</a>" +
                "<ul class='dropdown-menu'>" +
                "<li><a class='' href='/home/index.html' >我的主页</a></li>" +
                "<li><a class='' href='#' onclick='javascript:signOut(); return false;' data-toggle='modal' data-target='#signOutModel'>退出登录</a></li>" +
                "</ul>" +
                "</li>" +
                "</ul>";
            document.getElementById("userInfo").innerHTML = str;
        }
        if(releaseExperimentCharacteristic) {
            releaseExperimentCharacteristic = false;
            startExperimentalCharacteristic = false;
            if(role.indexOf("教师") == 0) {
                window.location.href="/developer/index.html";
            } else {
                alert("抱歉，您的身份是：" + role + "  仅有教师可以发布实验！");
            }
        }
        if(showExperimentalInformationCharacteristic) {
            showExperimentalInformationCharacteristic = false;
            startExperimentalCharacteristic = false;
            if(window.location.href.indexOf("?") != -1) {
                if(window.location.href.split("?")[1].indexOf("=") != -1) {
                    var courseId = window.location.href.split("?")[1].split("=")[1];
                    window.location.href = "/courses/show_experimental_information.html?courseId=" + courseId + "&experimentalId=" + showExperimentalInformationExperimentalId;
                } else {
                    alert("找不到课程信息，无法跳转！");
                    window.location.href = "/courses/index.html";
                }
            } else {
                alert("找不到课程信息，无法跳转！");
                window.location.href = "/courses/index.html";
            }
        }
        if(startExperimentalCharacteristic) {
            releaseExperimentCharacteristic = false;
            showExperimentalInformationCharacteristic = false;
            if(window.location.href.indexOf("?") != -1) {
                if(window.location.href.split("?")[1].indexOf("=") != -1) {
                    var courseId = window.location.href.split("?")[1].split("=")[1];
                    window.open("/experiment/index.html?courseId=" + courseId + "&experimentalId=" + showExperimentalInformationExperimentalId);
                    // window.location.href = "/courses/show_experimental_information.html?courseId=" + courseId + "&experimentalId=" + showExperimentalInformationExperimentalId;
                } else {
                    alert("找不到课程信息，无法跳转！");
                    window.location.href = "/courses/index.html";
                }
            } else {
                alert("找不到课程信息，无法跳转！");
                window.location.href = "/courses/index.html";
            }
        }
        if (gotoExperimentalReportCharacteristic) {
            if(role.indexOf("教师") == 0) {
                window.location.href="/experimental_report/index.html";
            } else {
                alert("抱歉，您的身份是：" + role + "  仅有教师可以查看实验报告！");
            }
        }
        setInterval(keepUserConnection, 60000);
        // getVNCNode();
        // document.getElementById("closeLogin").click();
    }
    return false;
}

function login() {
    var id = document.getElementById("id").value;
    var password = document.getElementById("password").value;
    var checkCode = document.getElementById("checkCode").value;
    if(id == "" || password == "" || checkCode == "") {
        // alert("所有字段不允许为空！");
        document.getElementById("loginError").style.display = "block";
        document.getElementById("loginErrorMessage").innerHTML = "所有字段不可以为空！";
        document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
        setTimeout(clearLoginError, 1500);
        return false;
    }
    var obj = new Object();
    obj.id = id;
    obj.password = password;
    obj.checkCode = checkCode;

    $.ajax({
        url: "/login",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: loginSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
    return false;
}

function loginSuccess(data) {
    if(data.indexOf("ok") != -1) {
        getUserInfo();
        document.getElementById("closeLogin").click();
    } else {
        // alert(data);
        document.getElementById("loginError").style.display = "block";
        document.getElementById("loginErrorMessage").innerHTML = data;
        document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
        setTimeout(clearLoginError, 1500);
        return false;
    }
}

function clearLoginError() {
    if(document.getElementById("loginError").style.display.indexOf("block") == 0) {
        document.getElementById("loginError").style.display = "none";
        document.getElementById("loginErrorMessage").innerHTML = "";
    }
}

function signOut() {
    $.ajax({
        url: "/sign_out",
        type: "POST",
        cache: false,//设置不缓存
        success: signOutSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function signOutSuccess(data) {
    if(data.indexOf("ok") != -1) {
        window.location.href="/index.html";
    } else {
        alert(data);
        // alert("退出失败！");
    }
}

function keepUserConnection() {
    $.ajax({
        url: "/keep_user_connection",
        type: "POST",
        cache: false,//设置不缓存
        success: keepUserConnectionSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function keepUserConnectionSuccess(data) {
    if(data.indexOf("error") == 0) {
        var str = "<a class=\"btn btn-default navbar-btn sign-in\" data-sign=\"signin\" href=\"#sign-modal\" data-toggle=\"modal\" id=\"userLogin\">登录</a>" +
            "<a class=\"btn btn-default navbar-btn sign-up\" data-sign=\"signup\" href=\"#sign-modal\" data-toggle=\"modal\">注册</a>";
        document.getElementById("userInfo").innerHTML = str;
    }
    console.log(data);
}

function releaseExperiment() {
    showExperimentalInformationCharacteristic = false;
    startExperimentalCharacteristic = false;
    gotoExperimentalReportCharacteristic = false;
    releaseExperimentCharacteristic = true;
    getUserInfo();
}

function getInitUserSuccess(data) {
    if(data.indexOf("error:") != -1) {
        // if(window.location.href.indexOf("show_experimental_information.html") != -1) {
        //     window.location.href = "/index.html";
        // }
    } else {
        var user = JSON.parse(data);
        userName = user['name'];
        var role = user['role'];
        if (role.indexOf("教师") == 0) {
            teacherGetCoursesTop5();
        } else {
            var str = "<ul class='nav navbar-nav'>" +
                "<li class='dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
                "我的课程" +
                "</a>" +
                "<ul class='dropdown-menu'>" +
                "<li><a class='' href='#'>Linux基础入门新版</a></li>" +
                "<li><a class=''  href='#'>高级bash编程指南</a></li>" +
                "<li><a class=''  href='#'>java实现记事本</a></li>" +
                "<li><a class='' href='#' >python实现文字聊天室</a></li>" +
                "<li><a class=''  href='#'>查看更多</a></li>" +
                "</ul>" +
                "</li>" +
                "</ul>" +
                "<ul class='nav navbar-nav'>" +
                "<li class='dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
                "欢迎您，" + userName +
                "</a>" +
                "<ul class='dropdown-menu'>" +
                "<li><a class='' href='/home/index.html' >我的主页</a></li>" +
                "<li><a class='' href='#' onclick='javascript:signOut(); return false;' data-toggle='modal' data-target='#signOutModel'>退出登录</a></li>" +
                "</ul>" +
                "</li>" +
                "</ul>";
            document.getElementById("userInfo").innerHTML = str;
        }
    }
    return false;
}

function showExperimentalInformation(experimentalId) {
    releaseExperimentCharacteristic = false;
    startExperimentalCharacteristic = false;
    gotoExperimentalReportCharacteristic = false;
    showExperimentalInformationCharacteristic = true;
    showExperimentalInformationExperimentalId = experimentalId;
    getUserInfo();
}

function startExperimental(experimentalId) {
    releaseExperimentCharacteristic = false;
    showExperimentalInformationCharacteristic = false;
    gotoExperimentalReportCharacteristic = false;
    startExperimentalCharacteristic = true;
    showExperimentalInformationExperimentalId = experimentalId;
    getUserInfo();
}

function teacherGetCoursesTop5() {
    $.ajax({
        url: "/get_my_courses_top_5",
        type: "POST",
        cache: false,//设置不缓存
        success: teacherGetCoursesTop5Success,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function teacherGetCoursesTop5Success(data) {
    if(data.indexOf("没有用户！") == 0) {
        setTimeout("teacherGetCoursesTop5()", 500);
    } else {
        if(data.indexOf("没有课程！") == 0) {
            var str = "<ul class='nav navbar-nav'>" +
                "<li class='dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
                "我的课程" +
                "</a>" +
                "<ul class='dropdown-menu'>" +
                "<li><a class='' href=''>" + data + "</a></li>" +
                "</ul>" +
                "</li>" +
                "</ul>" +
                "<ul class='nav navbar-nav'>" +
                "<li class='dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
                "欢迎您，" + userName +
                "</a>" +
                "<ul class='dropdown-menu'>" +
                "<li><a class='' href='/home/index.html' >我的主页</a></li>" +
                "<li><a class='' href='/add_user/index.html' >添加用户</a></li>" +
                "<li><a class='' href='' onclick='javascript:signOut(); return false;' data-toggle='modal' data-target='#signOutModel'>退出登录</a></li>" +
                "</ul>" +
                "</li>" +
                "</ul>";
            document.getElementById("userInfo").innerHTML = str;
        } else {
            var str = "<ul class='nav navbar-nav'>" +
                "<li class='dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
                "我的课程" +
                "</a>" +
                "<ul class='dropdown-menu'>";
            var courses = JSON.parse(data)['teacherCourses'];
            for(var i = 0; i < courses.length; i++) {
                var course = courses[i];
                str += "<li><a class='' href='/developer/course_information.html?courseID=" + course.id + "'>" + course.name + "</a></li>";
            }
            if (courses.length >= 5) {
                str += "<li><a class=''  href='/developer/index.html'>查看更多</a></li>" ;
            }
            str += "</ul>" +
                "</li>" +
                "</ul>" +
                "<ul class='nav navbar-nav'>" +
                "<li class='dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
                "欢迎您，" + userName +
                "</a>" +
                "<ul class='dropdown-menu'>" +
                "<li><a class='' href='/home/index.html' >我的主页</a></li>" +
                "<li><a class='' href='/add_user/index.html' >添加用户</a></li>" +
                "<li><a class='' href='' onclick='javascript:signOut(); return false;' data-toggle='modal' data-target='#signOutModel'>退出登录</a></li>" +
                "</ul>" +
                "</li>" +
                "</ul>";
            document.getElementById("userInfo").innerHTML = str;
        }
    }
}

function gotoExperimentalReport() {
    releaseExperimentCharacteristic = false;
    startExperimentalCharacteristic = false;
    showExperimentalInformationCharacteristic = false;
    gotoExperimentalReportCharacteristic = true;
    getUserInfo();
}

$(document).ready(function () {
    $.ajax({
        url: "/get_user",
        type: "POST",
        cache: false,//设置不缓存
        success: getInitUserSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
});
