package com.capstone.converter.web;

import com.capstone.converter.domain.Hello;
import com.capstone.converter.domain.HelloDao;
import com.capstone.converter.umlparser.UmlParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class HomeController {
    @Autowired
    private HelloDao helloDao;

    @RequestMapping("/")
    public String index() {
      /*  try {
            UmlParser umlParser = new UmlParser("class", "C:\\Users\\Jiyong Kim\\Downloads", "diagram");
            System.out.println("result in Controller : " + umlParser.getJson());

        } catch (Exception e) {
            e.printStackTrace();
        }*/
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
/*
    @RequestMapping("/list")
    public List<Hello> list(Model model) {
        List<Hello> helloList = helloDao.findAll();
        return helloList;
    }*/
}
