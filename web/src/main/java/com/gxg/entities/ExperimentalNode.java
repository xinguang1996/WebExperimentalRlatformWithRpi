package com.gxg.entities;

import org.json.JSONObject;

import javax.validation.constraints.Size;
import java.sql.Timestamp;

/**
 * Created by 郭欣光 on 2017/12/28.
 */


public class ExperimentalNode {

    @Size(max = 15)
    private String ip;//实验节点ip
    private String userId;//用户id
    private Timestamp datetime;//用户使用的时间

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Timestamp getDatetime() {
        return datetime;
    }

    public void setDatetime(Timestamp datetime) {
        this.datetime = datetime;
    }

    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.accumulate("ip", this.ip);
        jsonObject.accumulate("userId", this.userId);
        jsonObject.accumulate("datetime", this.datetime);
        return jsonObject.toString();
    }
}
