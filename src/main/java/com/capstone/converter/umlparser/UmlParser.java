package com.capstone.converter.umlparser;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;

import com.capstone.converter.umlparser.objects.Class;
import com.google.gson.*;
import com.capstone.converter.umlparser.objects.*;
import com.capstone.converter.umlparser.utils.*;

public class UmlParser {
    private static final String path = "C:\\Users\\Jiyong Kim\\Desktop\\converter\\tests\\test1\\input.txt";
    private String arg0;
    private String arg1;
    private String arg2;
    private String json;

    // args from client
    public UmlParser(String arg0, String arg1, String arg2) {
        this.arg0 = arg0;
        this.arg1 = arg1;
        this.arg2 = arg2;
    }

    public String getJson() throws Exception {
        if (arg0.equals("class")) {
            ParseEngine pe = new ParseEngine(arg1, arg2);

            String yumlStr = pe.start();
            System.out.println("YUML FORMAT: " + yumlStr);

            json = yumlToJson(yumlStr);
            System.out.println("JSON FORMAT: " + json);

            File file = new File(path);
            BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(file));

            if(file.isFile() && file.canWrite()) {
                bufferedWriter.write(json);
                bufferedWriter.close();
            }
        } else {
            System.out.println("Invalid keyword " + arg0);
        }

