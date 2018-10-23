#  java2uml 

A Converter which converts Java Source Code to UML Class Diagram and also vice versa. 

 
 
## Table of Contents 

* Requirements
* Motivation
 * Why use java2uml?
 * What is the purpose of java2uml?
* How to use java2uml
 * Java Source Code to UML Class Diagram
 * UML Class Diagram to Java Source Code
* Libraries and Open Source used



## Requirements 

* Intellij IDEA 2018.1.3
* Available only when connected to Internet (because of cdn)
 
 
 
## Motivation

 ### Why use java2uml?
 
Products such as Visual Paradigm, StarUml, and Papyrus have been released to improve understanding of OOP. However, the above products are not efficient and do not provide convenience to users because they need to be clicked one by one. For example, the StarUML tool provides the ability to draw UML from the user interface, but does not have an editor to modify the source code. Therefore, the learner has to check the output through annoying process.
 
 ### What is the purpose of java2uml?
 
 The Java language is complicated and difficult for students to learn because of object-oriented concepts and principles. If you are studying object-oriented concepts or developing using object-oriented languages, you should be able to understand what object-oriented concepts the source code represents. So I made this for those who learning OOP concepts.
 
 
 
## How to use java2uml 

You need to modify 2 predefined paths before using java2uml. 

* First, in UmlParser.java file, you need to change predefined path.  
 ```private static final String path = "C:\\Users\\Ben\\Desktop\\converter\\tests\\test1\\input.txt";``` 

* Second, in HomeController.java file, you also have to change 'path'  
 ```UmlParser umlParser = new UmlParser("class", "path", "diagram");```  
 The umlparser parses the Java files in that path, so you need to modify the path. And also path should be the same as the chrome file download path.
 
* Read details of UmlParser parameters *[here](https://github.com/shubhamvadhera/uml-parser "here")*. And also you can see more details at the link below.



## Libraries and Open Source used

java2uml is made up of three major things.

* First, JavaParser Open Source for analyzing Java files.
* Second, I used [this](https://github.com/shubhamvadhera/uml-parser "this") for translating analyzed Java files to yuml format.
* Third, GoJS Library for drawing the UML Class Diagrams. 
