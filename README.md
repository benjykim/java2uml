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
* License
 

## Requirements

* Java JDK version 1.8
* Available only when connected to Internet (because of cdn)
 
 
## Motivation

 ### Why use java2uml?
 
Products such as Visual Paradigm, StarUml, and Papyrus have been released to improve understanding of OOP. However, the above products are not efficient and do not provide convenience to users because they need to be clicked one by one. For example, the StarUML tool provides the ability to draw UML from the user interface, but does not have an editor to modify the source code. Therefore, the learner has to check the output through annoying process.
 
 ### What is the purpose of java2uml?
 
 The Java language is complicated and difficult for students to learn because of object-oriented concepts and principles. If you are studying object-oriented concepts or developing using object-oriented languages, you should be able to understand what object-oriented concepts the source code represents. So I made this for those who learning OOP concepts.
 
 
## How to use java2uml 

You need to modify 2 predefined paths before using java2uml. 

* First, in UmlParser.java file, you need to change predefined path. The umlparser parses the Java files in that path, so you need to modify the path. And also path should be the same as the chrome file download path.

* Second, in HomeController.java file, you also have to change 'path' 
========================================================================
 ```UmlParser umlParser = new UmlParser("class", "path", "diagram");```
 
* Read details of UmlParser parameters *[here](https://github.com/shubhamvadhera/uml-parser "here")*. And also you can see more details at the link below.

 ### Link
 [How to use java2uml](https://www.youtube.com/watch?v=XE8KC8to9No "How to use java2uml")



## Libraries and Open Source used

java2uml is made up of three major things.

* First, I used JavaParser Open Source for analyzing Java files.
* Second, [here](https://github.com/shubhamvadhera/uml-parser "here") for translating analyzed Java files to yuml format.
* Third, GoJS Library for drawing the UML Class Diagrams. 


## License 

``` 
Copyright 2018 Ben 
 
Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at 
 
       http://www.apache.org/licenses/LICENSE-2.0 
 
Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License. 
```

``` 
MIT License

Copyright (c) 2018 Ben

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
