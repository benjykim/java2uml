package com.capstone.converter.web;

import com.capstone.converter.umlparser.UmlParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {
    @Autowired

    @RequestMapping("/")
    public String index() {
        return "index";
    }

    @ResponseBody
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = "application/json")
    public String umlToCode() {
        String json = "";
        try {
            UmlParser umlParser = new UmlParser("class", "C:\\Users\\Jiyong Kim\\Desktop\\spring-boot-converter\\tests\\test1", "diagram");
            json += umlParser.getJson();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return json;
    }
}
