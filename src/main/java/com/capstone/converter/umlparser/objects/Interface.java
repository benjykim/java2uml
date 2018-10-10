package com.capstone.converter.umlparser.objects;

import java.util.ArrayList;

public class Interface {
    private int numOfVariables;
    private int numOfMethods;
    private String name;
    private ArrayList<Variable> variables;
    private ArrayList<Method> methods;

    public Interface() {
        this.numOfVariables = 0;
        this.numOfMethods = 0;
        this.name = null;
        this.variables = new ArrayList<>();
        this.methods = new ArrayList<>();
    }

    public int getNumOfVariables() {
        return numOfVariables;
    }

    public int getNumOfMethods() {
        return numOfMethods;
    }

    public String getName() {
        return name;
    }

    public Variable getVariable(int index) {
        return variables.get(index);
    }

    public Method getMethod(int index) {
        return methods.get(index);
    }

    public void setNumOfVariables(int numOfVariables) {
        this.numOfVariables = numOfVariables;
    }

    public void setNumOfMethods(int numOfMethods) {
        this.numOfMethods = numOfMethods;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addVariable(Variable variable){
        variables.add(variable);
    }

    public void addMethod(Method method){
        methods.add(method);
    }
}