        return json;
    }

    private String yumlToJson(String str) {
        Gson gson = new Gson();
        Data data = new Data();
        ArrayList<String> classArray = new ArrayList<>();
        ArrayList<String> interfaceArray = new ArrayList<>();
        ArrayList<String> extendsArray = new ArrayList<>();
        ArrayList<String> implementsArray = new ArrayList<>();
        String[] eachClassArray = str.split(",");

        setTotalNumOfClassesAndInterfaces(data, classArray, interfaceArray, extendsArray, implementsArray, eachClassArray);
        setSkeletonData(data, extendsArray.size(), implementsArray.size());
        setInheritanceRelationElement(data, extendsArray);
        setInterfaceRelationElement(data, implementsArray);
        addClasses(data, classArray);
        addInterfaces(data, interfaceArray);

        return gson.toJson(data);
    }

    private void setTotalNumOfClassesAndInterfaces(Data data, ArrayList<String> classArray, ArrayList<String> interfaceArray, ArrayList<String> extendsArray ,
                                                   ArrayList<String> implementsArray, String[] eachClassArray) {
        int classCount = 0;
        int interfaceCount = 0;

        for (String s : eachClassArray) {
            if (!s.isEmpty()) {
                if (!s.contains("-^") && !s.contains("-.-^") && !s.contains("interface")) {
                    classArray.add(s);
                    classCount += 1;
                }
                else if (s.contains("-.-^"))
                    implementsArray.add(s);
                else if (s.contains("-^"))
                    extendsArray.add(s);
                else if (s.contains("<<interface>>")) {
                    interfaceArray.add("[" + s.substring(15));
                    interfaceCount++;
                }
            }
        }
        data.setNumOfClasses(classCount);
        data.setNumOfInterfaces(interfaceCount);
    }

    private void setSkeletonData(Data data, int extendsArraySize, int implementsArraySize) {
        data.setInheritanceRelation();
        data.setInterfaceRelation();
        data.getInheritanceRelation().setNumOfInheritances(extendsArraySize);
        data.getInterfaceRelation().setNumOfInterfaces(implementsArraySize);
    }

    private void setInheritanceRelationElement(Data data, ArrayList<String> extendsArray) {
        int i;

        for (i = 0; i < extendsArray.size(); i++) {
            String elementArray[] = extendsArray.get(i).split("\\-\\^");
            RelationElement relationElement = new RelationElement();
            int startIndex = elementArray[0].indexOf('[');
            int endIndex = elementArray[0].indexOf(']');

            relationElement.setFrom(elementArray[0].substring(startIndex + 1, endIndex));
            startIndex = elementArray[1].indexOf('[');
            endIndex = elementArray[1].indexOf(']');
            relationElement.setTo(elementArray[1].substring(startIndex + 1, endIndex));
            data.getInheritanceRelation().addRelationElement(relationElement);
        }
    }


    private void setInterfaceRelationElement(Data data, ArrayList<String> implementsArray) {
        int i;

        for (i = 0; i < implementsArray.size(); i++) {
            String elementArray[] = implementsArray.get(i).split("\\-\\.\\-\\^");
            RelationElement relationElement = new RelationElement();
            int startIndex = elementArray[0].indexOf('[');
            int endIndex = elementArray[0].indexOf(']');

            relationElement.setFrom(elementArray[0].substring(startIndex + 1, endIndex));
            startIndex = elementArray[1].indexOf(';');
            endIndex = elementArray[1].indexOf(']');
            relationElement.setTo(elementArray[1].substring(startIndex + 1, endIndex));
            data.getInterfaceRelation().addRelationElement(relationElement);
        }
    }

    private void setClassSkeletonData(int totalNumOfVariables, int totalNumOfMethods, String className, String[] elementArray, Class clazz) {
        if (elementArray.length > 1)
            totalNumOfVariables = elementArray[1].trim().split(";").length;

        if (elementArray.length > 2)
            totalNumOfMethods = elementArray[2].trim().split(";").length;

        clazz.setNumOfVariables(totalNumOfVariables);
        clazz.setNumOfMethods(totalNumOfMethods);
        clazz.setName(className);
        clazz.setAccessModifier("public");
    }

    private void setClassVariableData(String[] elementArray, Class clazz) {
        if (elementArray.length > 1) {
            for (String elem : elementArray[1].split(";")) {
                elem = elem.replaceAll(" ", "");
                Variable variable = new Variable();
                String[] tmp = elem.trim().split(":");
                String type;

                if (tmp[0].charAt(0) == '+') {
                    variable.setAccessModifier("public");
                } else if (tmp[0].charAt(0) == '-') {
                    variable.setAccessModifier("private");
                }

                variable.setName(tmp[0].substring(1));
                type = tmp[tmp.length - 1];

                if (type.endsWith("]") && !type.contains("[]"))
                    type = type.substring(0, type.length() - 1);

                variable.setType(type);
                clazz.addVariable(variable);
            }
        }
    }

    // method 2개 이상일 때 고려해서 코드 수정해야함...리팩토링 하다 버그생김
    // 만일 클래스에 메소드가 없는 경우?도 고려해야함.
    private void setClassMethodData(String[] elementArray, Class clazz) {
        if (elementArray.length > 1) {
            elementArray[2] = elementArray[2].replaceAll("]$", "").replaceAll(" ", "");
            String methodInfo = elementArray[2];
            String[] methodInfoArray = methodInfo.trim().split(";");
            int startIndex;
            int endIndex;
            int paramCount;
            int i;
            boolean isVoid = false;

            for (i = 0; i < methodInfoArray.length; i++) {
                Method method = new Method();
                String[] formalParamArray = null;
                startIndex = methodInfoArray[i].indexOf("(");
                endIndex = methodInfoArray[i].indexOf(")");
                // If there are no parameters
                if (startIndex == -1) {
                    isVoid = true;
                    startIndex = endIndex;
                }
                setAccessModifier(method, methodInfoArray, i);
                // here
                System.out.println("methodInfoArray[i].substring(1, startIndex):"+methodInfoArray[i].substring(1, startIndex));
                method.setName(methodInfoArray[i].substring(1, startIndex));


                method.setReturnType(methodInfoArray[i].substring(endIndex + 2));
                paramCount = countParams(methodInfoArray, i, startIndex, endIndex);
                method.setNumOfParameters(paramCount);
                if (!isVoid) {
                    formalParamArray = methodInfoArray[i].substring(startIndex + 1, endIndex).split("\\.");
                }
                addFormalParameters(method, formalParamArray, paramCount);
                clazz.addMethod(method);
            }
        }
    }

    private void setAccessModifier(Method method, String[] methodInfoArray, int index) {
        if (methodInfoArray[index].charAt(0) == '+') {
            method.setAccessModifier("public");
        } else if (methodInfoArray[index].charAt(0) == '-') {
            method.setAccessModifier("private");
        }
    }

    private void addFormalParameters(Method method, String[] formalParamArray, int paramCount) {
        for (int i = 0; i < paramCount; i++) {
            FormalParameter formalParameter = new FormalParameter();
            formalParameter.setName(formalParamArray[i].split(":")[0]);
            formalParameter.setType(formalParamArray[i].split(":")[1]);
            method.addFormalParameter(formalParameter);
        }
    }

    private void setInterfaceSkeletonData(Interface _interface, String[] elementArray, String interfaceName, int totalNumOfVariables, int totalNumOfMethods) {
        if (elementArray.length > 1)
            totalNumOfVariables = elementArray[1].trim().split(";").length;
        if (elementArray.length > 2)
            totalNumOfMethods = elementArray[2].trim().split(";").length;

        _interface.setNumOfVariables(totalNumOfVariables);
        _interface.setNumOfMethods(totalNumOfMethods);
        _interface.setName(interfaceName);
    }

    private void setInterfaceVariableData(String[] elementArray, Interface _interface) {
        if (elementArray.length > 1) {
            for (String elem : elementArray[1].split(";")) {
                elem = elem.replaceAll(" ", "");
                Variable variable = new Variable();
                String[] tmp = elem.trim().split(":");

                variable.setName(tmp[0].substring(1));
                variable.setType(tmp[1]);
                _interface.addVariable(variable);
            }
        }
    }

    private void setInterfaceMethods(String[] elementArray, Interface _interface) {
        Method method = new Method();
        elementArray[2] = elementArray[2].replaceAll("]$", "").replaceAll(" ", "");
        String methodInfo = elementArray[2];
        String[] methodInfoArray = methodInfo.trim().split(";");
        int startIndex;
        int endIndex;
        int paramCount;
        int i;

        for (i = 0; i < methodInfoArray.length; i++) {
            startIndex = methodInfoArray[i].indexOf("(");
            endIndex = methodInfoArray[i].indexOf(")");
            method.setName(methodInfoArray[i].substring(1, startIndex));
            method.setReturnType(methodInfoArray[i].substring(endIndex + 2));
            paramCount = countParams(methodInfoArray, i, startIndex, endIndex);
            method.setNumOfParameters(paramCount);
            String[] formalParamArray = methodInfoArray[i].substring(startIndex + 1, endIndex).split("\\.");
            addFormalParameters(method, formalParamArray, paramCount);
            _interface.addMethod(method);
        }
    }

    private int countParams(String[] methodInfoArray, int index, int startIndex, int endIndex) {
        int i;
        int paramCount = 0;

        for (i = 0; i < methodInfoArray[index].substring(startIndex, endIndex).length(); i++)
            if (methodInfoArray[index].substring(startIndex, endIndex).charAt(i) == ':')
                paramCount++;
        return paramCount;
    }

    private void addClasses(Data data, ArrayList<String> classArray) {
        int i;

        for (i = 0; i < classArray.size(); i++) {
            Class clazz = new Class();
            String elementArray[] = classArray.get(i).split("\\|");
            String className = elementArray[0].trim().substring(1, elementArray[0].length());
            int totalNumOfVariables = 0;
            int totalNumOfMethods = 0;

            setClassSkeletonData(totalNumOfVariables, totalNumOfMethods, className, elementArray, clazz);
            setClassVariableData(elementArray, clazz);
            if (elementArray.length > 2)
                setClassMethodData(elementArray, clazz);
            data.addClass(clazz);
        }
    }

    private void addInterfaces(Data data, ArrayList<String> interfaceArray) {
        int i;

        for (i = 0; i < interfaceArray.size(); i++) {
            Interface _interface = new Interface();
            String elementArray[] = interfaceArray.get(i).split("\\|");
            String interfaceName = elementArray[0].trim().substring(1, elementArray[0].length());
            int totalNumOfVariables = 0;
            int totalNumOfMethods = 0;

            setInterfaceSkeletonData(_interface, elementArray, interfaceName, totalNumOfVariables, totalNumOfMethods);
            setInterfaceVariableData(elementArray, _interface);
            setInterfaceMethods(elementArray, _interface);
            data.addInterface(_interface);
        }
    }
}