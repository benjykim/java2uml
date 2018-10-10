package com.capstone.converter.umlparser.objects;

import java.util.ArrayList;

public class Method {
    private String name;
    private String returnType;
    private String accessModifier;
    private int numOfParameters;
    private ArrayList<FormalParameter> formalParameters;

    public Method() {
        this.name = null;
        this.returnType = null;
        this.accessModifier = null;
        this.numOfParameters = 0;
        this.formalParameters = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public String getReturnType() {
        return returnType;
    }

    public String getAccessModifier() {
        return accessModifier;
    }

    public int getNumOfParameters() {
        return numOfParameters;
    }

    public FormalParameter getFormalParamter(int index) {
        return formalParameters.get(index);
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setReturnType(String returnType) {
        this.returnType = returnType;
    }

    public void setAccessModifier(String accessModifier) {
        this.accessModifier = accessModifier;
    }

    public void setNumOfParameters(int numOfParameters) {
        this.numOfParameters = numOfParameters;
    }

    public void addFormalParameter(FormalParameter formalparameter){
        formalParameters.add(formalparameter);
    }
}
